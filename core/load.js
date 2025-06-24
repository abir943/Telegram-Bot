// core/load.js
const fs = require('fs');
const path = require('path');

function loadCommands(commandsPath) {
  global.commands.clear();
  fs.readdirSync(commandsPath).forEach(file => {
    if (file.endsWith('.js')) {
      const command = require(path.join(commandsPath, file));
      if (command.name && typeof command.execute === 'function') {
        global.commands.set(command.name, command);
      }
    }
  });
}

function loadEvents(eventsPath, bot) {
  fs.readdirSync(eventsPath).forEach(file => {
    if (file.endsWith('.js')) {
      const eventModule = require(path.join(eventsPath, file));
      if (typeof eventModule.handleEvent === 'function') {
        bot.on('message', (msg) => eventModule.handleEvent({ msg }));
      }
    }
  });
}

module.exports = {
  loadCommands,
  loadEvents
};
