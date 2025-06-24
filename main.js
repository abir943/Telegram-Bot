const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const figlet = require('figlet');
const gradient = require('gradient-string');

global.commands = new Map();

module.exports = function startBot(bot, config) {
  const prefix = config.prefix || '/';
  const ADMINS = config.admins || [];
  const VIPS = config.vips || [];
  const SYMBOL = config.symbols || '•';

  console.log(gradient.rainbow(figlet.textSync("XYZ BOT", { horizontalLayout: "fitted" })));
  console.log(chalk.cyan(`🤖 Username: @${config.username} | 👑 Owner: ${config.owner}`));
  console.log(chalk.yellow(`🔧 Prefix: "${prefix}" | Symbol: ${SYMBOL}\n`));

  // Load commands
  const commandPath = path.join(__dirname, 'script', 'commands');
  fs.readdirSync(commandPath).forEach(file => {
    if (file.endsWith('.js')) {
      const command = require(path.join(commandPath, file));
      if (command.name && typeof command.execute === 'function') {
        global.commands.set(command.name, command);
        console.log(chalk.green(`✔ Command: ${command.name}`));
      } else {
        console.log(chalk.red(`✖ Invalid command: ${file}`));
      }
    }
  });

  // Load events
  const eventsPath = path.join(__dirname, 'script', 'events');
  fs.readdirSync(eventsPath).forEach(file => {
    if (file.endsWith('.js')) {
      const eventModule = require(path.join(eventsPath, file));
      if (typeof eventModule.handleEvent === 'function') {
        bot.on('message', (msg) => eventModule.handleEvent({ msg }));
        console.log(chalk.green(`✔ Event: ${eventModule.name || file}`));
      }
    }
  });

  console.log(chalk.magenta(`✅ ${global.commands.size} command(s) loaded.\n`));

  bot.on('message', async (msg) => {
    if (!msg.text || !msg.text.startsWith(prefix)) return;

    const args = msg.text.slice(prefix.length).trim().split(/\s+/);
    const cmdName = args.shift().toLowerCase();

    const command = [...global.commands.values()].find(cmd =>
      cmd.name === cmdName || (cmd.aliases || []).includes(cmdName)
    );

    if (!command) return bot.sendMessage(msg.chat.id, `❌ Unknown command: ${cmdName}`);

    const userId = msg.from.id.toString();
    const isAdmin = ADMINS.includes(userId);
    const isVIP = VIPS.includes(userId);

    if (command.admin && !isAdmin)
      return bot.sendMessage(msg.chat.id, `⛔ Admin-only command.`);
    if (command.vip && !(isAdmin || isVIP))
      return bot.sendMessage(msg.chat.id, `⚠️ VIP-only command.`);

    try {
      await command.execute({ bot, msg, args });
      console.log(chalk.gray(`${SYMBOL} ${cmdName} by ${msg.from.username || userId}`));
    } catch (e) {
      console.error(chalk.red(`💥 Error in ${cmdName}: ${e.message}`));
      bot.sendMessage(msg.chat.id, '⚠️ An error occurred.');
    }
  });
};
