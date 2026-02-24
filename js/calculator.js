import { safeEval } from "./utils.js";

export class Calculator {
  constructor(displayElement) {
    this.display = displayElement;
    this.hasError = false;
    this.memory = 0;

    this.history = [];
    this.historyList = document.getElementById("history-list");

    this.loadHistory();
  }

  history(calculation) {
    let history = JSON.parse(localStorage.getItem("calcHistory")) || [];
    history.push(calculation);
    localStorage.setItem("calcHistory", JSON.stringify(history));
  }

  loadHistory() {
    const stored = localStorage.getItem("calcHistory");
    this.history = stored ? JSON.parse(stored) : [];
    this.renderHistory();
  }

  addToHistory(entry) {
    this.history.unshift(entry);

    if (this.history.length > 20) {
      this.history.pop();
    }

    this.saveHistory();
    this.renderHistory();
  }

  saveHistory() {
    localStorage.setItem("calcHistory", JSON.stringify(this.history));
  }

  renderHistory() {
    this.historyList.innerHTML = "";

    this.history.forEach(item => {
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

  add(value) {
    const current = this.display.value;
    const lastChar = current.slice(-1);
    const operators = ["+", "-", "*", "/"];

    if (this.hasError) {
      this.display.value = value;
      this.hasError = false;
      return;
    }

    // stop start with invalid operators
    if (current === "" && operators.includes(value)) {
      if (value !== "-") return;
    }

    // if last input char is operator then replace it
    if (operators.includes(lastChar) && operators.includes(value)) {
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
  }

  clear() {
    this.display.value = "";
    this.hasError = false;
  }

  backspace() {
    if (this.hasError) {
      this.display.value = "";
      this.hasError = false;
      return;
    }
    this.display.value = this.display.value.slice(0, -1);
  }

  calculate() {
    try {
      if (this.hasError) return;

      let expression = this.display.value;
      console.log(expression)
      if (!expression) return;

      if (["+", "-", "*", "/"].includes(expression.slice(-1))) {
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
      } else {
        this.display.value = result;
      }

      this.addToHistory(`${expression} = ${result}`);

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