import { authState } from "../auth/authState.js";

function isAdmin() {
  return (
    authState.user?.rol ===
    "ADMIN"
  );
}

function isDocente() {
  return (
    authState.user?.rol ===
    "DOCENTE"
  );
}

/* =========================
   APPLY UI PERMISSIONS
========================= */

function applyPermissions() {

  const importBtn =
    document.querySelector(
      ".import-btn"
    );

  const examType =
    document.getElementById(
      "examType"
    );

  /* =========================
     DOCENTE
  ========================= */

  if (isDocente()) {

    // ocultar importar
    if (importBtn) {
      importBtn.style.display =
        "none";
    }

    // modalidad virtual fija
    if (examType) {

      examType.value =
        "VIRTUAL";

      examType.disabled =
        true;
    }
  }

  /* =========================
     ADMIN
  ========================= */

  if (isAdmin()) {

    if (importBtn) {
      importBtn.style.display =
        "";
    }

    if (examType) {
      examType.disabled =
        false;
    }
  }
}

export {
  applyPermissions,
  isAdmin,
  isDocente,
};