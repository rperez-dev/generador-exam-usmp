const overlay = document.getElementById("modalOverlay");

const modalTitle = document.getElementById("modalTitle");

const modalMessage = document.getElementById("modalMessage");

const modalConfirm = document.getElementById("modalConfirm");

const modalCancel = document.getElementById("modalCancel");

/* =========================
   INIT
========================= */

function initModalState() {
  overlay.classList.add("hidden");

  modalCancel.classList.add("hidden");
}

/* =========================
   HIDE
========================= */

function hideModal() {
  overlay.classList.add("hidden");
}

/* =========================
   ALERT
========================= */

function showAlert(
  title,
  content = null,
) {

  modalTitle.textContent =
    title;

  /* =========================
     MENSAJE HTML (VALIDATORS)
  ========================= */

  if (
    typeof content ===
    "string"
  ) {

    modalMessage.innerHTML =
      content;

    modalCancel.classList.add(
      "hidden",
    );

    overlay.classList.remove(
      "hidden",
    );

    modalConfirm.onclick =
      hideModal;

    return;
  }

  /* =========================
     ALERTA SIMPLE
  ========================= */

  if (
    !content ||
    typeof content !==
      "object"
  ) {

    modalMessage.innerHTML = `
      <div class="modal-simple-message">
        ${title}
      </div>
    `;

    modalCancel.classList.add(
      "hidden",
    );

    overlay.classList.remove(
      "hidden",
    );

    modalConfirm.onclick =
      hideModal;

    return;
  }

  /* =========================
     VALIDACIÓN CHECKLIST
  ========================= */

  const status =
    getQuestionStatus(
      content,
    );

  modalMessage.innerHTML = `
    <div class="validation-box">

      <div class="validation-title">
        Complete los siguientes
        elementos:
      </div>

      <div
        class="validation-item
        ${
          status.statement
            ? "ok"
            : "bad"
        }"
      >
        ${
          status.statement
            ? "✔"
            : "✖"
        }
        Enunciado
      </div>

      <div
        class="validation-item
        ${
          status.options
            ? "ok"
            : "bad"
        }"
      >
        ${
          status.options
            ? "✔"
            : "✖"
        }
        Alternativas
      </div>

      <div
        class="validation-item
        ${
          status.answer
            ? "ok"
            : "bad"
        }"
      >
        ${
          status.answer
            ? "✔"
            : "✖"
        }
        Respuesta correcta
      </div>

    </div>
  `;

  modalCancel.classList.add(
    "hidden",
  );

  overlay.classList.remove(
    "hidden",
  );

  modalConfirm.onclick =
    hideModal;
}

/* =========================
   CONFIRM
========================= */

function showConfirm(title, message, onOk) {
  modalTitle.textContent = title;

  modalMessage.innerHTML = message;

  modalCancel.classList.remove("hidden");

  overlay.classList.remove("hidden");

  modalConfirm.onclick = () => {
    hideModal();

    onOk();
  };

  modalCancel.onclick = hideModal;
}

export { initModalState, showAlert, showConfirm };
