const axios = require("axios");

module.exports = {
  name: "jan",
  aliases: ["jaan", "love", "hi", "count"],
  adminOnly: false,
  description: "Sweet replies or Q&A system via API",
  
  // ===== Fetch total Q&A count from server =====
  async fetchCount() {
    try {
      const res = await axios.get(`https://jan-api-by-aminul-sordar.vercel.app/count`);
      return res.data;
    } catch (e) {
      console.error("fetchCount error:", e.message);
      return { questions: 0, answers: 0 };
    }
  },

  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    const body = msg.text?.trim() || "";
    const command = args[0]?.toLowerCase();

    // === Handle "count" request ===
    if (command === "count" || msg.text.toLowerCase().endsWith("count")) {
      const count = await this.fetchCount();
      return bot.sendMessage(
        chatId,
        `📊 *জ্ঞানভাণ্ডার:*\n\n` +
        `📌 মোট প্রশ্ন: *${count.questions}*\n` +
        `📌 মোট উত্তর: *${count.answers}*\n\n` +
        `💡 আমাকে আরও শেখানোর মাধ্যমে আরও স্মার্ট করুন!\n` +
        `🔍 কিছু প্রশ্ন করুন, আমি চেষ্টা করব উত্তর দেওয়ার!`,
        { parse_mode: "Markdown" }
      );
    }

    // === Random reply logic ===
    const randomReplies = [
      "হ্যাঁ 😀, আমি এখানে আছি",
      "কেমন আছো?",
      "বলো জান কি করতে পারি তোমার জন্য",
      `তুমি বলেছো: "${body}"? কিউট!`,
      "I love you 💝",
      "ভালোবাসি তোমাকে 🤖",
      "Hi, I'm messenger Bot, I can help you.?🤖",
      "Use callad to contact admin!",
      "Hi, Don't disturb 🤖 🚘 Now I'm going to Feni, Bangladesh..bye",
      "Hi, 🤖 I can help you~~~~",
      "আমি এখন আমিনুল বসের সাথে বিজি আছি",
      "আমাকে আমাকে না ডেকে আমার বসকে ডাকো এই নেও LINK :- https://www.facebook.com/100071880593545",
      "Hmmm sona 🖤 meye hoile kule aso ar sele hoile kule new 🫂😘",
      "Yah This Bot creator : PRINCE RID((A.R))     link => https://www.facebook.com/100071880593545",
      "হা বলো, শুনছি আমি 🤸‍♂️🫂",
      "Ato daktasen kn bujhlam na 😡",
      "jan bal falaba,🙂",
      "ask amr mon vlo nei dakben na🙂",
      "Hmm jan ummah😘😘",
      "jang hanga korba 🙂🖤",
      "iss ato dako keno lojja lage to 🫦🙈",
      "suna tomare amar valo lage,🙈😽"
    ];

    const reply = randomReplies[Math.floor(Math.random() * randomReplies.length)];
    return bot.sendMessage(chatId, reply);
  }
};
