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
    .on('create', () => console.log('created'))
    .setTitle('Embed Examples')
    .calculatePages(10, 2, (embed, i) => {
      embed.addField(`${i}`, 'page');
    }).then(builder => {
      builder.build()
        .then(builder => {
          console.log('yes');
        });
    });
});

client.login(token);