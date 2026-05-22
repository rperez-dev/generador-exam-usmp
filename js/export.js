import { state } from "./state.js";

import {
  showAlert,
} from "./modal.js";

import {
  hasInvalidQuestions,
  hasEmptyExam,
} from "./validators.js";

/* =========================
   RANDOM
========================= */
function shuffleArray(array) {

  const arr = [...array];

  for (
    let i = arr.length - 1;
    i > 0;
    i--
  ) {

    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [arr[i], arr[j]] =
      [arr[j], arr[i]];
  }

  return arr;
}

/* =========================
   GENERAR TXT VIRTUAL
========================= */
function generateLevelFile(
  questions
) {

  let output = "";

  questions.forEach((q) => {

    const original =
      q.options
        .slice(0, q.optionCount)
        .map((opt, i) => ({
          text: opt,

          isCorrect:
            i === q.correctAnswer,
        }));

    const shuffled =
      shuffleArray(original);

    let correctIndex = 0;

    const options =
      shuffled.map((opt, i) => {

        if (opt.isCorrect) {
          correctIndex = i;
        }

        return opt.text;
      });

    output +=
      `${q.statement}\n{\n` +

      options
        .map(
          (t, i) =>
            `${i === correctIndex ? "=" : "~"} ${t}`
        )
        .join("\n") +

      `\n}\n\n`;
  });

  return output;
}

/* =========================
   LETRAS OPCIONES
========================= */
function getLetter(index) {

  return [
    "a",
    "b",
    "c",
    "d",
    "e",
  ][index];
}

function formatFileName(
  version = ""
) {

  const course =
    (state.courseName || "CURSO")
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^\w\-]/g, "");

  const indicator =
  (state.indicator || "GENERAL")
    .trim()

    // eliminar caracteres raros
    .replace(/[^\w\s-]/g, "")

    // espacios -> -
    .replace(/\s+/g, "-")

    // evitar --- repetidos
    .replace(/-+/g, "-");

  // 2026-05-21 -> 210526
  let formattedDate = "000000";

  if (state.courseDate) {

    const [
      year,
      month,
      day,
    ] =
      state.courseDate.split("-");

    formattedDate =
      `${day}${month}${year.slice(2)}`;
  }

  return `${course}_${indicator}_${formattedDate}_${version}`;
}
/* =========================
   GENERAR HTML PRESENCIAL
========================= */
function generatePresentialHTML(
  questions,
  examLetter,
) {

  const course =
    state.courseName || "Curso";

  const date =
    state.courseDate || "";

  let html = `
  <html>

    <head>

      <meta charset="UTF-8">

      <style>

  body{
    font-family: Arial, sans-serif;
    padding: 28px 40px;
    line-height: 1.35;
    font-size: 12px; /* 🔥 tamaño general */
    color:#000;
  }

  .header{
    margin-bottom: 28px;
  }

  .title{
    text-align:center;
    font-size:18px;
    font-weight:bold;
    margin-bottom:18px;
    letter-spacing:1px;
  }

  .info{
    margin-bottom:6px;
    font-size:12px;
  }

  .question{
    margin-bottom:18px;
    page-break-inside: avoid;
  }

  .question-number{
    font-weight:bold; /* 🔥 numero negrita */
  }

  .statement{
    font-weight:bold; /* 🔥 enunciado negrita */
  }

  .options{
  margin-left:0;
  margin-top:8px;
}

  .option{
  margin-bottom:4px;
  font-size:12px;
  padding-left:0;
}

  .option-letter{
    font-weight:bold; /* 🔥 letra negrita */
  }

</style>

    </head>

    <body>

      <div class="header">

        <div class="title">
          EXAMEN ${examLetter}
        </div>

        <div class="info">
          <strong>Curso:</strong>
          ${course}
        </div>

        <div class="info">
          <strong>Modalidad:</strong>
          PRESENCIAL
        </div>

        <div class="info">
          <strong>Fecha:</strong>
          ${date}
        </div>

      </div>
  `;

  questions.forEach((q, index) => {

    // 🔥 chocolatear alternativas
    const original =
      q.options
        .slice(0, q.optionCount)
        .map((opt, i) => ({
          text: opt,

          isCorrect:
            i === q.correctAnswer,
        }));

    const shuffled =
      shuffleArray(original);

    html += `
  <div class="question">

    <div class="statement">
      <span class="question-number">
        ${index + 1}.
      </span>

      ${q.statement}
    </div>

    <div class="options">
`;

    shuffled.forEach((opt, i) => {

      html += `
  <div class="option">

    <span class="option-letter">
      ${getLetter(i)})
    </span>

    ${opt.text}

  </div>
`;
    });

    html += `
        </div>

      </div>
    `;
  });

  html += `
    </body>
  </html>
  `;

  return html;
}

/* =========================
   DESCARGAR ZIP
========================= */
async function downloadZip(
  zip
) {

  const content =
    await zip.generateAsync({
      type: "blob",
    });

  const url =
    URL.createObjectURL(content);

  const a =
    document.createElement("a");

  a.href = url;

  const zipName =
  formatFileName(
    "VIRTUAL"
  );

a.download =
  `${zipName}.zip`;

  a.click();

  URL.revokeObjectURL(url);
}

/* =========================
   DESCARGAR DOC
========================= */
function downloadDoc(
  filename,
  content,
) {

  const blob =
    new Blob(
      [content],
      {
        type:
          "application/msword",
      }
    );

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;

  a.download = filename;

  a.click();

  URL.revokeObjectURL(url);
}

/* =========================
   EXPORT PRINCIPAL
========================= */
async function exportExam() {

  const questions =
    state.questions;

  /* =========================
     VALIDACIONES
  ========================= */

  if (
    hasEmptyExam(questions)
  ) {

    showAlert(
      "Exportación cancelada",
      "No existen preguntas para exportar.",
    );

    return;
  }

  if (
    hasInvalidQuestions(
      questions
    )
  ) {

    showAlert(
      "Exportación cancelada",
      "Existen preguntas incompletas.",
    );

    return;
  }

  /* =========================
     EXPORT VIRTUAL
  ========================= */

  if (
    state.examType === "VIRTUAL"
  ) {

    const easyLimit =
      Number(
        document.getElementById(
          "easyCount"
        ).value
      );

    const mediumLimit =
      Number(
        document.getElementById(
          "mediumCount"
        ).value
      );

    const hardLimit =
      Number(
        document.getElementById(
          "hardCount"
        ).value
      );

    const config = {
      FACIL: easyLimit,

      INTERMEDIO:
        mediumLimit,

      DIFICIL:
        hardLimit,
    };

    const zip =
      new JSZip();

    Object.entries(config)
      .forEach(
        ([level, limit]) => {

          // 🔥 chocolatear preguntas
          const data =
            shuffleArray(
              questions.filter(
                (q) =>
                  q.difficulty === level
              )
            ).slice(
              0,
              limit
            );

          if (!data.length)
            return;

          const content =
            generateLevelFile(
              data
            );

          zip.file(
            `examen-${level.toLowerCase()}.txt`,
            content,
          );
        },
      );

    await downloadZip(zip);

    return;
  }

  /* =========================
     EXPORT PRESENCIAL
  ========================= */

  const versions =
    ["A", "B", "C"];

  const totalVersions =
    state.examVersions || 1;

  for (
    let i = 0;
    i < totalVersions;
    i++
  ) {

    // 🔥 chocolatear preguntas
    const shuffledQuestions =
      shuffleArray([
        ...questions,
      ]);

    const html =
      generatePresentialHTML(
        shuffledQuestions,
        versions[i],
      );

    const fileName =
  formatFileName(
    versions[i]
  );

downloadDoc(
  `${fileName}.doc`,
  html,
);
  }
}

export {
  exportExam,
};