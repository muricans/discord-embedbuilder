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
    const emojis = [];
    const builder = new EmbedBuilder()
        .setChannel(message.channel)
        .calculatePages(10, 2, (embed, i) => {
            embed.addField(i + 1, Math.floor(Math.random() * i));
        })
        .setTitle('Embed Examples')
        .setPageFormat('You are on page %p/%m');
    emojis.push({
        emoji: '😄',
        do(sent, page, emoji) {
            sent.channel.send('😄 ' + page + emoji);
        }
    });
    emojis.push({
        emoji: '❗',
        do(sent, page, emoji) {
            builder.updatePage(4);
        }
    })
    builder.addEmojis(emojis)
        .build();
});

client.login(token);