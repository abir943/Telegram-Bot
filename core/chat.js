// core/chat.js
module.exports = {
  getMention(user) {
    return user.username ? `@${user.username}` : `${user.first_name || 'User'}`;
  },

  escapeMarkdown(text) {
    return text.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
  },

  reply(bot, msg, text) {
    return bot.sendMessage(msg.chat.id, text, { reply_to_message_id: msg.message_id });
  }
};
