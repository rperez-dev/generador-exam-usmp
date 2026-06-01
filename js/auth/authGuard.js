import {
  authState,
} from "./authState.js";

import {
  validateLogin,
} from "./authService.js";

import {
  openLogin,
  closeLogin,
  setLoginError,
  loginBtn,
  loginEmail,
  loginPassword,
} from "./authModal.js";

import {
  applyPermissions,
} from "../permissions/permissions.js";

/* =========================
   LOGOUT
========================= */

function logout() {

  authState.user = null;

  sessionStorage.clear();

  localStorage.removeItem(
    "examUser"
  );

  location.reload();
}

/* =========================
   START AUTH
========================= */

function startAuth(
  onSuccess,
) {

  // siempre pedir login
  openLogin();

  loginBtn.onclick =
    () => {

      const correo =
        loginEmail.value
          .trim();

      const clave =
        loginPassword.value
          .trim();

      const result =
        validateLogin(
          correo,
          clave,
        );

      if (
        !result.ok
      ) {

        setLoginError(
          result.message,
        );

        return;
      }

      authState.user =
        result.user;

      closeLogin();

      // iniciar app
      onSuccess();

      // aplicar permisos
      applyPermissions();
    };
}

export {
  startAuth,
  logout,
};