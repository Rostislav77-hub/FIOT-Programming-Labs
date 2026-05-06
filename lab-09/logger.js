'use strict';

const LOG_LEVELS = Object.freeze({
  DEBUG : 0,
  INFO  : 1,
  ERROR : 2,
});

class SimpleFormatter {
  format(entry) {
    const base = `[${entry.timestamp}] ${entry.level} ${entry.fnName}:${entry.event}`;
    if (entry.event === 'CALL') return `${base} args=${JSON.stringify(entry.args)}`;
    if (entry.event === 'RETURN') return `${base} result=${JSON.stringify(entry.result)} duration=${entry.duration}ms`;
    if (entry.event === 'ERROR') return `${base} error="${entry.error}" duration=${entry.duration}ms`;
    return base;
  }
}

class JsonFormatter {
  format(entry) {
    return JSON.stringify(entry);
  }
}

class ConsoleTransport {
  constructor(formatter) {
    this._formatter = formatter;
  }
  log(level, entry) {
    const message = this._formatter.format(entry);
    if (level === 'ERROR') console.error(message);
    else console.log(message);
  }
}

const withLogging = ({ level, logger }) => (fn) => {
  const threshold = LOG_LEVELS[level] ?? LOG_LEVELS.INFO;
  const fnName    = fn.name || '(anonymous)';

  function emit(entryLevel, entry) {
    if (LOG_LEVELS[entryLevel] >= threshold) logger.log(entryLevel, entry);
  }

  function baseEntry(event, extra = {}) {
    return { timestamp: new Date().toISOString(), level, fnName, event, ...extra };
  }

  function decorated(...args) {
    emit('DEBUG', baseEntry('CALL', { args }));
    const start = performance.now();
    let result;

    try {
      result = fn(...args);
    } catch (err) {
      const duration = +(performance.now() - start).toFixed(3);
      logger.log('ERROR', baseEntry('ERROR', { error: err.message, stack: err.stack, duration }));
      throw err; 
    }

    if (result instanceof Promise) {
      return result.then(
        (value) => {
          const duration = +(performance.now() - start).toFixed(3);
          emit('INFO', baseEntry('RETURN', { result: value, async: true, duration }));
          return value;
        },
        (err) => {
          const duration = +(performance.now() - start).toFixed(3);
          logger.log('ERROR', baseEntry('ERROR', { error: err.message, async: true, duration }));
          return Promise.reject(err);
        }
      );
    }

    const duration = +(performance.now() - start).toFixed(3);
    emit('INFO', baseEntry('RETURN', { result, duration }));
    return result;
  }

  Object.defineProperty(decorated, 'name', { value: `logged(${fnName})` });
  return decorated;
};