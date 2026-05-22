// // =========================
// // VALIDACIÓN DE PREGUNTAS
// // =========================

// export function isQuestionValid(q) {
//   return (
//     q.statement?.trim().length > 0 &&
//     q.options.every((o) => o?.trim().length > 0) &&
//     q.correctAnswer !== null &&
//     q.correctAnswer !== undefined
//   );
// }

// // =========================
// // VALIDAR SI HAY PREGUNTAS INVÁLIDAS
// // =========================
// export function hasInvalidQuestions(questions) {
//   return questions.some((q) => !isQuestionValid(q));
// }

// // =========================
// // VALIDAR SI EL EXAMEN ESTÁ VACÍO
// // =========================
// export function hasEmptyExam(questions) {
//   return !questions || questions.length === 0;
// }

// // =========================
// // VALIDACIÓN COMPLETA
// // =========================
// export function validateExam(questions) {
//   if (hasEmptyExam(questions)) {
//     return {
//       ok: false,
//       message: "No hay preguntas en el examen",
//     };
//   }

//   if (hasInvalidQuestions(questions)) {
//     return {
//       ok: false,
//       message: "Existen preguntas incompletas",
//     };
//   }

//   return {
//     ok: true,
//     message: "Examen válido",
//   };
// }

// // =========================
// // ESTADO VISUAL
// // =========================
// export function getQuestionStatus(q) {
//   return {
//     statement: !!q.statement?.trim(),

//     options: q.options.map((o) => !!o?.trim()),

//     answer:
//       q.correctAnswer !== null &&
//       q.correctAnswer !== undefined,
//   };
// }

// // =========================
// // PORCENTAJE COMPLETADO
// // =========================
// export function getQuestionProgress(q) {
//   let total = 3;
//   let completed = 0;

//   // ENUNCIADO
//   if (q.statement?.trim()) {
//     completed++;
//   }

//   // OPCIONES
//   const optionsOk = q.options.every(
//     (o) => o?.trim().length > 0,
//   );

//   if (optionsOk) {
//     completed++;
//   }

//   // RESPUESTA
//   const answerOk =
//     q.correctAnswer !== null &&
//     q.correctAnswer !== undefined;

//   if (answerOk) {
//     completed++;
//   }

//   return Math.round((completed / total) * 100);
// }


/* =========================
   VALIDAR PREGUNTA
========================= */
export function isQuestionValid(q) {

  // validar enunciado
  const hasStatement =
    q.statement?.trim().length > 0;

  // validar solo opciones visibles
  const visibleOptions =
    q.options.slice(0, q.optionCount);

  const hasOptions =
    visibleOptions.every(
      (o) =>
        o &&
        o.trim().length > 0
    );

  // validar respuesta correcta
  const hasAnswer =
    q.correctAnswer !== null &&
    q.correctAnswer !== undefined;

  return (
    hasStatement &&
    hasOptions &&
    hasAnswer
  );
}

/* =========================
   PREGUNTAS INVÁLIDAS
========================= */
export function hasInvalidQuestions(
  questions,
) {
  return questions.some(
    (q) => !isQuestionValid(q)
  );
}

/* =========================
   EXAMEN VACÍO
========================= */
export function hasEmptyExam(
  questions,
) {
  return (
    !questions ||
    questions.length === 0
  );
}

/* =========================
   VALIDACIÓN GENERAL
========================= */
export function validateExam(
  questions,
) {

  if (
    hasEmptyExam(questions)
  ) {
    return {
      ok: false,
      message:
        "No hay preguntas en el examen",
    };
  }

  if (
    hasInvalidQuestions(
      questions
    )
  ) {
    return {
      ok: false,
      message:
        "Existen preguntas incompletas",
    };
  }

  return {
    ok: true,
    message: "Examen válido",
  };
}

/* =========================
   ESTADO VISUAL
========================= */
export function getQuestionStatus(q) {

  const visibleOptions =
    q.options.slice(
      0,
      q.optionCount
    );

  return {
    statement:
      !!q.statement?.trim(),

    options:
      visibleOptions.map(
        (o) =>
          !!o?.trim()
      ),

    answer:
      q.correctAnswer !== null &&
      q.correctAnswer !== undefined,
  };
}