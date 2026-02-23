import { safeEval } from "./utils.js";

export class Calculator {
  constructor(displayElement) {
    this.display = displayElement;
  }

  add(value) {
    this.display.value += value;
  }

  clear() {
    this.display.value = "";
  }

  backspace() {
    this.display.value = this.display.value.slice(0, -1);
  }

  calculate() {
    try {
      const expression = this.display.value;
      const result = safeEval(expression);

      this.display.value = result;
    } catch (err) {
      this.display.value = "Error";
      console.error(err.message);
    }
  }
}