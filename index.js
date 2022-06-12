const fs = require('node:fs');
const { remove } = require("confusables");
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const token = process.env['token'];
const Database = require("@replit/database");
const db = new Database();
const keepAlive  = require("./server.js");
  
client.commands = new Collection();

let badWords = [
  "vai se fude",
  "vai pro caralho",
  "caralhudo",
  "va para o caralho",
  "porrinha",
  "baitola",
  "bicha",
  "boceta",
  "buceta",
  "bucetão",
  "cuzão",
  "fuder",
  "cacete",
  "pênis",
  "transar",
  "foder",
  "fodendo",
  "boquete",
  "vsf",
  "fdp",
  "xereca",
  "xana",
  "vagina",
  "cu",
  "cuzinho",
  "bucetinha",
  "corno",
  "corna",
  "cuzuda",
  "fode",
  "fodida",
  "fudido",
  "fudida",
  "fodido",
  "pinto",
  "pintão",
  "roludo",
  "roluda",
  "sacudo",
  "piroca",
  "punheta",
  "punhetão",
  "masturbação",
  "puta",
  "puto",
  "siririca",
  "vagabunda",
  "vagabundo",
  "xota",
  "xoxota",
  "xaninha",
  "arrombado",
  "boqueteiro",
  "cabaço",
  "fimosento",
  "demente",
  "cocozento",
  "vadia",
  "vai a merda",
  "va a merda",
  "xavasca",
  "boiola",
  "gozada",
  "gozar",
  "gozei",
  "esperma",
  "masturbar",
  "masturba",
  "masturbe",
  "masturbe-se",
];

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}


client.on('ready', async () => {
	console.log('on')
  });


client.on('messageCreate', async msg => {
  if(msg.author.bot) return;
	if(msg.channelId == '961176960086720532'||msg.channelId == "864730261588803605") { 
		let rg = /(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/;
		if(!msg.attachments.firstKey()&&!msg.content.match(rg)){
			setTimeout(() => msg.delete(), 1000);
		}
	}

if(msg.channelId == '961172391529160734'||msg.channelId == '961176833343246348') return;
let data = await db.get("usersData");
let user = data['users'][msg.author.id];
  
  if (!user) {
    data['users'][msg.author.id] = {
      id: msg.author.id,
      name: `${msg.author.username}`,
      img: msg.author.avatarURL(),
      badWords: {},
    };
    await db.set("usersData", data);
    data = await db.get("usersData");
    user = data['users'][msg.author.id];
  }
  let check = msg.content;
  for (word of badWords) {
    let rgx = new RegExp("\\b" + remove(word) + "\\b", "ig");
    let bol = remove(check).match(rgx);
    if (bol) {
      msg.client.channels.cache
        .find((ch) => ch.id == "959996003816185908")
        .send(
          `Atenção! Um usuário disse uma palavra proibida: \n Nome: ${msg.author.username} \n Id: ${msg.author.id} \n Mensagem: ${msg.content} \n Link: ${msg.url}`
        );
      if (!user.badWords[word]) {
        data['users'][user['id']].badWords[word] = 1;
        await db.set("usersData", data);
      } else {
        data['users'][user['id']].badWords[word]++;
        await db.set("usersData", data);
      }
    }
  }
  });

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});


keepAlive();
client.login(token);

