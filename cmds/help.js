module.exports = {
  name: "help",
  aliases: ["commands", "h"],
  description: "List all commands or get info about a specific command.",
  adminOnly: false,
  execute: async (bot, msg, args) => {
    const chatId = msg.chat.id;

    if (args.length === 0) {
      // List all commands
      const commandList = [...global.commands.keys()]
        .map(cmd => `- ${cmd}`)
        .join("\n");
      await bot.sendMessage(chatId, `📜 Available commands:\n${commandList}`);
    } else {
      // Detailed info about a specific command
      const cmdName = args[0].toLowerCase();
      const cmd = global.commands.get(cmdName);
      if (!cmd) return bot.sendMessage(chatId, `❌ Command '${cmdName}' not found.`);
      let text = `📄 Command: ${cmd.name}\n`;
      if (cmd.description) text += `Description: ${cmd.description}\n`;
      if (cmd.aliases && cmd.aliases.length) text += `Aliases: ${cmd.aliases.join(", ")}\n`;
      await bot.sendMessage(chatId, text);
    }
  }
};
