var Discord = require("discord.js");
var bot = new Discord.Client();
const fs = require("fs");

//Server add link:
//https://discordapp.com/oauth2/authorize?client_id=269895121762385920&scope=bot

bot.on("message", message => {
  function help() {
    message.channel.sendMessage("__**Vaultbot Help**__\n**Commands:**\nReplace the text inside `[]` with the text you want to use. Do not write the square brackets.\n\n__Bio__\n\n`&bio` - Displays your bio\n`&bio set name [name here]` - Sets the name you want to display on your bio. Must be 32 characters or less.\n`&bio set bio [write your bio here]` - Sets the bio you want to display. Must be 500 characters or less.\n`&bio @[user]` - Displays the bio of the user mentioned.");
  }
  //Set the prefix
  prefix = "&"
  let user = message.author.id;

  if(!message.content.startsWith(prefix)) return;
  if(message.author.bot) return;

  //If the user wants to set their bio
  if (message.content.startsWith(prefix + "bio")) {
    let command = message.content.slice(5);
    let bioList = JSON.parse(fs.readFileSync('./bios.json', 'utf8'));
    let specialCases = JSON.parse(fs.readFileSync('./specialCases.json', 'utf8'));

    if (command.startsWith("set bio ")){
      if (command.slice(8).length <= 500){
        let userBio = command.slice(8);
        message.channel.sendMessage(message.author.username + " has successfully set their bio.");
        console.log(message.author.username);
        if (user in bioList) {
          bioList[user].bio = userBio;
        }
        else {
          bioList[user] = {name:message.author.username, bio:userBio};
        }
        fs.writeFile('./bios.json', JSON.stringify(bioList), console.error);
      }
      else{
      message.channel.sendMessage("The bio must be not longer than 500 characters.")
      }
    }
    //If the user wants to set their name
    else if (command.startsWith("set name")){
      if (command.slice(9).length <= 32){
        let userName = command.slice(9);
        message.channel.sendMessage(message.author.username + " has successfully set their name.");
        console.log(message.author.username);
        if (user in bioList) {
          bioList[user].name = userName;
        }
        else {
          bioList[user] = {name:userName, bio:"A mystery, wrapped in an enigma, wrapped in bacon."};
        }
        fs.writeFile('./bios.json', JSON.stringify(bioList), console.error);
      }
      else{
        message.channel.sendMessage("The user name must be no longer than 32 characters.")
      }
    }
    //With no additional parameters, the output will be the user's own bio.
    else if (message.content == "&bio"){
      if (!(message.author.id in bioList)){
        bioList[user] = {name:message.author.username, bio:"A mystery, wrapped in an enigma, wrapped in bacon."};
        fs.writeFile('./bios.json', JSON.stringify(bioList), console.error);
      }
      if (message.author.id in specialCases) message.channel.sendMessage(specialCases[message.author.id].message);
      message.channel.sendMessage("```" + bioList[message.author.id].name + " \n\n" + bioList[message.author.id].bio + "```");
    }

    //Check if the message mentions @here, @everyone, or an invalid user. It will run if the mention is valid.
    else if (!message.content.includes("@here") && !message.content.includes("@everyone") && message.cleanContent != message.content) {
      let target = message.mentions.users.first();
      if (!(target.id in bioList)){
        bioList[target.id] = {name:target.username, bio:"A mystery, wrapped in an enigma, wrapped in bacon."};
        fs.writeFile('./bios.json', JSON.stringify(bioList), console.error);
      }
      if (target.id in specialCases) message.channel.sendMessage(specialCases[target.id].message);
      message.channel.sendMessage("```" + bioList[target.id].name + " \n\n" + bioList[target.id].bio + "```");
    }
    //If all else fails, send help.
    else help();
  }
  //More commands go here.

  //If there is no recognised command, send help.
  else help();

});

bot.on('ready', () => {
  console.log('I am ready!');
});

bot.login("MjY5ODk1MTIxNzYyMzg1OTIw.C1v_lQ.SPkJkfVEG7dfZGLol2fnop5_sDo");
