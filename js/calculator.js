import { safeEval } from "./utils.js";
import historyClosure from "./historyClosure.js";

export class Calculator {
  display;
  hasError;
  memory;
  historyC;
  historyList;

  OPERATORS = new Set(["+", "-", "*", "/", "(", ")", "."]);

  constructor(displayElement) {
    this.display = displayElement;
    this.hasError = false;
    this.memory = 0;

    this.historyC = historyClosure();
    this.historyList = document.getElementById("history-list");

    this.renderHistory();
  }

  addToHistory(entry) {
    this.historyC.add(entry);
    this.renderHistory();
  }

  renderHistory() {
    const history = this.historyC.getAllHistory();
    this.historyList.innerHTML = "";

    history.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;

      li.style.cursor = "pointer";

      li.addEventListener("click", () => {
        const result = item.split("=").pop().trim();
        this.display.value = result;
        document.getElementById('history-panel').classList.toggle("show");
      });

      this.historyList.appendChild(li);
    });
  }

  calculate() {
    try {
      if (this.hasError) return;

      let expression = this.display.value;
      if (!expression) return;

      if (this.OPERATORS.has(expression.slice(-1))) {
        expression = expression.slice(0, -1);
      }

      const open = (expression.match(/\(/g) || []).length;
      const close = (expression.match(/\)/g) || []).length;

      if (open > close) {
        expression += ")".repeat(open - close);
      }

      const result = safeEval(expression);

      if (Number.isNaN(result)) {
        this.hasError = true;
        this.display.value = "Error";
        return;
      }

      const lastHistory = this.historyC.getAllHistory()[0] || "";
      const lastResult = lastHistory.includes("=") ? lastHistory.split("=")[1].trim() : null;

      if (lastResult === null || lastResult !== result.toString()) {
        this.addToHistory(`${expression} = ${result}`);
      }

      // Update display
      this.display.value = result;
    } catch (err) {
      this.hasError = true;
      this.display.value = "Error";
      console.error(err.message);
    }
  }

  memory(action) {
    if (this.hasError) return;

    const currentValue = parseFloat(this.display.value) || 0;

    switch (action) {
      case "MC":
        this.memory = 0;
        break;
      case "MR":
        this.display.value = this.memory;
        break;
      case "MS":
        this.memory = currentValue;
        break;
      case "M+":
        this.memory += currentValue;
        break;
      case "M-":
        this.memory -= currentValue;
        break;
    }
  }
}

Calculator.prototype.add = function (value) {
  const current = this.display.value;
  const lastChar = current.slice(-1);

  if (this.hasError) {
    this.display.value = value;
    this.hasError = false;
    return;
  }

  // stop start with invalid operators
  if (current === "" && this.OPERATORS.has(value)) {
    if (value !== "-") return;
  }

  // if last input char is operator then replace it
  if (this.OPERATORS.has(lastChar) && this.OPERATORS.has(value)) {
    this.display.value = current.slice(0, -1) + value;
    return;
  }

  // stop multiple "."
  if (value === ".") {
    const parts = current.split(/[\+\-\*\/]/);
    const lastNumber = parts[parts.length - 1];
    if (lastNumber.includes(".")) return;
  }

  this.display.value += value;

  this.display.scrollLeft = this.display.scrollWidth;
}

Calculator.prototype.clear = function () {
  this.display.value = "";
  this.hasError = false;
}

Calculator.prototype.backspace = function () {
  if (this.hasError) {
    this.display.value = "";
    this.hasError = false;
    return;
  }
  this.display.value = this.display.value.slice(0, -1);
}
