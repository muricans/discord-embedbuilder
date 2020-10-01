/* eslint-disable */
const {
  Client
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
  const multiFields = [{
    name: 'test',
    value: 123
  }, {
    name: 'test2',
    value: 321
  }];
  const help = new EmbedBuilder(message.channel);
  const other = new EmbedBuilder(message.channel);
  other.calculatePages(20, 8, (embed, i) => {
      embed.addField(i + ' other', Math.floor(Math.random() * 4));
    })
    .setTitle('Other Commands');
  help.addFields(multiFields)
    .calculatePages(23, 3, (embed, i) => {
      embed.addField(i, Math.floor(Math.random() * 23));
    })
    .addField("test", "test2")
    .addEmoji('757146517978087444', (sent) => {
      sent.channel.send('yep');
    })
    .setTitle('Commands')
    .concatEmbeds(other.embeds)
    .setTime(5000)
    .resetTimerOnPage()
    .build().then(() => {
      help.awaitPageUpdate(message.author);
    });
});

client.login(token);