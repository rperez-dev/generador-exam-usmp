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
   FORMATEAR FECHA LARGA
========================= */
function formatLongDate(dateString) {

  if (!dateString) return "";

  const months = {
    "01": "ENERO",
    "02": "FEBRERO",
    "03": "MARZO",
    "04": "ABRIL",
    "05": "MAYO",
    "06": "JUNIO",
    "07": "JULIO",
    "08": "AGOSTO",
    "09": "SEPTIEMBRE",
    "10": "OCTUBRE",
    "11": "NOVIEMBRE",
    "12": "DICIEMBRE",
  };

  const [
    year,
    month,
    day,
  ] = dateString.split("-");

  return `${Number(day)} DE ${months[month]} DE ${year}`;
}

/* =========================
   GENERAR HTML PRESENCIAL
========================= */
/* =========================
   GENERAR HTML PRESENCIAL
========================= */
function generatePresentialHTML(
  questions,
  examLetter,
) {

  const course =
    state.courseName || "CURSO";

  const indicator =
    state.indicator || "";

  const date =
  formatLongDate(
    state.courseDate
  );

  let html = `
  <html>

  <head>

    <meta charset="UTF-8">

<style>

  @page{
    margin:8px 24px;
  }

  body{
  margin:0;
  padding:0;
  
    font-family: "Aptos Narrow", Arial, sans-serif;
    font-size:10px;
    color:#000;
    line-height:1.2;
  }

  /* =========================
     CABECERA GENERAL
  ========================= */

  .year-title{
    font-family:"Aptos Narrow", Arial, sans-serif;
    text-align:center;
    font-size:10px;
    font-weight:bold;
    margin-bottom:12px;
  }

  .header-table{
    width:100%;
    border-collapse:collapse;
    table-layout:fixed;
  }

  .header-table td{
    border:1px solid #999;
    vertical-align:middle;
    padding:5px 8px;
  }

  .header-left{
    width:70%;
    text-align:center;
    font-family:"Aptos Narrow", Arial, sans-serif;
  }

  .header-right{
    width:30%;
    text-align:center;
    font-family:"Aptos Narrow", Arial, sans-serif;
  }

  /* =========================
     LADO IZQUIERDO
  ========================= */

  .semester{
    font-family:"Aptos Narrow", Arial, sans-serif;
    font-size:12px;
    font-weight:bold;
    margin-bottom:10px;
    text-transform:uppercase;
  }

  .indicator{
    font-family:"Aptos Narrow", Arial, sans-serif;
    font-size:11px;
    font-weight:bold;
    margin-bottom:10px;
    text-transform:uppercase;
  }

  .course{
    font-family:"Aptos Narrow", Arial, sans-serif;
    font-size:12px;
    font-weight:bold;
    text-transform:uppercase;
  }

  /* =========================
     LADO DERECHO
  ========================= */

  .type-line{
    display:flex;
    justify-content:center;
    align-items:center;
    gap:6px;

    margin-bottom:10px;
    font-weight:bold;
  }

  .type-label{
    font-family:"Aptos Narrow", Arial, sans-serif;
    font-size:11px;
  }

  .type-value{
    font-family:"Aptos Narrow", Arial, sans-serif;
    font-size:26px;
    font-weight:bold;
    line-height:1;
  }

  .date{
    font-family:"Aptos Narrow", Arial, sans-serif;
    font-size:11px;
    font-weight:bold;
    text-transform:uppercase;
  }

  /* =========================
     INSTRUCCIONES
  ========================= */


.instructions-box{
  width:100%;
  border:1px solid #999;
  border-collapse:collapse;

}

  .instructions-title{
    font-family: Arial, sans-serif;
    text-align:center;
    font-size:9px;
    font-weight:bold;
    margin-bottom:4px;
    letter-spacing:.5px;
  }

  .instructions-text{
    font-family: Arial, sans-serif;
    text-align:center;
    font-style:italic;
    font-size:10px;
    line-height:1.35;
    margin-bottom:0;
  }

  /* =========================
     DATOS ALUMNO
  ========================= */

  .student-data{
    font-family:"Aptos Narrow", Arial, sans-serif;
    margin-bottom:16px;
    font-size:10px;
  }

  .student-line{
    margin-bottom:4px;
  }

  /* =========================
     TITULO PREGUNTAS
  ========================= */

  .questions-title{
    font-family:"Aptos Narrow", Arial, sans-serif;
    font-weight:bold;
    margin-bottom:14px;
    font-size:10px;
    text-transform:uppercase;
  }

  /* =========================
     CONTENEDOR 2 COLUMNAS
  ========================= */

  .questions-grid{
    column-count:2;
    column-gap:34px;
  }

  /* =========================
     PREGUNTA
  ========================= */

  .question{
    break-inside:avoid;
    margin-bottom:14px;
  }

  .statement{
    font-family:"Aptos Narrow", Arial, sans-serif;
    font-weight:bold;
    margin-bottom:6px;
    text-align:justify;
    font-size:10px;
    line-height:1.3;
  }

  .question-number{
    font-weight:bold;
    margin-right:4px;
  }

  /* =========================
     OPCIONES
  ========================= */

  .options{
    margin-top:4px;
  }

  .option{
    font-family:"Aptos Narrow", Arial, sans-serif;
    margin-bottom:2px;
    font-size:10px;
    line-height:1.2;
  }

  .option-letter{
    font-weight:bold;
    display:inline-block;
    width:16px;
  }

</style>

  </head>

  <body>

    <div class="year-title">
      "Año de la Esperanza y el Fortalecimiento de la Democracia"
    </div>

    <table class="header-table">

      <tr>

        <td class="header-left">

          <div class="semester">
            SEMESTRE ACADÉMICO 2026-I
          </div>

          <div class="indicator">
            ${indicator}
          </div>

          <div class="course">
            ${course}
          </div>

        </td>

        <td class="header-right">

          <div class="type-line">

            <span class="type-label">
              TIPO:
            </span>

            <span class="type-value">
              ${examLetter}
            </span>

          </div>

          <div class="date">
            ${date}
          </div>

        </td>

      </tr>

    </table>

    <table style="width:100%;">
  <tr><td style="height:2px;"></td></tr>
</table>

   <table class="instructions-box">
  <tr>
    <td>
      <div class="instructions-title">
        INSTRUCCIONES
      </div>

      <div class="instructions-text">

        Estimados estudiantes: La evaluación consta de preguntas con alternativas.
        Lea atentamente cada enunciado y seleccione la respuesta correcta.

       </td>
  </tr>
</table>

<table style="width:100%;">
  <tr><td style="height:12px;"></td></tr>
</table>

    <div class="student-data">

      <div class="student-line">

        <strong>
          NOMBRE Y APELLIDOS:
        </strong>

        _______________________________________________

      </div>

      <div class="student-line">

        <strong>
          CÓDIGO SAP:
        </strong>

        ______________________

      </div>

    </div>

    <div class="questions-title">
      RESPONDER LAS SIGUIENTES PREGUNTAS:
    </div>

    <div class="questions-grid">
  `;

  questions.forEach((q, index) => {

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
    `;
  });

  html += `
      </div>

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

  const course =
  (state.courseName || "CURSO")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\w\-]/g, "");

let formattedDate =
  "000000";

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

const zipName =
  `${course}_${formattedDate}_VIRTUAL.zip`;

a.download =
  zipName;

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

/* =========================
   UNA SOLA VERSION
========================= */

if (totalVersions === 1) {

  // 🔥 chocolatear preguntas
  const shuffledQuestions =
    shuffleArray([
      ...questions,
    ]);

  const html =
    generatePresentialHTML(
      shuffledQuestions,
      "A",
    );

  const fileName =
    formatFileName(
      "A"
    );

  downloadDoc(
    `${fileName}.doc`,
    html,
  );

  return;
}

/* =========================
   DOS O MAS VERSIONES
   → ZIP
========================= */

const zip =
  new JSZip();

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

  // 🔥 agregar DOC al ZIP
  zip.file(
    `${fileName}.doc`,
    html,
  );
}

/* =========================
   NOMBRE ZIP
========================= */

const course =
  (state.courseName || "CURSO")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\w\-]/g, "");

let formattedDate =
  "000000";

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

const zipName =
  `${course}_${formattedDate}_PRESENCIAL.zip`;

/* =========================
   DESCARGAR ZIP
========================= */

const content =
  await zip.generateAsync({
    type: "blob",
  });

const url =
  URL.createObjectURL(content);

const a =
  document.createElement("a");

a.href = url;

a.download =
  zipName;

a.click();

URL.revokeObjectURL(url);
}

export {
  exportExam,
};