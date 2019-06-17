const {
  Client,
  MessageEmbed,
} = require('discord.js');
const {
  token
} = require('./settings.json');
const client = new Client();
const {
  EmbedBuilder
} = require('../out/index');

client.on('message', message => {
  if (message.author.bot || !message.content.startsWith('test')) return;
  new EmbedBuilder(message.channel)
    .calculatePages(10, 2, (embed, i) => {
      embed.addField(i + 1, Math.floor(Math.random() * i));
    })
    .setTitle('Embed Examples')
    .build();
});

client.login(token);