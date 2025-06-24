// core/rateLimit.js
const cooldowns = new Map();

function isLimited(userId, cooldown = 3000) {
  const now = Date.now();
  if (!cooldowns.has(userId)) {
    cooldowns.set(userId, now);
    return false;
  }

  const last = cooldowns.get(userId);
  if (now - last < cooldown) {
    return true;
  }

  cooldowns.set(userId, now);
  return false;
}

module.exports = { isLimited };
