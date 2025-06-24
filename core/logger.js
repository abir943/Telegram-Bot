// core/logger.js
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const logPath = path.join(__dirname, '..', 'logs', 'bot.log');

function logToFile(message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
}

function log(message, type = 'info') {
  const formatted = {
    info: chalk.blue('ℹ️ ') + message,
    success: chalk.green('✔️ ') + message,
    warn: chalk.yellow('⚠️ ') + message,
    error: chalk.red('❌ ') + message
  };

  console.log(formatted[type] || message);
  logToFile(`${type.toUpperCase()}: ${message}`);
}

module.exports = { log };
