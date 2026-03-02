// Підключаємо нашу локальну бібліотеку Пункт 7
const lib = require("../index.js");

// Функції обробки (Callback)
function processNumbers(value, iteration, state) {
  state.total += value;
  const avg = iteration === 0 ? value : state.total / (iteration + 1);
  console.log(
    `[Iter: ${iteration}] Fibonacci: ${value} | Total: ${state.total} | Avg: ${avg.toFixed(2)}`,
  );
}

function processColors(colorObj, iteration) {
  const currentDate = new Date().toISOString();
  const resetCode = "\x1b[0m";
  console.log(
    `${colorObj.code}[${currentDate}] Iteration: ${iteration} — Color: ${colorObj.name}${resetCode}`,
  );
}

//  Виконання Пункт 8
try {
  console.log("=== Тестування генератора Фібоначчі ===");
  // Виклик функції з нашої бібліотеки
  const fibGen = lib.fibonacciGenerator();
  lib.consumeIterator(fibGen, 0.01, processNumbers);

  console.log("=== Тестування генератора кольорів ===");
  const colorGen = lib.colorCycleGenerator();
  lib.consumeIterator(colorGen, 0.01, processColors);
} catch (error) {
  console.error(error.message);
}
