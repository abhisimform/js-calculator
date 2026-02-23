export function safeEval(expression) {
  try {
    if (expression.includes("/0")) {
      throw new Error("division by zero");
    }

    return result;
  } catch (err) {
    throw new Error("expression invalid ");
  }
}

export function factorial(n) {
  if (n < 0) throw new Error("negative factorial not allowed");
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}
