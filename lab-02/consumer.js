function consumeIterator(iterator, timeoutSeconds, processingCallback) {
  if (!iterator || typeof iterator.next !== "function")
    throw new Error("Invalid iterator.");
  if (typeof timeoutSeconds !== "number" || timeoutSeconds <= 0)
    throw new Error("Timeout must be a positive.");

  const startTime = Date.now();
  const timeoutMs = timeoutSeconds * 1000;
  let iterationCount = 0;
  const state = { total: 0 };

  while (Date.now() - startTime < timeoutMs) {
    const result = iterator.next();
    if (result.done) break;
    processingCallback(result.value, iterationCount, state);
    iterationCount++;
  }
  console.log(`\nTotal iterations: ${iterationCount}\n`);
}

module.exports = { consumeIterator };
