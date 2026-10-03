require("dotenv").config();

const { App } = require("@slack/bolt");
const axios = require("axios");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/slackity-ping", async ({ ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/slackity-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text: `Available Commands:
/slackity-ping - Check bot latency
/slackity-joke - Get a random joke
/slackity-help - Show this help message`
  });
});

app.command("/slackity-joke", async ({ ack, respond }) => {
  await ack();
  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text: `${response.data.setup}\n\n${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke. Try again!" });
  }
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();
