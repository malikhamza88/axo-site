"use strict";
// Demo state is in memory only. No analytics, cookies, localStorage, or network calls.
const lighting = document.querySelector("#lighting-toggle");
if (lighting) {
  const background = document.querySelector("#habitat-background");
  let night = false;
  const dayIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/></svg>';
  const nightIcon = lighting.querySelector("svg").outerHTML;
  const nightArt = new Image();
  nightArt.src = "assets/habitat-night.webp";
  lighting.addEventListener("click", () => {
    night = !night;
    background.src = night ? "assets/habitat-night.webp" : "assets/habitat-day.webp";
    lighting.setAttribute("aria-pressed", String(night));
    lighting.setAttribute("aria-label", night ? "Switch preview to daylight" : "Switch preview to moonlight");
    lighting.innerHTML = (night ? dayIcon : nightIcon) + "<span>" + (night ? "Daylight" : "Moonlight") + "</span>";
  });
}
const hello = document.querySelector("#say-hi");
if (hello) {
  const messages = ["Hi, I'm Axo.\nWe'll take this one step at a time.", "Two minutes is a beginning.\nYou get to choose your pace.", "A pause isn't a failure.\nI'll be here when you're ready.", "You don't have to do it all.\nLet's just begin."];
  let greeting = 0;
  hello.addEventListener("click", () => {
    document.querySelector("#axo-speech").textContent = messages[greeting++ % messages.length];
    hello.classList.remove("responding");
    requestAnimationFrame(() => requestAnimationFrame(() => hello.classList.add("responding")));
  });
}
document.querySelectorAll("[data-demo]").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-demo]").forEach(choice => choice.setAttribute("aria-pressed", String(choice === button)));
    document.querySelectorAll("[data-panel]").forEach(panel => panel.hidden = panel.dataset.panel !== button.dataset.demo);
  });
});
document.querySelectorAll("[data-demo-check]").forEach(input => {
  input.addEventListener("change", () => {
    const completed = document.querySelectorAll("[data-demo-check]:checked").length;
    document.querySelector("#demo-feedback").textContent = completed === 3 ? "Three little actions. Look at you getting started." : completed ? completed + " small " + (completed === 1 ? "action" : "actions") + " done. That counts." : "One small action is a real beginning.";
  });
});
document.querySelectorAll("[data-minutes]").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-minutes]").forEach(choice => choice.setAttribute("aria-pressed", String(choice === button)));
    document.querySelector("#demo-time").textContent = button.dataset.minutes.padStart(2, "0") + ":00";
  });
});
document.querySelectorAll("[data-print]").forEach(button => {
  button.hidden = false;
  button.addEventListener("click", () => window.print());
});
