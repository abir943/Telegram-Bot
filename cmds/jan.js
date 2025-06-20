const axios = require("axios");

module.exports = {
  name: "jan",
  aliases: [],
  adminOnly: false,
  usePrefix: false, // ⬅️ Disable prefix requirement
  description: "Sweet replies + Q&A system with learning",

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

  // ===== Teach multiple questions at once =====
  async teachMultiple(qaText) {
    try {
      const res = await axios.post(`https://jan-api-by-aminul-sordar.vercel.app/teach`, {
        text: qaText
      });
      return res.data.message;
    } catch (e) {
      console.error("teachMultiple error:", e.message);
      return "❌ শেখানো ব্যর্থ হয়েছে! সার্ভার সমস্যা হতে পারে।";
    }
  },

  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    const body = msg.text?.trim().toLowerCase() || "";

    // === Handle Q&A Count Request ===
    if (body.startsWith("count")) {
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

    // === Handle Teach Command ===
    if (body.startsWith("teach")) {
      const input = body.slice(5).trim();
      if (!input.includes(" - ")) {
        return bot.sendMessage(chatId,
          "❌ সঠিক ফরম্যাট ব্যবহার করুন:\n`teach প্রশ্ন - উত্তর`\n\nএকাধিক প্রশ্ন দিতে চাইলে `|` দিয়ে আলাদা করুন।",
          { parse_mode: "Markdown" }
        );
      }

      const resultMsg = await this.teachMultiple(input);
      return bot.sendMessage(chatId, `✅ ${resultMsg}`);
    }

    // === Random Replies ===
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
