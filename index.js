import { Client, Intents } from "discord.js";
import axios from "axios";
import express from "express";

const server = express();

server.get('/', function (req, res) {
  res.send('AxieTracker')
});

function keepAlive() {
  server.listen(3000, () => {
    console.log("Server is ready.");
  });
}

const ron = "https://api.coingecko.com/api/v3/simple/price?ids=ronin&vs_currencies=usd";
const axs = "https://api.coingecko.com/api/v3/simple/price?ids=axie-infinity&vs_currencies=usd";
const slp = "https://api.coingecko.com/api/v3/simple/price?ids=smooth-love-potion&vs_currencies=usd";
const tokenArray = ['axie-infinity','smooth-love-potion','ronin'];
const urlArray = [ron, axs, slp];
let lastPrice;
let lastToken;
let aux = 0;

const client = new Client({
  intents: [Intents.FLAGS.GUILDS],
});

const BOT_ID = process.env["BOT_ID"];
const BOT_TOKEN = process.env["BOT_TOKEN"];

client.once("ready", () => {
  console.log("We on . . .");

  const SERVER_ID = process.env["SERVER_ID"];
  const guild = client.guilds.cache.get(SERVER_ID);
  const BOT = guild.members.cache.get(BOT_ID);

  setInterval(async () => {
    getPrice();
    BOT.user.setActivity(lastToken + " " + lastPrice + '$', { type: "WATCHING" }).catch(console.error);
  }, 5000);
});

function getPrice() {
  aux == 2 ? aux = 0 : '';
  axios.get(urlArray[aux]).then((response) => {
    lastToken = tokenArray[aux];
    lastPrice = response.data[lastToken]['usd'];
    aux++;
  });
}

keepAlive();
client.login(BOT_TOKEN);
