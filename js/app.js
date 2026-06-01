import { state } from "./state.js";

import {
  render,
  createQuestion,
  addQuestion,
} from "./questions.js";

import { exportExam } from "./export.js";

import { showConfirm } from "./modal.js";

import {
  bindConfig,
  initConfig,
} from "./config.js";

import {
  bindImport,
} from "./import.js";

import {
  startAuth,
} from "./auth/authGuard.js";

/* =========================
   INIT
========================= */
function init() {
  initConfig();

  state.questions = [createQuestion()];

  state.questions[0].collapsed = false;

  render();

  bindEvents();

  bindConfig();
  
  bindImport();

  document.addEventListener("render-app", render);
}

/* =========================
   EVENTS
========================= */
function bindEvents() {
  const addBtn = document.getElementById("addQuestionBtn");

  const exportBtn = document.getElementById("exportBtn");

  const clearBtn = document.getElementById("clearBtn");

  if (addBtn) addBtn.onclick = addQuestion;

  if (exportBtn) exportBtn.onclick = exportExam;

  if (clearBtn) clearBtn.onclick = clearExam;
}

/* =========================
   CLEAR
========================= */
function clearExam() {
  showConfirm(
    "Confirmar",
    "¿Seguro que deseas eliminar todo el avance?",
    () => {
      state.examType = "PRESENCIAL";

      state.courseName = "";

      state.indicator = "";

      const today = new Date()
        .toISOString()
        .split("T")[0];

      state.courseDate = today;

      state.questions = [createQuestion()];

      state.questions[0].collapsed = false;

      document.getElementById("courseName").value = "";

      document.getElementById("indicator").value = "";

      document.getElementById("examType").value =
        "PRESENCIAL";

      document.getElementById("courseDate").value =
        today;

      render();
    },
  );
}

/* =========================
   START APP
========================= */
document.addEventListener(
  "DOMContentLoaded",
  () => {

    startAuth(
      init
    );
  },
);

export { clearExam };