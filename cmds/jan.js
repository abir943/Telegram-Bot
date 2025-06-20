module.exports = {
  name: "jan",
  aliases: ["jaan", "love", "hi"],
  adminOnly: false,
  description: "Sweet random replies like a girlfriend 🤭",
  
  async execute(bot, msg, args) {
    const chatId = msg.chat.id;
    const body = msg.text?.trim() || "";

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

    // Pick a random reply
    const reply = randomReplies[Math.floor(Math.random() * randomReplies.length)];

    // Send it
    return bot.sendMessage(chatId, reply);
  }
};
