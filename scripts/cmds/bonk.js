const axios = require("axios");

module.exports = {
  config: {
    name: "bonk",
    aliases: [],
    version: "1.2.0",
    author: "SiFu",
    role: 0,
    shortDescription: {
      en: "Bonk someone 😆"
    },
    longDescription: {
      en: "Bonk meme with profile pictures. Sender holds the bat."
    },
    category: "fun",
    guide: {
      en: "{pn} @mention / reply"
    }
  },

  onStart: async function ({ api, event, usersData }) {
    try {
      let senderID = event.senderID; // The attacker (holds the bat)
      let targetID; // The victim (gets bonked)

      // Reply priority
      if (event.messageReply) {
        targetID = event.messageReply.senderID;
      }
      // Mention priority
      else if (Object.keys(event.mentions).length > 0) {
        targetID = Object.keys(event.mentions)[0];
      }
      // Default (Bonk self if no target selected)
      else {
        targetID = senderID;
      }

      // Define avatars based on IDs
      // avatar1 variable = Sender's picture
      const avatar1Url = `https://graph.facebook.com/${senderID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      // avatar2 variable = Target's picture
      const avatar2Url = `https://graph.facebook.com/${targetID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      // FIX: Swapped parameters based on API requirement.
      // API avatar1 = Victim (Target URL)
      // API avatar2 = Attacker (Sender URL)
      const imgUrl = `https://sifuapi.vercel.app/canvas/bonk?avatar1=${encodeURIComponent(avatar2Url)}&avatar2=${encodeURIComponent(avatar1Url)}`;

      const name1 = await usersData.getName(senderID);
      const name2 = await usersData.getName(targetID);

      return api.sendMessage(
        {
          body: `😂 ${name1} bonked ${name2}!\n\n🔨 BONK!`,
          attachment: await global.utils.getStreamFromURL(imgUrl)
        },
        event.threadID,
        event.messageID
      );

    } catch (err) {
      console.error(err);
      return api.sendMessage(
        "❌ An error occurred while bonking 😿",
        event.threadID,
        event.messageID
      );
    }
  }
};