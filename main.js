// main.js
const figlet = require('figlet');
const gradient = require('gradient-string');
const chalk = require('chalk');

const { loadCommands, loadEvents } = require('./core/load');
const registerListeners = require('./core/listener');
const handleMessage = require('./core/message');
const logger = require('./core/logger');

global.commands = new Map();

module.exports = function startBot(bot, config) {
  console.log(gradient.rainbow(figlet.textSync("XYZ BOT", { horizontalLayout: "fitted" })));
  console.log(chalk.cyan(`🤖 Username: @${config.username} | 👑 Owner: ${config.owner}`));
  console.log(chalk.yellow(`🔧 Prefix: "${config.prefix}" | Symbol: ${config.symbols || '•'}\n`));

  try {
    loadCommands('./script/commands');
    loadEvents('./script/events', bot);
    logger.log(`XYZ BOT started.`, 'info');

    registerListeners(bot, {
      onMessage: (msg) => handleMessage(bot, msg, config)
    });

    logger.log(`${global.commands.size} command(s) loaded.`, 'success');
  } catch (err) {
    logger.log(`Startup error: ${err.message}`, 'error');
  }
};
