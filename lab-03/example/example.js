const { memoize } = require("../lib/memoize");

function add(a, b) {
  return a + b;
}

const memoizedAdd = memoize(add);

console.log("=== Тестування базової мемоїзації ===");
console.log("Результат 1:", memoizedAdd(2, 3));
console.log("Результат 2:", memoizedAdd(2, 3));
console.log("Результат 3:", memoizedAdd(5, 5));
console.log("Результат 4:", memoizedAdd(5, 5));
