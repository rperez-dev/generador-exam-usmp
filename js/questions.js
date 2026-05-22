import { state } from "./state.js";

import {
  showAlert,
  showConfirm,
} from "./modal.js";

import {
  isQuestionValid,
  getQuestionStatus,
} from "./validators.js";

const questionsContainer =
  document.getElementById(
    "questionsContainer",
  );

const counter =
  document.getElementById(
    "questionCounter",
  );

/* =========================
   CREATE QUESTION
========================= */

function getAvailableDifficulty() {
  const easy =
    countQuestionsByLevel("FACIL");

  const medium =
    countQuestionsByLevel(
      "INTERMEDIO",
    );

  const hard =
    countQuestionsByLevel(
      "DIFICIL",
    );

  // PRIORIDAD
  if (
    easy < state.limits.FACIL
  ) {
    return "FACIL";
  }

  if (
    medium <
    state.limits.INTERMEDIO
  ) {
    return "INTERMEDIO";
  }

  if (
    hard < state.limits.DIFICIL
  ) {
    return "DIFICIL";
  }

  return null;
}

function createQuestion() {
  const difficulty =
    getAvailableDifficulty();

  return {
    id: Date.now() + Math.random(),

    statement: "",

    difficulty,

    optionCount: 4,

    options: ["", "", "", ""],

    correctAnswer: null,

    imageEnabled: false,

    image: null,

    collapsed: false,
  };
}

/* =========================
   COUNT BY LEVEL
========================= */

function countQuestionsByLevel(
  level,
  excludeId = null,
) {
  return state.questions.filter(
    (q) =>
      q.difficulty === level &&
      q.id !== excludeId,
  ).length;
}

/* =========================
   VALIDATE LEVEL LIMIT
========================= */

function canUseLevel(
  level,
  excludeId = null,
) {
  const current =
    countQuestionsByLevel(
      level,
      excludeId,
    );

  return (
    current < state.limits[level]
  );
}

/* =========================
   TOTAL CONFIG
========================= */

function getConfiguredTotal() {
  return (
    state.limits.FACIL +
    state.limits.INTERMEDIO +
    state.limits.DIFICIL
  );
}

/* =========================
   COUNTER
========================= */

function updateCounter() {

  // =========================
  // CONTEO POR NIVEL
  // =========================

  const easy = countQuestionsByLevel(
    "FACIL",
  );

  const medium =
    countQuestionsByLevel(
      "INTERMEDIO",
    );

  const hard = countQuestionsByLevel(
    "DIFICIL",
  );

  // =========================
  // TOTAL CONFIGURADO
  // =========================

  const configuredTotal =
    getConfiguredTotal();

  // =========================
  // PREGUNTAS COMPLETAS
  // =========================

  let completedQuestions = 0;

  state.questions.forEach((q) => {

    const statementOk =
      q.statement?.trim()
        .length > 0;

    const optionsOk =
      q.options.every(
        (o) =>
          o?.trim()
            .length > 0,
      );

    const answerOk =
      q.correctAnswer !==
        null &&
      q.correctAnswer !==
        undefined;

    if (
      statementOk &&
      optionsOk &&
      answerOk
    ) {
      completedQuestions++;
    }
  });

  // =========================
  // PROGRESO
  // =========================

  const progress =
    configuredTotal > 0
      ? Math.round(
          (completedQuestions /
            configuredTotal) *
            100,
        )
      : 0;

  // =========================
  // RENDER COUNTER
  // =========================

  counter.innerHTML = `
  
    <div class="counter-item counter-easy">

      <strong>Fácil</strong>

      <span>
        ${easy}
        /
        ${state.limits.FACIL}
      </span>

    </div>

    <div class="counter-item counter-medium">

      <strong>Intermedio</strong>

      <span>
        ${medium}
        /
        ${state.limits.INTERMEDIO}
      </span>

    </div>

    <div class="counter-item counter-hard">

      <strong>Difícil</strong>

      <span>
        ${hard}
        /
        ${state.limits.DIFICIL}
      </span>

    </div>

    <div class="counter-item counter-total">

      <strong>Total</strong>

      <span>
        ${completedQuestions}
        /
        ${configuredTotal}
      </span>

    </div>

    <div class="counter-progress">

      <div class="progress-header">

        <strong>
          Progreso examen
        </strong>

        <span>
          ${progress}%
        </span>

      </div>

      <div class="progress-bar">

        <div
          class="progress-fill"
          style="width:${progress}%"
        ></div>

      </div>

    </div>
  `;
}

/* =========================
   RENDER
========================= */

function render() {
  questionsContainer.innerHTML = "";

  updateCounter();

  state.questions.forEach(
    (q, index) => {
      const status =
        getQuestionStatus(q);

      const card =
        document.createElement("div");

      card.className = "question-card";

      const showImage =
        state.examType !==
        "VIRTUAL";

      // VALIDACIONES SELECT
      const easyDisabled =
        !canUseLevel(
          "FACIL",
          q.id,
        ) &&
        q.difficulty !== "FACIL";

      const mediumDisabled =
        !canUseLevel(
          "INTERMEDIO",
          q.id,
        ) &&
        q.difficulty !==
          "INTERMEDIO";

      const hardDisabled =
        !canUseLevel(
          "DIFICIL",
          q.id,
        ) &&
        q.difficulty !==
          "DIFICIL";

      card.innerHTML = `
      
      <div class="question-header">

        <div class="question-title">

          <button class="collapse-btn">
            ${
              q.collapsed
                ? "▶"
                : "▼"
            }
          </button>

          <h3>
            Pregunta ${
              index + 1
            }
          </h3>

        </div>

        <button class="delete-icon">
          🗑
        </button>

      </div>

      <div
        class="question-body"
        style="display:${
          q.collapsed
            ? "none"
            : "block"
        }"
      >

        <div class="inline-grid">

          <div>

            <label>Nivel</label>

            <select class="difficulty">

              <option
                value="FACIL"
                ${
                  easyDisabled
                    ? "disabled"
                    : ""
                }
              >
                FACIL
              </option>

              <option
                value="INTERMEDIO"
                ${
                  mediumDisabled
                    ? "disabled"
                    : ""
                }
              >
                INTERMEDIO
              </option>

              <option
                value="DIFICIL"
                ${
                  hardDisabled
                    ? "disabled"
                    : ""
                }
              >
                DIFICIL
              </option>

            </select>

          </div>

          <div>

            <label>
              Cantidad alternativas
            </label>

            <select class="optionCount">

              <option value="4">
                4
              </option>

              <option value="5">
                5
              </option>

            </select>

          </div>

        </div>

        <label>
          Enunciado
        </label>

        <textarea
          class="statement"
          placeholder="Ingrese el enunciado"
        >${q.statement}</textarea>

        <label>
          Alternativas
        </label>

        ${q.options
          .map(
            (opt, i) => `
          
          <div class="option-row">

            <input
              type="radio"
              class="correct"
              name="correct-${q.id}"
              data-index="${i}"
              ${
                q.correctAnswer === i
                  ? "checked"
                  : ""
              }
            >

            <input
              type="text"
              class="option-text"
              data-index="${i}"
              value="${opt}"
              placeholder="Alternativa ${
                i + 1
              }"
            >

          </div>
        `,
          )
          .join("")}

      </div>
    `;

      /* =========================
         EVENTS
      ========================= */

      card.querySelector(
  ".collapse-btn",
).onclick = () => {

  // SI ESTÁ ABIERTA → CERRAR
  if (!q.collapsed) {
    q.collapsed = true;

    render();

    return;
  }

  // CERRAR TODAS
  state.questions.forEach((item) => {
    item.collapsed = true;
  });

  // ABRIR SOLO ESTA
  q.collapsed = false;

  render();
};

      card.querySelector(
        ".delete-icon",
      ).onclick = () => {
        showConfirm(
          "Eliminar",
          "¿Eliminar pregunta?",
          () => {
            state.questions =
              state.questions.filter(
                (x) =>
                  x.id !== q.id,
              );

            if (
              !state.questions.length
            ) {
              state.questions.push(
                createQuestion(),
              );
            }

            render();
          },
        );
      };

      card.querySelector(
        ".statement",
      ).oninput = (e) => {
        q.statement =
          e.target.value;

        updateCounter();
      };

      const difficultySelect =
        card.querySelector(
          ".difficulty",
        );

      difficultySelect.value =
        q.difficulty;

      difficultySelect.onchange = (
        e,
      ) => {
        const newLevel =
          e.target.value;

        // VALIDAR LÍMITE
        if (
          !canUseLevel(
            newLevel,
            q.id,
          )
        ) {
          showAlert(
            "Nivel completado",
            {
              statement: `Ya alcanzaste el límite configurado para ${newLevel}.`,
              options: [],
              correctAnswer: null,
            },
          );

          difficultySelect.value =
            q.difficulty;

          return;
        }

        q.difficulty = newLevel;

        render();
      };

      card.querySelector(
        ".optionCount",
      ).value = q.optionCount;

      card.querySelector(
        ".optionCount",
      ).onchange = (e) => {
        const count = Number(
          e.target.value,
        );

        q.optionCount = count;

        while (
          q.options.length < count
        ) {
          q.options.push("");
        }

        while (
          q.options.length > count
        ) {
          q.options.pop();
        }

        render();
      };

      card
        .querySelectorAll(
          ".option-text",
        )
        .forEach((input) => {
          input.oninput = () => {
            q.options[
              input.dataset.index
            ] = input.value;

             updateCounter();
          };
        });

      card
        .querySelectorAll(
          ".correct",
        )
        .forEach((radio) => {
          radio.onchange = () => {
            q.correctAnswer =
              Number(
                radio.dataset.index,
              );
               updateCounter();
          };
        });

      questionsContainer.appendChild(
        card,
      );
    },
  );
}

/* =========================
   ADD QUESTION
========================= */

function addQuestion() {
  const configuredTotal =
    getConfiguredTotal();

  // TOTAL GLOBAL
  if (
    state.questions.length >=
    configuredTotal
  ) {
    showAlert(
  "Límite de preguntas alcanzado",
  "Ya alcanzaste el total configurado.",
);

    return;
  }

  // VALIDAR PREGUNTA ACTUAL
  const invalid =
    state.questions.find(
      (q) =>
        !isQuestionValid(q),
    );

  if (invalid) {
    showAlert(
      "Pregunta incompleta",
      invalid,
    );

    return;
  }

  // VALIDAR NIVELES DISPONIBLES
  const availableDifficulty =
    getAvailableDifficulty();

  if (!availableDifficulty) {
    showAlert(
  "Niveles completos",
  "Todos los niveles alcanzaron el límite configurado.",
);

    return;
  }

  // COLAPSAR
  state.questions.forEach(
    (q) => {
      q.collapsed = true;
    },
  );

  // NUEVA PREGUNTA
  const newQuestion =
    createQuestion();

  newQuestion.collapsed = false;

  state.questions.push(
    newQuestion,
  );

  render();
}

export {
  createQuestion,
  render,
  addQuestion,
  updateCounter,
};