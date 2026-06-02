import { users } from "./users.js";

function validateLogin(correo, clave) {
  if (!correo?.trim()) {
    return {
      ok: false,
      message: "Ingrese correo",
    };
  }

  if (!/^\d{6}$/.test(clave)) {
    return {
      ok: false,
      message: "La clave debe tener 6 dígitos",
    };
  }

  const user = users.find(
    (u) => u.correo.toLowerCase() === correo.toLowerCase() && u.clave === clave,
  );

  if (!user) {
    return {
      ok: false,
      message: "Correo o clave inválidos",
    };
  }

  return {
    ok: true,
    user,
  };
}

export { validateLogin };
