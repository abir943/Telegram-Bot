// core/listener.js
module.exports = function registerListeners(bot, handlers = {}) {
  if (handlers.onMessage) {
    bot.on('message', (msg) => handlers.onMessage(msg));
  }

  if (handlers.onEditedMessage) {
    bot.on('edited_message', (msg) => handlers.onEditedMessage(msg));
  }

  if (handlers.onCallbackQuery) {
    bot.on('callback_query', (query) => handlers.onCallbackQuery(query));
  }

  // Add more listeners as needed
};
