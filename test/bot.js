const {
  Client, GatewayIntentBits, Events
} = require('discord.js');
const {
  token
} = require('./settings.json');
const client = new Client({intents: [GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMembers,
GatewayIntentBits.GuildMessageReactions]});
const {
  PageEmbedBuilder
} = require('../out/index');

const multiFields = [{
  name: 'test',
  value: '123'
}, {
  name: 'test2',
  value: '321'
}];

client.on(Events.MessageCreate, async message => {
  if (message.author.bot || !message.content.startsWith('test')) return;
  const help = new PageEmbedBuilder(message.channel);
  const other = new PageEmbedBuilder(message.channel);
  other.calculatePages(20, 8, (embed, i) => {
    embed.addFields({
      name: i.toString() + ' other',
      value: Math.floor(Math.random() * 4).toString()
    }).setTitle('Other Commands');
  });
  help.calculatePages(23, 3, (embed, i) => {
      embed.addFields({
        name: i.toString(),
        value: Math.floor(Math.random() * 23).toString()
      });
    })
    .addFields(multiFields)
    .addField("test", "test2")
    .addEmoji('👍', (sent) => {
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