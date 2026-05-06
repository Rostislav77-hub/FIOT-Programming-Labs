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