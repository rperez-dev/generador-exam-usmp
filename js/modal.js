const overlay =
  document.getElementById(
    "modalOverlay",
  );

const modalTitle =
  document.getElementById(
    "modalTitle",
  );

const modalMessage =
  document.getElementById(
    "modalMessage",
  );

const modalConfirm =
  document.getElementById(
    "modalConfirm",
  );

const modalCancel =
  document.getElementById(
    "modalCancel",
  );

/* =========================
   INIT
========================= */

function initModalState() {
  overlay.classList.add("hidden");

  modalCancel.classList.add(
    "hidden",
  );
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
  q = null,
) {
  modalTitle.textContent = title;

  // =========================
  // ALERTA SIMPLE
  // =========================

  if (
    !q ||
    typeof q !== "object"
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

  // =========================
  // MENSAJE SIMPLE CUSTOM
  // =========================

  if (
    q.statement &&
    (!q.options ||
      !q.options.length)
  ) {
    modalMessage.innerHTML = `
      <div class="modal-simple-message">
        ${q.statement}
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

  // =========================
  // VALIDACIÓN COMPLETA
  // =========================

  const hasStatement =
    q.statement?.trim?.()
      .length > 0;

  const visibleOptions =
  q.options.slice(
    0,
    q.optionCount
  );

const hasOptions =
  visibleOptions.every(
    (o) =>
      o &&
      o.trim().length > 0
  );

  const hasAnswer =
    q.correctAnswer !== null;

  modalMessage.innerHTML = `
  
    <div class="modal-checklist">

      <div class="check-item ${
        hasStatement
          ? "ok"
          : "bad"
      }">
        ${
          hasStatement
            ? "✔"
            : "✖"
        }
        Enunciado
      </div>

      <div class="check-item ${
        hasOptions
          ? "ok"
          : "bad"
      }">
        ${
          hasOptions
            ? "✔"
            : "✖"
        }
        Alternativas
      </div>

      <div class="check-item ${
        hasAnswer
          ? "ok"
          : "bad"
      }">
        ${
          hasAnswer
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

function showConfirm(
  title,
  message,
  onOk,
) {
  modalTitle.textContent = title;

  modalMessage.innerHTML =
    message;

  modalCancel.classList.remove(
    "hidden",
  );

  overlay.classList.remove(
    "hidden",
  );

  modalConfirm.onclick = () => {
    hideModal();

    onOk();
  };

  modalCancel.onclick =
    hideModal;
}

export {
  initModalState,
  showAlert,
  showConfirm,
};