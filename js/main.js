import { Calculator } from "./calculator.js";

const themeSelector = document.getElementById('theme-selector');

themeSelector.addEventListener('change', (e) => {
  if (e.target.value === 'dark') {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
});

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