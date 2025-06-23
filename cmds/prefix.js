const fs = require("fs");
const path = require("path");

module.exports = {
  name: "prefix",
  aliases: [],
  description: "View or update the bot's command prefix",
  author: "Aminul Sardar",
  version: "1.1.0",

  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    const userId = String(msg.from.id);
    const configPath = path.join(__dirname, "..", "config.json");

    let config;
    try {
      config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    } catch (err) {
      console.error("Config read error:", err.message);
      return bot.sendMessage(chatId, "❌ Failed to read config file.");
    }

    // If no args, just show the info panel
    if (!args.length) {
      const botLink = `https://t.me/${bot.username}`;
      const info = `🤖 𝐀𝐌𝐈𝐍𝐔𝐋-𝐁𝐎𝐓 Information Panel
━━━━━━━━━━━━━━━━━━━━━━
📍 Current Prefix: \`${config.botPrefix || "/"}\`
🧠 Bot Name: ${config.botName || "TelegramBot"}
🆔 Bot ID: ${bot.id}
🔗 Bot Link: [Click Here](${botLink})
👤 Owner ID: \`${config.ownerID}\`
━━━━━━━━━━━━━━━━━━━━━━
✨ Powered by: Aminul Sardar`;

      return bot.sendMessage(chatId, info, { parse_mode: "Markdown", disable_web_page_preview: true });
    }

    // Update prefix (admin only)
    const newPrefix = args[0];
    if (!global.isAdmin(userId)) {
      return bot.sendMessage(chatId, "🚫 You don’t have permission to change the prefix.");
    }

    config.botPrefix = newPrefix;
    try {
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      bot.sendMessage(chatId, `✅ Prefix updated to: \`${newPrefix}\``, { parse_mode: "Markdown" });
    } catch (err) {
      console.error("Prefix update error:", err.message);
      bot.sendMessage(chatId, "❌ Failed to update prefix.");
    }
  }
};
