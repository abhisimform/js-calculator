import { Calculator } from "./calculator.js";

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
const historyList = document.getElementById("history-list");
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
  calculator.history = [];
  calculator.renderHistory();
});

// function loadHistory() {
//   historyList.innerHTML = "";
//   const history = JSON.parse(localStorage.getItem("calcHistory")) || [];

//   history.forEach(item => {
//     const li = document.createElement("li");
//     li.textContent = item;

//     li.style.cursor = "pointer";

//     li.addEventListener("click", () => {
//       const result = item.split("=").pop().trim();
//       document.querySelector(".display-input").value = result;
//       historyPanel.classList.toggle("show");
//     });

//     historyList.appendChild(li);
//   });
// }

document
  .querySelector('select[name="calc-mode"]')
  .addEventListener("change", function () {
    const advanced = document.querySelector(".advanced");

    if (this.value === "trigonometry") {
      advanced.classList.remove("d-none");
    } else {
      advanced.classList.add("d-none");
    }
  });

const input = document.getElementById("calc-input");
const calculator = new Calculator(input);

document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", function () {
    const value = this.dataset.value;

    if (["MC", "MR", "MS", "M+", "M-"].includes(value)) {
      calculator.memory(value);
    } else {
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
    }
  });
});

document.addEventListener("keydown", handleKeyboard);

function handleKeyboard(e) {
  const key = e.key;

  if (!isNaN(key)) {
    calculator.add(key);
    return;
  }

  const operators = ["+", "-", "*", "/", "(", ")", "."];
  if (operators.includes(key)) {
    calculator.add(key);
    return;
  }

  if (key === "^") {
    calculator.add("**");
    return;
  }

  if (key === "Enter") {
    e.preventDefault();
    calculator.calculate();
    return;
  }

  if (key === "Backspace") {
    calculator.backspace();
    return;
  }

  if (key === "Escape" || key === "Delete") {
    calculator.clear();
    return;
  }
}