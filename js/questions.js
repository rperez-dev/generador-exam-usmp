import { state } from "./state.js";

import { showAlert, showConfirm } from "./modal.js";

import {
  validateExam,
} from "./validators.js";

import { isDocente } from "./permissions/permissions.js";

const questionsContainer = document.getElementById("questionsContainer");

const counter = document.getElementById("questionCounter");

/* =========================
   CREATE QUESTION
========================= */

function getAvailableDifficulty() {
  const easy = countQuestionsByLevel("FACIL");

  const medium = countQuestionsByLevel("INTERMEDIO");

  const hard = countQuestionsByLevel("DIFICIL");

  if (easy < state.limits.FACIL) {
    return "FACIL";
  }

  if (medium < state.limits.INTERMEDIO) {
    return "INTERMEDIO";
  }

  if (hard < state.limits.DIFICIL) {
    return "DIFICIL";
  }

  return null;
}

function createQuestion() {
  const optionCount = isDocente() ? 5 : 4;

  return {
    id: Date.now() + Math.random(),

    statement: "",

    difficulty: getAvailableDifficulty(),

    optionCount,

    options: optionCount === 5 ? ["", "", "", "", ""] : ["", "", "", ""],

    correctAnswer: null,

    imageEnabled: false,

    image: null,

    collapsed: false,
  };
}

/* =========================
   COUNT
========================= */

function countQuestionsByLevel(level, excludeId = null) {
  return state.questions.filter(
    (q) => q.difficulty === level && q.id !== excludeId,
  ).length;
}

function canUseLevel(level, excludeId = null) {
  return countQuestionsByLevel(level, excludeId) < state.limits[level];
}

function getConfiguredTotal() {
  return state.limits.FACIL + state.limits.INTERMEDIO + state.limits.DIFICIL;
}

/* =========================
   COUNTER
========================= */

function updateCounter() {
  const easy = countQuestionsByLevel("FACIL");

  const medium = countQuestionsByLevel("INTERMEDIO");

  const hard = countQuestionsByLevel("DIFICIL");

  const configuredTotal = getConfiguredTotal();

  let completed = 0;

  state.questions.forEach((q) => {
    const visibleOptions = q.options.slice(0, q.optionCount);

    const statementOk = !!q.statement?.trim();

    const optionsOk = visibleOptions.every((o) => o?.trim());

    const answerOk = q.correctAnswer !== null && q.correctAnswer !== undefined;

    if (statementOk && optionsOk && answerOk) {
      completed++;
    }
  });

  const progress =
    configuredTotal > 0 ? Math.round((completed / configuredTotal) * 100) : 0;

  counter.innerHTML = `
    <div class="counter-item counter-easy">
      <strong>Fácil</strong>
      <span>${easy}/${state.limits.FACIL}</span>
    </div>

    <div class="counter-item counter-medium">
      <strong>Intermedio</strong>
      <span>${medium}/${state.limits.INTERMEDIO}</span>
    </div>

    <div class="counter-item counter-hard">
      <strong>Difícil</strong>
      <span>${hard}/${state.limits.DIFICIL}</span>
    </div>

    <div class="counter-item counter-total">
      <strong>Total</strong>
      <span>${completed}/${configuredTotal}</span>
    </div>

    <div class="counter-progress">
      <div class="progress-header">
        <strong>Progreso examen</strong>
        <span>${progress}%</span>
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

  state.questions.forEach((q, index) => {
    if (isDocente()) {
      q.optionCount = 5;
    }

    const card = document.createElement("div");

    card.className = "question-card";

    card.innerHTML = `
      <div class="question-header">

        <div class="question-title">
          <button class="collapse-btn">
            ${q.collapsed ? "▶" : "▼"}
          </button>

          <h3>
            Pregunta ${index + 1}
          </h3>
        </div>

        <button class="delete-icon">
          🗑
        </button>

      </div>

      <div
        class="question-body"
        style="display:${q.collapsed ? "none" : "block"}"
      >

        <div class="inline-grid">

          <div>

            <label>
              Nivel
            </label>

            <select class="difficulty">

              <option value="FACIL">
                FACIL
              </option>

              <option value="INTERMEDIO">
                INTERMEDIO
              </option>

              <option value="DIFICIL">
                DIFICIL
              </option>

            </select>

          </div>

          <div>

            <label>
              Cantidad alternativas
            </label>

            <select
              class="option-count"
              ${isDocente() ? "disabled" : ""}
            >

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
          placeholder="Ingrese el enunciado de la pregunta..."
        >${q.statement}</textarea>

        <label>
          Alternativas
        </label>

        ${q.options
          .slice(0, q.optionCount)
          .map(
            (opt, i) => `
            <div class="option-row">

              <input
                type="radio"
                class="correct"
                data-index="${i}"
                name="correct-${q.id}"
                ${q.correctAnswer === i ? "checked" : ""}
              >

              <input
                type="text"
                class="option-text"
                data-index="${i}"
                value="${opt}"
                placeholder="Alternativa ${i + 1}"
              >

            </div>
          `,
          )
          .join("")}

      </div>
      `;

    /* EVENTS */

    card.querySelector(".difficulty").value = q.difficulty;

    card.querySelector(".option-count").value = q.optionCount;

    card.querySelector(".statement").oninput = (e) => {
      q.statement = e.target.value;
      updateCounter();
    };

    card.querySelector(".option-count").onchange = (e) => {
      if (isDocente()) {
        return;
      }

      const count = Number(e.target.value);

      q.optionCount = count;

      while (q.options.length < count) {
        q.options.push("");
      }

      while (q.options.length > count) {
        q.options.pop();
      }

      render();
    };

    card.querySelectorAll(".option-text").forEach((input) => {
      input.oninput = () => {
        q.options[input.dataset.index] = input.value;

        updateCounter();
      };
    });

    card.querySelectorAll(".correct").forEach((radio) => {
      radio.onchange = () => {
        q.correctAnswer = Number(radio.dataset.index);

        updateCounter();
      };
    });

    card.querySelector(".delete-icon").onclick = () => {
      showConfirm("Eliminar", "¿Eliminar pregunta?", () => {
        state.questions = state.questions.filter((x) => x.id !== q.id);

        if (!state.questions.length) {
          state.questions.push(createQuestion());
        }

        render();
      });
    };

    questionsContainer.appendChild(card);
  });
}

/* =========================
   ADD QUESTION
========================= */

/* =========================
   ADD QUESTION
========================= */

/* =========================
   ADD QUESTION
========================= */

function addQuestion() {

  const validation =
    validateExam(
      state.questions,
      state.limits,
      "ADD",
    );

  if (
    !validation.ok
  ) {

    showAlert(
      validation.title,
      validation.message
    );

    return;
  }

  state.questions.forEach(
    (q) => {
      q.collapsed =
        true;
    },
  );

  const q =
    createQuestion();

  q.collapsed =
    false;

  state.questions.push(
    q
  );

  render();
}

export { createQuestion, render, addQuestion, updateCounter };
