const fs = require("fs");
const path = require("path");
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

// === Load Config ===
function loadConfig(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing ${filePath}!`);
    process.exit(1);
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    console.error(`❌ Error parsing ${filePath}:`, err);
    process.exit(1);
  }
}

const config = loadConfig("./config.json");
const { botPrefix = "/", botAdmins = [], ownerID, botName = "TelegramBot", token } = config;

if (!token) {
  console.error("❌ Telegram bot token missing in config.json!");
  process.exit(1);
}

// === Global Stores ===
global.commands = new Map();
global.aliases = new Map();
global.cooldowns = new Map();

// === Express Setup ===
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/status", (_, res) => {
  res.json({
    bot: botName,
    status: "🟢 Running",
    totalCommands: global.commands.size
  });
});

app.listen(PORT, () => {
  console.log(`🌐 Web server listening on port ${PORT}`);
});

// === Load Commands ===
function loadCommands() {
  const commandsPath = path.join(__dirname, "cmds");
  if (!fs.existsSync(commandsPath)) return console.warn("⚠️ 'cmds' directory not found.");

  const files = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

  for (const file of files) {
    delete require.cache[require.resolve(`./cmds/${file}`)];
    const cmd = require(`./cmds/${file}`);
    if (cmd.name && typeof cmd.execute === "function") {
      global.commands.set(cmd.name, cmd);
      (cmd.aliases || []).forEach(alias => global.aliases.set(alias, cmd.name));
      console.log(`📦 Loaded command: ${cmd.name}`);
    }
  }

  console.log(`✅ Loaded ${global.commands.size} command(s)`);
}

// === Cooldown System ===
function checkCooldown(cmd, userId) {
  const now = Date.now();
  const userCooldowns = global.cooldowns.get(userId) || {};
  const lastUsed = userCooldowns[cmd] || 0;
  const cooldown = 1000; // ms
  const remaining = cooldown - (now - lastUsed);
  return remaining > 0 ? remaining : null;
}

function setCooldown(cmd, userId) {
  if (!global.cooldowns.has(userId)) global.cooldowns.set(userId, {});
  global.cooldowns.get(userId)[cmd] = Date.now();
}

function isAdmin(userId) {
  return botAdmins.includes(String(userId)) || String(userId) === String(ownerID);
}

// === Init Telegram Bot ===
const bot = new TelegramBot(token, { polling: true });
loadCommands();

console.log(`🤖 ${botName} is online.`);
bot.sendMessage(ownerID, `🚀 *${botName} is now live!*`, {
  parse_mode: "Markdown"
});

// === Handle Incoming Messages ===
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userId = String(msg.from.id);
  const text = msg.text?.trim() || "";

  if (!text.startsWith(botPrefix)) return;

  const args = text.slice(botPrefix.length).split(/\s+/);
  let cmdName = args.shift().toLowerCase();

  if (global.aliases.has(cmdName)) {
    cmdName = global.aliases.get(cmdName);
  }

  const command = global.commands.get(cmdName);

  if (!command) {
    return bot.sendMessage(chatId, `❌ Command \`${cmdName}\` not found.\nTry \`${botPrefix}help\`.`, {
      parse_mode: "Markdown"
    });
  }

  if (command.adminOnly && !isAdmin(userId)) {
    return bot.sendMessage(chatId, "🚫 You don’t have permission to use this command.");
  }

  const remaining = checkCooldown(cmdName, userId);
  if (remaining) {
    return bot.sendMessage(chatId, `⏳ Please wait ${Math.ceil(remaining / 1000)}s before reusing \`${cmdName}\`.`, {
      parse_mode: "Markdown"
    });
  }

  setCooldown(cmdName, userId);

  try {
    await command.execute(bot, msg, args);
  } catch (err) {
    console.error(`❌ Error executing '${cmdName}':`, err);
    bot.sendMessage(chatId, `⚠️ An error occurred while executing \`${cmdName}\`.`);
  }
});
