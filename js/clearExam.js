import { state } from "./state.js";

import {
  render,
  createQuestion,
} from "./questions.js";

import {
  showConfirm,
} from "./modal.js";

/* =========================
   FECHA DEFAULT
========================= */
function getToday() {

  return new Date()
    .toISOString()
    .split("T")[0];
}

/* =========================
   RESET UI
========================= */
function resetUI() {

  // INPUTS
  document.getElementById(
    "courseName"
  ).value = "";

  document.getElementById(
    "indicator"
  ).value = "";

  document.getElementById(
    "courseDate"
  ).value = getToday();

  // SELECTS
  document.getElementById(
    "examType"
  ).value = "PRESENCIAL";

  document.getElementById(
    "examVersions"
  ).value = "1";

  document.getElementById(
    "examVersions"
  ).disabled = false;

  // LIMITES
  document.getElementById(
    "easyCount"
  ).value = 20;

  document.getElementById(
    "mediumCount"
  ).value = 10;

  document.getElementById(
    "hardCount"
  ).value = 10;
}

/* =========================
   RESET STATE
========================= */
function resetState() {

  state.examType =
    "PRESENCIAL";

  state.examVersions =
    1;

  state.courseName =
    "";

  state.indicator =
    "";

  state.courseDate =
    getToday();

  // LIMITES
  state.limits = {
    FACIL: 20,
    INTERMEDIO: 10,
    DIFICIL: 10,
  };

  // PREGUNTA DEFAULT
  state.questions = [
    createQuestion(),
  ];
}

/* =========================
   CLEAR EXAM
========================= */
function clearExam() {

  showConfirm(
    "Limpiar examen",
    `
      ¿Seguro que deseas limpiar
      todo el examen?
    `,
    () => {

      resetUI();

      resetState();

      render();
    },
  );
}

export {
  clearExam,
};