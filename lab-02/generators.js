
function* fibonacciGenerator() {
  let current = 0;
  let next = 1;
  while (true) {
    yield current;
    const temp = current + next;
    current = next;
    next = temp;
  }
}

function* colorCycleGenerator() {
  const colors = [
    { name: "RED", code: "\x1b[31m" },
    { name: "GREEN", code: "\x1b[32m" },
    { name: "BLUE", code: "\x1b[34m" },
  ];
  let index = 0;
  while (true) {
    yield colors[index];
    index = (index + 1) % colors.length;
  }
}

module.exports = { fibonacciGenerator, colorCycleGenerator };