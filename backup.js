export function safeEval(expression) {
  try {
    if (expression.includes("/0")) {
      throw new Error("division by zero");
    }

    return eval(expression);

  } catch (err) {
    throw new Error("expression invalid ");
  }
}

export function factorial(n) {
  if (n < 0) throw new Error("negative factorial not allowed");
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}

import { safeEval } from "./utils.js";

export class Calculator {
  constructor(displayElement) {
    this.display = displayElement;
  }

  add(value) {
    const current = this.display.value;
    const lastChar = current.slice(-1);
    const operators = ["+", "-", "*", "/"];

    if (current === "Error") {
      this.display.value = value;
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

    // stop multiple . 
    if (value === ".") {
      const parts = current.split(/[\+\-\*\/]/);
      const lastNumber = parts[parts.length - 1];
      if (lastNumber.includes(".")) return;
    }

    this.display.value += value;
  }

  clear() {
    this.display.value = "";
  }

  backspace() {
    if (this.display.value === "Error") {
      this.display.value = "";
      return;
    }

    this.display.value = this.display.value.slice(0, -1);
  }

  calculate() {
    try {
      let expression = this.display.value;

      console.log(expression)
      if (!expression || expression === "Error") return;


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
        this.display.value = "Error";
      } else {
        this.display.value = result;
      }

      this.display.value = result;
    } catch (err) {
      this.display.value = "Error";
      console.error(err.message);
    }
  }
}