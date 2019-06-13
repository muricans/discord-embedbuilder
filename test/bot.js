const {
  Client,
  MessageEmbed,
} = require('discord.js');
const {
  token
} = require('./settings.json');
const client = new Client();
const EmbedBuilder = require('../src/index');

client.on('message', message => {
  if (message.author.bot) return;
  const builder = new EmbedBuilder(message.channel)
    .calculatePages(10, 2, (embed, i) => {
      embed.addField(i + 1, Math.floor(Math.random() * i));
    })
    .setTitle('Embed Examples')
    .setPageFormat('You are on page %p/%m');
  builder
    .addEmojis({
      '❗': () => {
        builder.updatePage(4);
      },
      '😄': (sent, page, emoji) => {
        sent.channel.send('😄 ' + page + emoji);
      },
    })
    .build();
});

client.login(token);