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

const prefix = "?";
const ron = "https://api.coingecko.com/api/v3/simple/price?ids=ronin&vs_currencies=usd";
const axs = "https://api.coingecko.com/api/v3/simple/price?ids=axie-infinity&vs_currencies=usd";
const slp = "https://api.coingecko.com/api/v3/simple/price?ids=smooth-love-potion&vs_currencies=usd";
const tokenArray = ['axie-infinity','smooth-love-potion','ronin'];
const urlArray = [axs, slp, ron];
let lastPrice;
let lastToken;
let lastTokenID;
let newToken;
let respuesta;
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
    BOT.user.setActivity(lastTokenID + " " + lastPrice + '$', { type: "WATCHING" }).catch(console.error);
  }, 7500);
});

client.on("message", message =>{
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  if(message.content.startsWith(`${prefix}axs`)){
    getFastPrice(0, message);
  }else if (message.content.startsWith(`${prefix}slp`)) {
    getFastPrice(1, message)
  }else if (message.content.startsWith(`${prefix}ron`)) {
    getFastPrice(2, message)
  }else if(message.content.startsWith(`${prefix}help`)){
    message.channel.send("```md\n - ?axs - Devuelve el precio del AXS. \n - ?slp - Devuelve el precio del SLP. \n - ?ron - Devuelve el precio del RON. \n - ?help - Muestra todos los comandos disponibles```");
  }else{
    message.channel.send("Comando inválido, prueba a utilizar ?help para obtener los comandos disponibles.");
  }
});

function getPrice() {
  aux == 3 ? aux = 0 : '';
  axios.get(urlArray[aux]).then((response) => {
    lastToken = tokenArray[aux];
    lastPrice = response.data[lastToken]['usd'];
    if(aux == 0){
      lastTokenID = 'AXS'
    }else if(aux == 1){
      lastTokenID = 'SLP'
    }else{
      lastTokenID = 'RON'
    }
    aux++;
  });
}

function getFastPrice(token, message){
  axios.get(urlArray[token]).then((response)=>{
    let id;
    newToken = tokenArray[token];
    if(token == 0) id = 'AXS';
    else if (token == 1) id = 'SLP'
    else id = 'RON'
    message.channel.send("Hola " + message.author.username + "```md\nTokenID: " + id + "\nPrice: " + response.data[newToken]['usd'] + '$```');
  });
}

keepAlive();
client.login(BOT_TOKEN);
