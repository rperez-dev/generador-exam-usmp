import { tourSteps } from "./tourSteps.js";

let driverObj = null;

/* =========================
   START TOUR
========================= */

function startTour() {
  if (
    !window.driver ||
    !window.driver.js
  ) {
    console.error(
      "Driver.js no cargó correctamente",
    );
    return;
  }

  driverObj =
    window.driver.js.driver({
      showProgress: true,

      animate: true,

      allowClose: true,

      overlayOpacity: 0.7,

      smoothScroll: true,

      stagePadding: 8,

      stageRadius: 12,

      prevBtnText:
        "Anterior",

      nextBtnText:
        "Siguiente",

      doneBtnText:
        "Finalizar",

      steps: tourSteps,
    });

  driverObj.drive();
}

/* =========================
   BIND
========================= */

function bindTour() {
  const btn =
    document.getElementById(
      "tourBtn",
    );

  if (!btn) return;

  btn.onclick =
    startTour;
}

export {
  bindTour,
  startTour,
};