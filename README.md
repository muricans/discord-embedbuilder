# discord-embedbuilder
[![NPM](https://nodei.co/npm/discord-embedbuilder.png?downloads=true)](https://nodei.co/npm/discord-embedbuilder)

npm module to make creating embeds with mutliple pages a little bit easier

[v11 Documentation](https://muricans.github.io/embedbuilder/v11)

[v12 Documentation](https://muricans.github.io/embedbuilder)

## Quick Install
`npm install muricans/discord-embedbuilder#v11`

discord.js v12

`npm install discord-embedbuilder`

## Methods
Some methods here are different than those for discord.js v11.

All methods that have the same names as the ones from [MessageEmbed](https://discord.js.org/#/docs/main/master/class/MessageEmbed) do the same actions as those, but applies it to all of the pages, which should override their values.

`usePages(use)`

If this is set to false, the builder will not use the next, back, last, first, stop emotes.

`setChannel(channel)`

The channel that is set here will be the channel the pages are sent to.

`setEmbeds(embeds)`

The array of MessageEmbeds put here will be the ones that are used to make the pages. You can also add embeds using addEmbed.

`addEmbed(embed)`

Adds a MessageEmbed to the array of embeds.

`concatEmbeds(embeds)`

Puts the array of embeds given at the end of the current embeds array.

`setTime(time)`

This will set how long the builder should listen for emotes. Make sure to set your time as milliseconds.

`getEmbeds()`

Returns the current embeds that the builder has.

`setBackEmoji, setNextEmoji, setFirstEmoji, setLastEmoji, setStopEmoji`

Insert a unicode emoji into one of these methods, and the embedbuilder will use it as the corresponding method name.

`addEmoji(emoji, (sent, page, builder, emoji))`

This will insert the provided emoji into the builder, and when it is clicked it will perform the action that is provided.

```javascript
builder.addEmoji('❗', (sent, page, emoji) => {
    sent.delete();
    builder.cancel();
    sent.channel.send(`A new message${emoji}\nThe page you were on before was ${page}`);
});
```

`addEmojis(emojiList)`

Add multiple emojis to do different actions.

```javascript
builder.addEmojis([{
    emoji: '❗',
    do(sent, page, emoji) => {
        sent.delete();
        builder.cancel();
        sent.channel.send(`A new message${emoji}\nThe page you were on before was ${page}`);
    },
}]);
```

`deleteEmoji(emoji)`

Deletes an emoji from the list of emojis.

`cancel(callback?)`

Cancels the builder before the timer ends.

If a callback is provided, it will execute after the builder has canceled.

`showPageNumber(use)`

If set to true (by default it is true), it will show the current page on the footer of the embed. (Page x/y)

`setPageFormat(format)`

If showing page numbers, this is the format that will be used.

By default format is %p/%m which converts to current/max.

`calculatePages(data, dataPerPage, insert)`

This calculates pages for the builder to work with.

```javascript
/*
This will generate a builder with a data length set to an array.
It will have 10 fields per page, which will all be inline, containing username and points data.
*/
embedBuilder.calculatePages(users.length, 10, (embed, i) => {
    embed.addField(users[i].username, users[i].points, true);
});
```

`updatePage(page)`

Updates the current page to the one set there. This checks if the page is valid itself. Make sure the first page of the builder has already gone through before using this.

## Events
[`create`](https://muricans.github.io/embedbuilder/classes/embedbuilder.html#create)

Emitted from build() when the first page has finished building.

[`stop`](https://muricans.github.io/embedbuilder/classes/embedbuilder.html#delete)

Emitted from build() when the timer has run out, or the collector is canceled in any way.

['pageUpdate'](https://muricans.github.io/embedbuilder/v12/classes/embedbuilder.html#pageUpdate)

Emitted from updatePage(). Sets the new page for the bot.

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
        new Discord.MessageEmbed().addField('1st', 'page'),
        new Discord.MessageEmbed().addField('2nd', 'page'), 
        new Discord.MessageEmbed().addField('3rd', 'page'),
    ];
    builder
        .setEmbeds(myEmbedArray)
        .setTitle('This title stays the same on all pages!')
        .build(); // No need to send a message, building it will automatically do it.
});
```

Here's an example taken from my bot [mbot](https://github.com/muricans/mbot/tree/v12-testing)

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
        embeds.calculatePages(users.length, 10, (embed, i) => {
            embed.addField(`${i + 1}. ${users[i].username}`, users[i].points, true);
        });
        embeds
            .setTitle('Points Leaderboard')
            .setTime(2 * 60000)
            .setChannel(channel);
        return resolve(embeds);
    });
}
```
