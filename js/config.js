import { state } from "./state.js";

/* =========================
   INPUTS
========================= */

const course =
  document.getElementById(
    "courseName"
  );

const indicator =
  document.getElementById(
    "indicator"
  );

const date =
  document.getElementById(
    "courseDate"
  );

const examType =
  document.getElementById(
    "examType"
  );

const examVersions =
  document.getElementById(
    "examVersions"
  );

const easyCount =
  document.getElementById(
    "easyCount"
  );

const mediumCount =
  document.getElementById(
    "mediumCount"
  );

const hardCount =
  document.getElementById(
    "hardCount"
  );

/* =========================
   UPDATE LIMITS
========================= */

function updateLimits() {

  state.limits = {

    FACIL:
      Number(
        easyCount.value
      ) || 0,

    INTERMEDIO:
      Number(
        mediumCount.value
      ) || 0,

    DIFICIL:
      Number(
        hardCount.value
      ) || 0,
  };

  renderApp();
}

/* =========================
   BIND CONFIG
========================= */

function bindConfig() {

  /* =========================
     INPUTS
  ========================= */

  course.oninput = (e) => {

  const value =
    e.target.value.toUpperCase();

  e.target.value = value;

  state.courseName = value;
};

indicator.oninput = (e) => {

  const value =
    e.target.value.toUpperCase();

  e.target.value = value;

  state.indicator = value;
};

  date.onchange = (e) => {
    state.courseDate =
      e.target.value;
  };

  /* =========================
     VERSIONES
  ========================= */

  examVersions.onchange = (e) => {

    state.examVersions =
      Number(e.target.value);
  };

  /* =========================
     LIMITES
  ========================= */

  easyCount.oninput =
    updateLimits;

  mediumCount.oninput =
    updateLimits;

  hardCount.oninput =
    updateLimits;

  /* =========================
     MODALIDAD
  ========================= */

  examType.onchange = (e) => {

    state.examType =
      e.target.value;

    /* =========================
       VIRTUAL
    ========================= */

    if (
      state.examType ===
      "VIRTUAL"
    ) {

      // SOLO DESHABILITAR
      examVersions.disabled =
        true;

      // quitar imágenes
      state.questions.forEach(
        (q) => {
          q.imageEnabled =
            false;

          q.image = null;
        }
      );

    } else {

      examVersions.disabled =
        false;
    }

    renderApp();
  };
}

/* =========================
   INIT CONFIG
========================= */

function initConfig() {

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  /* =========================
     FECHA
  ========================= */

  date.value = today;

  state.courseDate = today;

  /* =========================
     VERSIONES
  ========================= */

  examVersions.value = "1";

  state.examVersions = 1;

  /* =========================
     LIMITES INICIALES
  ========================= */

  updateLimits();

  /* =========================
     ESTADO MODALIDAD
  ========================= */

  if (
    state.examType ===
    "VIRTUAL"
  ) {

    examVersions.disabled =
      true;

  } else {

    examVersions.disabled =
      false;
  }
}

/* =========================
   RENDER GLOBAL
========================= */

function renderApp() {

  document.dispatchEvent(
    new Event("render-app")
  );
}

export {
  bindConfig,
  initConfig,
};