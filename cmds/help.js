const PAGE_SIZE = 10;

async function sendHelpPage(bot, chatId, page) {
  const allCommands = [...global.commands.keys()];
  const totalPages = Math.ceil(allCommands.length / PAGE_SIZE);

  if (page < 1 || page > totalPages) {
    return bot.sendMessage(chatId, `❌ Invalid page. Please choose 1 - ${totalPages}`);
  }

  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const commandsPage = allCommands.slice(start, end);
  const message = `📖 Help Menu (Page ${page}/${totalPages}):\n\n` +
    commandsPage.map(cmd => `- ${cmd}`).join("\n");

  const keyboard = {
    inline_keyboard: [[
      ...(page > 1 ? [{ text: "⏮️ Previous", callback_data: `help_page_${page - 1}` }] : []),
      ...(page < totalPages ? [{ text: "Next ⏭️", callback_data: `help_page_${page + 1}` }] : [])
    ]]
  };

  return bot.sendMessage(chatId, message, { reply_markup: keyboard });
}

module.exports = {
  name: "help",
  aliases: ["commands", "h"],
  description: "List all commands or get info about a specific command.",
  adminOnly: false,

  execute: async (bot, msg, args) => {
    const chatId = msg.chat.id;
    const allCommands = [...global.commands.keys()];

    if (args[0]?.toLowerCase() === "all") {
      const commandList = allCommands.map(cmd => `- ${cmd}`).join("\n");
      return bot.sendMessage(chatId, `📜 All Commands:\n\n${commandList}`);
    }

    if (args.length === 1 && isNaN(args[0])) {
      const cmdName = args[0].toLowerCase();
      const cmd = global.commands.get(cmdName);
      if (!cmd) return bot.sendMessage(chatId, `❌ Command '${cmdName}' not found.`);
      let text = `📄 Command: ${cmd.name}\n`;
      if (cmd.description) text += `📝 Description: ${cmd.description}\n`;
      if (cmd.aliases?.length) text += `🔁 Aliases: ${cmd.aliases.join(", ")}\n`;
      return bot.sendMessage(chatId, text);
    }

    const page = parseInt(args[0]) || 1;
    return sendHelpPage(bot, chatId, page);
  },

  callback: async (bot, query) => {
    const match = query.data.match(/^help_page_(\d+)$/);
    if (!match) return;

    const page = parseInt(match[1]);
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;

    const allCommands = [...global.commands.keys()];
    const totalPages = Math.ceil(allCommands.length / PAGE_SIZE);
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const commandsPage = allCommands.slice(start, end);

    const message = `📖 Help Menu (Page ${page}/${totalPages}):\n\n` +
      commandsPage.map(cmd => `- ${cmd}`).join("\n");

    const keyboard = {
      inline_keyboard: [[
        ...(page > 1 ? [{ text: "⏮️ Previous", callback_data: `help_page_${page - 1}` }] : []),
        ... ? [{ text: "Next ⏭️", callback_data: `help_page_${page + 1}` }] : [])
      ]]
    };

    await bot.editMessageText(message, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: keyboard
    });

    await bot.answerCallbackQuery(query.id);
  }
};
