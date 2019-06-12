const {
    Client,
    MessageEmbed,
} = require('discord.js');
const client = new Client();
const EmbedBuilder = require('../src/index');

client.on('message', message => {
    if (message.author.bot) return;

    const builder = new EmbedBuilder()
        .setChannel(message.channel);

    const users = [];

    for (let i = 0; i < 173; i++) {
        const id = Math.floor(Math.random() * 31859151) + i;
        const points = Math.floor(Math.random() * 100000);
        users.push({
            id: id,
            points: points,
        });
    }

    users.sort((a, b) => (a.points > b.points) ? -1 : 1);

    console.log(users.length);

    builder.calculatePages(users.length, 10, (embed, i) => {
            embed.addField(`${i + 1}. ${users[i].id}`, users[i].points, true);
        })
        .setTitle('Points Leaderboard');
    //.build();
    /* 
    This embed is only one page, 
    so no emotes except for custom ones will be added to it.
    I also prevented it from adding page number to the footer.
    */
    //builder.build();

    /*
    This embed has multiple pages,
    unless I usePages(false) it will react with all default emotes.
    This build is using a custom page format.
    */
    new EmbedBuilder()
        .setChannel(message.channel)
        .setTime(5000)
        .addEmoji('❗', (sent, page, emoji) => {
            console.log('emoji ' + emoji + ' received');
        })
        .addEmbed(new MessageEmbed().addField('1st', 'page'))
        .addEmbed(new MessageEmbed().addField('2nd', 'page'))
        .addEmbed(new MessageEmbed().addField('3rd', 'page'))
        .setPageFormat('You are on page %p out of %m')
        .build().on('create', () => {
            console.log('build created');
        }).on('stop', () => {
            console.log('build stopped');
        });
});

client.login('NTc5MDE3NDA5NTI1MTg2NTY2.XOHIEw.pMIqgCc4yPKFE7JshqemZGPvcWk');