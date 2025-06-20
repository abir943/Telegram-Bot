const fs = require("fs");
const path = require("path");
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

// === Load Config ===
const loadConfig = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Missing ${filePath}!`);
      process.exit(1);
    }
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    console.error(`❌ Error loading ${filePath}:`, error);
    process.exit(1);
  }
};

const config = loadConfig("./config.json");
const botPrefix = config.botPrefix || "/";
const botAdmins = config.botAdmins || [];
const ownerID = config.ownerID;
const botName = config.botName || "TelegramBot";
const token = config.token;

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

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/status", (req, res) => {
  res.json({
    bot: botName,
    status: "🟢 Running",
    totalCommands: global.commands.size
  });
});

app.listen(PORT, () => {
  console.log(`🌐 Web Server is running.`);
});

// === Load Commands ===
const loadCommands = () => {
  try {
    const cmdPath = path.join(__dirname, "cmds");
    const files = fs.readdirSync(cmdPath).filter(f => f.endsWith(".js"));
    for (const file of files) {
      delete require.cache[require.resolve(`./cmds/${file}`)];
      const cmd = require(`./cmds/${file}`);
      if (cmd.name && typeof cmd.execute === "function") {
        global.commands.set(cmd.name, cmd);
        if (Array.isArray(cmd.aliases)) {
          cmd.aliases.forEach(alias => global.aliases.set(alias, cmd.name));
        }
        console.log(`📦 Loaded command: ${cmd.name}`);
      }
    }
    console.log(`✅ Total commands loaded: ${global.commands.size}`);
  } catch (err) {
    console.error("❌ Failed to load commands:", err);
  }
};

// === Cooldown System ===
const checkCooldown = (cmdName, userId) => {
  const now = Date.now();
  if (!global.cooldowns.has(userId)) return null;

  const userCooldowns = global.cooldowns.get(userId);
  const lastUsed = userCooldowns[cmdName] || 0;
  const cooldownTime = 5000;
  const remaining = cooldownTime - (now - lastUsed);
  return remaining > 0 ? remaining : null;
};

const setCooldown = (cmdName, userId) => {
  if (!global.cooldowns.has(userId)) global.cooldowns.set(userId, {});
  global.cooldowns.get(userId)[cmdName] = Date.now();
};

const isAdmin = (userId) => {
  return botAdmins.includes(String(userId)) || String(userId) === String(ownerID);
};

// === Init Telegram Bot ===
const bot = new TelegramBot(token, { polling: true });
loadCommands();

console.log(`🤖 ${botName} is online!`);
bot.sendMessage(ownerID, `🚀 *${botName} is now live!*`, {
  parse_mode: "Markdown"
});

// === Handle Messages ===
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userId = String(msg.from.id);
  const text = msg.text || "";

  if (!text.startsWith(botPrefix)) return;

  let args = text.slice(botPrefix.length).trim().split(/\s+/);
  let cmdName = args.shift().toLowerCase();

  if (global.aliases.has(cmdName)) {
    cmdName = global.aliases.get(cmdName);
  }

  const command = global.commands.get(cmdName);
  if (!command) {
    return bot.sendMessage(chatId, `❌ Command \`${cmdName}\` not found.\nTry \`${botPrefix}help\` to see available commands.`, {
      parse_mode: "Markdown"
    });
  }

  if (command.adminOnly && !isAdmin(userId)) {
    return bot.sendMessage(chatId, "🚫 You don't have permission to use this command.");
  }

  const remaining = checkCooldown(cmdName, userId);
  if (remaining) {
    return bot.sendMessage(chatId, `⏳ Wait ${Math.ceil(remaining / 1000)}s before using \`${cmdName}\` again.`, {
      parse_mode: "Markdown"
    });
  }

  setCooldown(cmdName, userId);

  try {
    await command.execute(bot, msg, args);
  } catch (error) {
    console.error(`❌ Error in '${cmdName}':`, error);
    bot.sendMessage(chatId, `⚠️ Error occurred in \`${cmdName}\`.`);
  }
});
