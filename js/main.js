import { Calculator } from "./calculator.js";

const input = document.getElementById("calc-input");
const calculator = new Calculator(input);

// if use array then include take O(n) time to check
const MEMORY_KEYS = new Set(["MC", "MR", "MS", "M+", "M-"]);
const OPERATORS = new Set(["+", "-", "*", "/", "(", ")", "."]);

const themeBtn = document.getElementById("theme-button");
const icon = themeBtn.querySelector("i");

themeBtn.addEventListener("click", function () {
  document.body.classList.toggle('dark');
  icon.classList.toggle("fa-moon-o");
  icon.classList.toggle("fa-sun-o");
});

const historyBtn = document.getElementById("history-button");
const historyPanel = document.getElementById("history-panel");
const closeHistory = document.getElementById("close-history");
const clearHistory = document.getElementById("clear-history");

// toggle buttons
historyBtn.addEventListener("click", () => {
  historyPanel.classList.toggle("show");
});

closeHistory.addEventListener("click", () => {
  historyPanel.classList.toggle("show");
});

clearHistory.addEventListener("click", () => {
  localStorage.removeItem("calcHistory");
  calculator.renderHistory();
});

const advancedSection = document.querySelector(".advanced");

document.querySelector('select[name="calc-mode"]')
  ?.addEventListener("change", function () {
    advancedSection?.classList.toggle(
      "d-none",
      this.value !== "trigonometry"
    );
  });

document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", function () {
    const value = this.dataset.value;

    if (MEMORY_KEYS.has(value)) {
      calculator.memory(value);
      return;
    }

    switch (value) {
      case "clear":
        calculator.clear();
        break;
      case "backspace":
        calculator.backspace();
        break;
      case "equals":
        calculator.calculate();
        break;
      default:
        calculator.add(value);
        break;
    }
  });
});

document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (/^\d$/.test(key))
    return calculator.add(key);

  if (OPERATORS.has(key))
    return calculator.add(key);

  if (key === "^")
    return calculator.add("**");

  if (key === "Enter") {
    e.preventDefault();
    return calculator.calculate();
  }

  if (key === "Backspace")
    return calculator.backspace();

  if (key === "Escape" || key === "Delete")
    return calculator.clear();
});