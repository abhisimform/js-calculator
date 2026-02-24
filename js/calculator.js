import { safeEval } from "./utils.js";

export class Calculator {
  display;
  hasError;
  operators = ["+", "-", "*", "/"];

  constructor(displayElement) {
    this.display = displayElement;
    this.hasError = false;
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
      if (!expression) return;

      if (this.operators.includes(expression.slice(-1))) {
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

      this.display.value = result;
    } catch (err) {
      this.hasError = true;
      this.display.value = "Error";
      console.error(err.message);
    }
  }
}