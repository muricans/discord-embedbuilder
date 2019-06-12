# discord-embedbuilder
[![NPM](https://nodei.co/npm/discord-embedbuilder.png?downloads=true)](https://nodei.co/npm/discord-embedbuilder)

npm module to make creating embeds with mutliple pages a little bit easier

## Quick Install
`npm install discord-embedbuilder`

## Methods
All methods that have the same names as the ones from [RichEmbed](https://discord.js.org/#/docs/main/stable/class/RichEmbed) do the same actions as those, but applies it to all of the pages, which should override their values.

```usePages(use)```

If this is set to false, the builder will not use the next, back, last, first, stop emotes.

```setChannel(channel)```

The channel that is set here will be the channel the pages are sent to.

```setEmbeds(embeds)```

The array of RichEmbeds put here will be the ones that are used to make the pages. You can also add embeds using addEmbed.

```setTime(time)```

This will set how long the builder should listen for emotes. Make sure to set your time as milliseconds.

```getEmbeds()```

Returns the current embeds that the builder has.

```setBackEmoji, setNextEmoji, setFirstEmoji, setLastEmoji, setStopEmoji```

Insert a unicode emoji into one of these methods, and the embedbuilder will use it as the corresponding method name.

```addEmoji(emoji, (sent, page, builder, emoji))```

This will insert the provided emoji into the builder, and when it is clicked it will perform the action that is provided.

```javascript
builder.addEmoji('❗', (sent, page, builder, emoji) => {
    sent.delete();
    builder.cancel();
    sent.channel.send(`A new message${emoji}\nThe page you were on before was ${page}`);
});
```

```deleteEmoji(emoji)```

Deletes an emoji from the list of emojis.

```cancel(callback?)```

Cancels the builder before the timer ends.

If a callback is provided, it will execute after the builder has canceled.

## Example
First import discord-embedbuilder into your project.

```javascript
const EmbedBuilder = require('discord-embedbuilder');
```

Create a command or some way to get a channel to pass through the builder. If you are unsure on how to make a command, checking [this](https://discordjs.guide/) out might be helpful.

Next make your embedbuilder.

```javascript
client.on('message', message => {
    const builder = new EmbedBuilder()
        .setChannel(message.channel)
        .setTime(60000); // Time is in milliseconds
    const myEmbedArray = [
        new Discord.RichEmbed().addField('1st', 'page'),
        new Discord.RichEmbed().addField('2nd', 'page'), 
        new Discord.RichEmbed().addField('3rd', 'page'),
    ];
    builder
        .setEmbeds(myEmbedArray)
        .setTitle('This title stays the same on all pages!')
        .build(); // No need to send a message, building it will automatically do it.
});
```

Here's an example taken from my bot [mbot](https://github.com/muricans/mbot)

```javascript
module.exports = {
    name: 'leaderboard',
    description: 'Get up to 50 users with the most points',
    async execute(message, args, client) {
        const leaders = await leaderboard(message.channel, client);
        leaders.build();
    },
};

function leaderboard(channel, client) {
    return new Promise(async (resolve) => {
        const embeds = new EmbedBuilder();
        const users = [];
        for (let i = 0; i < tools.users(client).length; i++) {
            const user = tools.users(client)[i];
            const points = await tools.getPoints(user.id);
            users.push({
                id: user.id,
                username: user.username,
                points: points,
            });
        }
        users.sort((a, b) => (a.points > b.points) ? -1 : 1);
        let pages = 0;
        let m = 1;
        for (let i = 0; i < 10 * m; i++) {
            if (i === 50)
                break;
            if (!embeds.getEmbeds()[m - 1] && users[i]) {
                embeds.addEmbed(new Discord.RichEmbed());
                pages++;
            }
            if (i === (10 * m) - 1)
                m++;
        }
        let multiplier = 1;
        for (let i = 0; i < 10 * multiplier; i++) {
            if (i === 50) {
                break;
            }
            if (users[i]) {
                embeds.getEmbeds()[multiplier - 1]
                    .addField(`${i + 1}. ${users[i].username}`, users[i].points, true)
                    .setFooter(`Page ${multiplier}/${pages}`);
                if (i === (10 * multiplier) - 1) {
                    multiplier++;
                }
            }
        }
        embeds
            .setTitle('Points Leaderboard')
            .setTime(2 * 60000)
            .setChannel(channel);
        return resolve(embeds);
    });
}
```