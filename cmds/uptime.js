const os = require("os");
const ms = require("pretty-ms");

module.exports = {
  name: "uptime",
  aliases: ["up", "botup"],
  description: "Displays bot and server uptime",
  adminOnly: false,

  execute: async (bot, msg) => {
    const chatId = msg.chat.id;

    const botUptime = process.uptime() * 1000;
    const serverUptime = os.uptime() * 1000;

    const format = (duration) => ms(duration, { verbose: true });

    const response = `
╭───────[🤖 𝐀𝐌𝐈𝐍𝐔𝐋-𝐁𝐎𝐓]───────╮
│
│ ⏱️ 𝗕𝗼𝘁 𝗨𝗽𝘁𝗶𝗺𝗲: ${format(botUptime)}
│ 🖥️ 𝗦𝗲𝗿𝘃𝗲𝗿 𝗨𝗽𝘁𝗶𝗺𝗲: ${format(serverUptime)}
│ 📡 𝗖𝗣𝗨: ${os.cpus()[0].model}
│ 📊 𝗠𝗲𝗺𝗼𝗿𝘆: ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB
│ 🏷️ 𝗢𝗦: ${os.platform()} | ${os.arch()}
│
╰────────────────────────╯
`;

    await bot.sendMessage(chatId, response.trim());
  }
};
