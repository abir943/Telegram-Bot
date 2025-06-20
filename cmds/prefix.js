module.exports = {
  name: "prefix",
  aliases: ["botinfo", "about"],
  adminOnly: false,
  description: "Displays bot information panel",
  async execute(bot, msg) {
    const config = require("../config.json");

    const botName = config.botName || "AminulBot";
    const botPrefix = config.botPrefix || "/";
    const ownerID = config.ownerID || "Unknown";
    const botUsername = (await bot.getMe()).username;
    const botID = (await bot.getMe()).id;
    const botLink = `https://t.me/${botUsername}`;

    const panel = `*🤖 ${botName} Information Panel*
━━━━━━━━━━━━━━━━━━━━━━
*📍 Current Prefix:* \`${botPrefix}\`
*🧠 Bot Name:* ${botName}
*🆔 Bot ID:* \`${botID}\`
*🔗 Bot Link:* [Click here](${botLink})
*👤 Owner ID:* \`${ownerID}\`
━━━━━━━━━━━━━━━━━━━━━━
*✨ Powered by:* Aminul Sardar`;

    return bot.sendMessage(msg.chat.id, panel, { parse_mode: "Markdown" });
  }
};
