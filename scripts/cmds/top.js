module.exports = {
  config: {
    name: "top",
    version: "3.5",
    author: "SiFu",
    category: "economy",
    shortDescription: { en: "View the global richest leaderboard" },
    longDescription: { en: "Displays the top users with money, including your own global rank." },
    guide: { en: "{pn} [amount]" },
    role: 0,
    countDown: 10
  },

  onStart: async function ({ message, usersData, args, event }) {
    const allUserData = await usersData.getAll();
    const senderID = event.senderID;

    // Stylish Font Converter
    const stylize = (str) => {
      const map = {
        'a': '𝖺', 'b': '𝖻', 'c': '𝖼', 'd': '𝖽', 'e': '𝖾', 'f': '𝖿', 'g': '𝗀', 'h': '𝗁', 'i': '𝗂', 'j': '𝗃', 'k': '𝗄', 'l': '𝗅', 'm': '𝗆', 'n': '𝗇', 'o': '𝗈', 'p': '𝗉', 'q': '𝗊', 'r': '𝗋', 's': '𝗌', 't': '𝗍', 'u': '𝗎', 'v': '𝗏', 'w': '𝗐', 'x': '𝗑', 'y': '𝗒', 'z': '𝗓',
        '0': '０', '1': '１', '2': '２', '3': '３', '4': '４', '5': '５', '6': '６', '7': '７', '8': '８', '9': '９'
      };
      return str.toString().toLowerCase().split('').map(char => map[char] || char).join('');
    };

    // Filter and Sort Users
    const sortedUsers = allUserData
      .filter((u) => u && u.money !== undefined && !isNaN(u.money))
      .sort((a, b) => b.money - a.money);

    const inputCount = parseInt(args[0]) || 10;
    const topCount = Math.min(Math.max(inputCount, 5), 30); // Min 5, Max 30

    if (sortedUsers.length === 0) return message.reply("⚠️ 𝖭𝗈 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺 𝖿𝗈𝗎𝗇𝖽 𝗂𝗇 𝖽𝖺𝗍𝖺𝖻𝖺𝗌𝖾.");

    let msg = `🏆 𝐑𝐈𝐂𝐇𝐄𝐒𝐓 𝐋𝐄𝐀𝐃𝐄𝐑𝐁𝐎𝐀𝐑𝐃 🏆\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;

    for (let i = 0; i < Math.min(topCount, sortedUsers.length); i++) {
      const user = sortedUsers[i];
      const name = user.name || "𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖴𝗌𝖾𝗋";
      const moneyFormatted = formatLargeNumber(user.money);
      
      let rankIcon = "";
      if (i === 0) rankIcon = "🥇 𝖪𝗂𝗇𝗀:";
      else if (i === 1) rankIcon = "🥈 𝖰𝗎𝖾𝖾𝗇:";
      else if (i === 2) rankIcon = "🥉 𝖤𝗅𝗂𝗍𝖾:";
      else rankIcon = `${i + 1}. 𝖬𝖾𝗆𝖻𝖾𝗋:`;

      msg += ` ${rankIcon} ${name}\n`;
      msg += ` └── 💸 𝖡𝖺𝗅𝖺𝗇𝖼𝖾: $${moneyFormatted}\n\n`;
    }

    // Find Sender's Rank
    const senderRank = sortedUsers.findIndex(u => u.userID == senderID) + 1;
    const senderMoney = sortedUsers.find(u => u.userID == senderID)?.money || 0;

    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `👤 𝖸𝗈𝗎𝗋 𝖦𝗅𝗈𝖻𝖺𝗅 𝖲𝗍𝖺𝗍𝗎𝗌:\n`;
    msg += `» 𝖱𝖺𝗇𝗄: #${senderRank} | 𝖡𝖺𝗅𝖺𝗇𝖼𝖾: $${formatLargeNumber(senderMoney)}\n`;
    msg += `✨ ${stylize("keep earning to stay ahead")}`;

    message.reply(msg);
  },
};

// Advanced Large Number Formatter (Centillion Support)
function formatLargeNumber(amount) {
    if (amount < 1000) return amount.toLocaleString();
    const lookup = [
        { value: 1e303, symbol: "Ct" }, { value: 1e100, symbol: "Googol" },
        { value: 1e63, symbol: "V" }, { value: 1e33, symbol: "Dc" },
        { value: 1e12, symbol: "T" }, { value: 1e9, symbol: "B" },
        { value: 1e6, symbol: "M" }, { value: 1e3, symbol: "K" }
    ];
    const item = lookup.find(item => amount >= item.value);
    return item 
        ? (amount / item.value).toFixed(2).replace(/\.00$/, "") + " " + item.symbol 
        : amount.toLocaleString();
}