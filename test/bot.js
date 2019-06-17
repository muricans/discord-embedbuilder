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

client.on('message', async message => {
  if (message.author.bot || !message.content.startsWith('test')) return;
  const help = new EmbedBuilder(message.channel);
  const other = new EmbedBuilder(message.channel);
  await Promise.all([
    help.calculatePages(23, 3, (embed, i) => {
      embed.addField(i, Math.floor(Math.random() * 23));
    }),
    other.calculatePages(20, 8, (embed, i) => {
      embed.addField(i + ' other', Math.floor(Math.random() * 4));
    }),
  ]);
  other.setTitle('Other Commands');
  help
    .setTitle('Commands')
    .concatEmbeds(other.embeds)
    .build();
});

client.login(token);