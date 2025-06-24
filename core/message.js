// core/message.js
module.exports = async function handleMessage(bot, msg, config) {
  const prefix = config.prefix || '/';
  const userId = msg.from.id.toString();
  const text = msg.text || '';
  if (!text.startsWith(prefix)) return;

  const args = text.slice(prefix.length).trim().split(/\s+/);
  const cmdName = args.shift().toLowerCase();

  const command = [...global.commands.values()].find(cmd =>
    cmd.name === cmdName || (cmd.aliases || []).includes(cmdName)
  );

  if (!command) return bot.sendMessage(msg.chat.id, `❌ Unknown command: ${cmdName}`);
  const isAdmin = (config.admins || []).includes(userId);
  const isVIP = (config.vips || []).includes(userId);

  if (command.admin && !isAdmin)
    return bot.sendMessage(msg.chat.id, `⛔ Admin-only command.`);
  if (command.vip && !(isAdmin || isVIP))
    return bot.sendMessage(msg.chat.id, `⚠️ VIP-only command.`);

  try {
    await command.execute({ bot, msg, args });
  } catch (err) {
    console.error(`Error in ${cmdName}:`, err);
    bot.sendMessage(msg.chat.id, `⚠️ An error occurred running that command.`);
  }
};
