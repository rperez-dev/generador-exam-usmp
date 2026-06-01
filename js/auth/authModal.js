const loginOverlay =
  document.getElementById(
    "loginOverlay"
  );

const loginEmail =
  document.getElementById(
    "loginEmail"
  );

const loginPassword =
  document.getElementById(
    "loginPassword"
  );

const loginBtn =
  document.getElementById(
    "loginBtn"
  );

const loginError =
  document.getElementById(
    "loginError"
  );

/* =========================
   CLEAR
========================= */

function clearLoginForm() {

  loginEmail.value = "";

  loginPassword.value =
    "";

  loginError.textContent =
    "";
}

/* =========================
   OPEN
========================= */

function openLogin() {

  clearLoginForm();

  loginOverlay.classList.remove(
    "hidden"
  );

  // doble limpieza contra cache browser
  setTimeout(() => {

    loginEmail.value = "";

    loginPassword.value =
      "";

    loginEmail.focus();

  }, 0);
}

/* =========================
   CLOSE
========================= */

function closeLogin() {

  clearLoginForm();

  loginOverlay.classList.add(
    "hidden"
  );
}

/* =========================
   ERROR
========================= */

function setLoginError(
  message
) {

  loginError.textContent =
    message;
}

export {
  openLogin,
  closeLogin,
  setLoginError,
  loginBtn,
  loginEmail,
  loginPassword,
};