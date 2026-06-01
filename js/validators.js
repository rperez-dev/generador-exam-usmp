/* =========================
   VALIDAR PREGUNTA
========================= */

export function isQuestionValid(q) {
  const hasStatement = q.statement?.trim().length > 0;

  const visibleOptions = q.options.slice(0, q.optionCount);

  const hasOptions = visibleOptions.every((o) => o && o.trim().length > 0);

  const hasAnswer = q.correctAnswer !== null && q.correctAnswer !== undefined;

  return hasStatement && hasOptions && hasAnswer;
}

/* =========================
   ESTADO VISUAL
========================= */

export function getQuestionStatus(q) {
  const visibleOptions = q.options.slice(0, q.optionCount);

  return {
    statement: !!q.statement?.trim(),

    options: visibleOptions.every((o) => !!o?.trim()),

    answer: q.correctAnswer !== null && q.correctAnswer !== undefined,
  };
}

/* =========================
   TOTAL POR NIVEL
========================= */

function countByDifficulty(questions, difficulty) {
  return questions.filter((q) => q.difficulty === difficulty).length;
}

/* =========================
   VALIDACIÓN GENERAL
========================= */

export function validateExam(questions, limits, mode = "EXPORT") {
  /* =========================
     EXAMEN VACÍO
  ========================= */

  if (!questions || !questions.length) {
    return {
      ok: false,

      title: "Examen vacío",

      message: `
        <div class="
          validation-box
        ">
          Aún no existen
          preguntas
          registradas.
        </div>
      `,
    };
  }

  /* =========================
     PREGUNTA INCOMPLETA
  ========================= */

  const invalidIndex = questions.findIndex((q) => !isQuestionValid(q));

  if (invalidIndex !== -1) {
    const q = questions[invalidIndex];

    const status = getQuestionStatus(q);

    return {
      ok: false,

      title: "Pregunta incompleta",

      question: q,

      message: `
<div class="validation-box">

  <div class="validation-title">
    Pregunta ${invalidIndex + 1}
  </div>

  <div class="validation-subtitle">
    Complete los siguientes elementos:
  </div>

  <div class="validation-list">

    <div class="validation-item ${status.statement ? "ok" : "bad"}">
      <span class="validation-icon">
        ${status.statement ? "✔" : "✖"}
      </span>

      <span>
        Enunciado
      </span>
    </div>

    <div class="validation-item ${status.options ? "ok" : "bad"}">
      <span class="validation-icon">
        ${status.options ? "✔" : "✖"}
      </span>

      <span>
        Alternativas
      </span>
    </div>

    <div class="validation-item ${status.answer ? "ok" : "bad"}">
      <span class="validation-icon">
        ${status.answer ? "✔" : "✖"}
      </span>

      <span>
        Respuesta correcta
      </span>
    </div>

  </div>

</div>
`,
    };
  }

  /* =========================
     SOLO EXPORT
  ========================= */

  if (mode === "EXPORT") {
    const easy = countByDifficulty(questions, "FACIL");

    const medium = countByDifficulty(questions, "INTERMEDIO");

    const hard = countByDifficulty(questions, "DIFICIL");

    if (
      easy !== limits.FACIL ||
      medium !== limits.INTERMEDIO ||
      hard !== limits.DIFICIL
    ) {
      return {
        ok: false,

        title: "Examen incompleto",

        message: `
        <div class="
          validation-box
        ">

          <div class="
            validation-title
          ">
            Distribución
            requerida
          </div>

          <div>
            Fácil:
            ${easy}/
            ${limits.FACIL}
          </div>

          <div>
            Intermedio:
            ${medium}/
            ${limits.INTERMEDIO}
          </div>

          <div>
            Difícil:
            ${hard}/
            ${limits.DIFICIL}
          </div>

          <br>

          Complete las
          preguntas faltantes
          antes de exportar.
        </div>
        `,
      };
    }
  }

  return {
    ok: true,
  };
}
