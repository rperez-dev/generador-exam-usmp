import { state } from "./state.js";

import {
  render,
} from "./questions.js";

/* =========================
   BIND IMPORT
========================= */

export function bindImport() {

  const fileInput =
    document.getElementById(
      "importFile"
    );

  const importBtn =
    document.querySelector(
      ".import-btn"
    );

  const modal =
    document.getElementById(
      "importModal"
    );

  const cancelBtn =
    document.getElementById(
      "importCancel"
    );

  const continueBtn =
    document.getElementById(
      "importContinue"
    );

  const difficultySelect =
    document.getElementById(
      "importDifficulty"
    );

  /* =========================
     ABRIR MODAL
  ========================= */

  importBtn.onclick = (e) => {

    e.preventDefault();

    fileInput.value = "";

    difficultySelect.value =
      "FACIL";

    modal.classList.remove(
      "hidden"
    );
  };

  /* =========================
     CANCELAR
  ========================= */

  cancelBtn.onclick = () => {

    modal.classList.add(
      "hidden"
    );
  };

  /* =========================
     CONTINUAR
  ========================= */

  continueBtn.onclick = () => {

    modal.classList.add(
      "hidden"
    );

    setTimeout(() => {

      fileInput.click();

    }, 120);
  };

  /* =========================
     IMPORTAR ARCHIVO
  ========================= */

  fileInput.onchange =
    async (e) => {

      const file =
        e.target.files[0];

      if (!file) return;

      const text =
        await file.text();

      const difficulty =
        difficultySelect.value;

      importGift(
        text,
        difficulty
      );

      fileInput.value = "";
    };
}

/* =========================
   IMPORT GIFT
========================= */

function importGift(
  text,
  difficulty,
) {

  const blocks =
    text.match(
      /([\s\S]*?)\{([\s\S]*?)\}/g
    );

  if (!blocks) {

    alert(
      "No se encontraron preguntas válidas"
    );

    return;
  }

  /* =========================
     ELIMINAR PREGUNTA VACÍA
  ========================= */

  if (
    state.questions.length === 1 &&
    !state.questions[0]
      .statement?.trim()
  ) {

    state.questions = [];
  }

  /* =========================
     COLAPSAR EXISTENTES
  ========================= */

  state.questions.forEach(
    (q) => {

      q.collapsed = true;
    },
  );

  /* =========================
     IMPORTAR
  ========================= */

  blocks.forEach((block) => {

    const parts =
      block.split("{");

    const statement =
      parts[0].trim();

    const answers =
      parts[1]
        .replace("}", "")
        .trim()
        .split("\n");

    const options = [];

    let correctAnswer =
      null;

    answers.forEach(
      (line, i) => {

        line = line.trim();

        if (
          line.startsWith("=")
        ) {

          correctAnswer = i;

          options.push(
            line.replace(
              /^=\s*/,
              "",
            )
          );

        } else if (
          line.startsWith("~")
        ) {

          options.push(
            line.replace(
              /^~\s*/,
              "",
            )
          );
        }
      },
    );

    state.questions.push({

      id:
        Date.now() +
        Math.random(),

      statement,

      difficulty,

      optionCount:
        options.length,

      options,

      correctAnswer,

      imageEnabled: false,

      image: null,

      collapsed: true,
    });
  });

  /* =========================
     ACTUALIZAR LIMITES
  ========================= */

  const importedCount =
    blocks.length;

  // reset automático
  if (
    state.questions.length ===
    importedCount
  ) {

    state.limits.FACIL = 0;

    state.limits.INTERMEDIO = 0;

    state.limits.DIFICIL = 0;
  }

  state.limits[difficulty] +=
    importedCount;

  /* inputs visuales */

  document.getElementById(
    "easyCount"
  ).value =
    state.limits.FACIL;

  document.getElementById(
    "mediumCount"
  ).value =
    state.limits.INTERMEDIO;

  document.getElementById(
    "hardCount"
  ).value =
    state.limits.DIFICIL;

  /* =========================
     ABRIR ÚLTIMA
  ========================= */

  const lastQuestion =
    state.questions[
      state.questions.length - 1
    ];

  if (lastQuestion) {

    lastQuestion.collapsed =
      false;
  }

  render();
}