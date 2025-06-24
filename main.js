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
  // Stylish ASCII Banner
  console.log(
    gradient.rainbow(
      figlet.textSync("XYZ BOT", {
        horizontalLayout: "fitted",
      })
    )
  );

  // Basic Info Output
  console.log(chalk.cyan(`🤖 Username: @${config.username}`));
  console.log(chalk.magenta(`👑 Owner: ${config.owner}`));
  console.log(chalk.yellow(`🔧 Prefix: "${config.prefix}" | Symbol: ${config.symbols || '•'}\n`));

  try {
    // Load Commands and Events
    loadCommands('./script/commands');
    loadEvents('./script/events', bot);

    // Log Status
    logger.log(`✅ XYZ BOT started successfully.`, 'info');

    // Register Message Listener
    registerListeners(bot, {
      onMessage: (msg) => handleMessage(bot, msg, config)
    });

    // Final Log
    logger.log(`📦 ${global.commands.size} command(s) loaded.`, 'success');

  } catch (err) {
    logger.log(`❌ Startup error: ${err.message}`, 'error');
  }
};
