# discord-embedbuilder
[![dependencies Status](https://david-dm.org/muricans/discord-embedbuilder/status.svg)](https://david-dm.org/muricans/discord-embedbuilder)

[![NPM](https://nodei.co/npm/discord-embedbuilder.png?downloads=true)](https://nodei.co/npm/discord-embedbuilder)

npm module to make creating embeds with mutliple pages a little bit easier

[latest version documentation](http://github.muricans.xyz/embedbuilder)

[master documentation](http://github.muricans.xyz/embedbuilder/master)

## Quick Install

discord-embedbuilder v4.0.0(current stable)

`npm install discord-embedbuilder`

discord-embedbuilder master (v4.0.0)

`npm install muricans/discord-embedbuilder`

discord-embedbuilder uses the latest stable version of discord.js (14.6.0)

## Methods
All methods that have the same names as the ones from [EmbedBuilder](https://discord.js.org/#/docs/builders/main/class/EmbedBuilder) do the same actions as those, but applies it to all of the pages, which should override their values.

### `usePages(use)`

If this is set to false, the builder will not use the next, back, last, first, stop emotes.

<hr/>

### `changeChannel(channel)`

Change the current channel.

**<span style="color:red">Warning:</span>** This should not be used to set the channel. You can set the channel in the constructor.

<hr/>

### `setEmbeds(embeds)`

The array of EmbedBuilders put here will be the ones that are used to make the pages. You can also add embeds using addEmbed.

<hr/>

### `addEmbed(embed)`

Adds an EmbedBuilder to the array of embeds.

<hr/>

### `concatEmbeds(embeds)`

Puts the array of embeds given at the end of the current embeds array.

<hr/>

### `setEndColor(color)`

When the collection has ended, and no other custom color is being used, this will be the color the embed is set to. Default is 0xE21717

<hr/>

### `setTime(time)`

This will set how long the builder should listen for emotes. Make sure to set your time as milliseconds.

<hr/>

### `addTime(time)`

Use after the embed has been built. Will increase the amount of time the collector is active before it stops.

<hr/>

### `resetTimer(time?)`

Resets the timer to either the time already set, or a new time given.

<hr/>

### `addTimeOnPage(time)`

Whenever the builder changes it's page, it will add specified amount of time (ms) to the current running timer.

<hr/>

### `resetTimerOnPage()`

Whenever the builder changes it's page, it will reset the timer to the current set time.

<hr/>

### `addEmoji(emoji, (sent, page, builder, emoji))`

This will insert the provided emoji into the builder, and when it is clicked it will perform the action that is provided.

```javascript
builder.addEmoji('❗', (sent, page, emoji) => {
    sent.delete();
    builder.cancel();
    sent.channel.send(`A new message${emoji}\nThe page you were on before was ${page}`);
});
```

<hr/>

### `addEmojis(emojis)`

Add multiple emojis to do different actions.

```javascript
builder.addEmojis([{
    '❗': (sent, page, emoji) => {
        builder.cancel();
        sent.delete();
        sent.channel.send(`A new message${emoji}\nThe page you were on before was ${page}`);
    },
}]);
```

<hr/>

### `deleteEmoji(emoji)`

Deletes an emoji from the list of emojis.

<hr/>

### `cancel(callback?)`

Cancels the builder before the timer ends.

If a callback is provided, it will execute after the builder has canceled.

<hr/>

### `showPageNumber(use)`

If set to true (by default it is true), it will show the current page on the footer of the embed. (Page x/y)

<hr/>

### `setPageFormat(format)`

If showing page numbers, this is the format that will be used.

By default format is %p/%m which converts to current/max.

<hr/>

### `calculatePages(data, dataPerPage, insert)`

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

<hr/>

### `calculatePagesAsync(data, dataPerPage, insert)`

Async version of calculatePages

Makes the page calculator wait for operations to finish.
```javascript
await embedBuilder.calculatePagesAsync(users.length, 10, async (embed, i) => {
    const user = await getSomeUser(users[i]);
    embed.addField(user.username, user.points, true);
});
```

<hr/>

### `updatePage(page)`

Updates the current page to the one set there. This checks if the page is valid itself. Make sure the first page of the builder has already gone through before using this.

<hr/>

### `setPageEmoji(emoji, newEmoji)`

Replaces current type of emoji given with the new emoji provided.

Types allowed: back, first, stop, last, next

<hr/>

### `awaitPageUpdate(user, options)`

[options](http://github.muricans.xyz/embedbuilder/interfaces/PageUpdateOptions.html)

Create an updater to await responses from a user,
then set the builders current page to the page given.

<hr/>

### `defaultReactions(reactions)`

The reactions the bot will use. If this  method is not used in the builder, the bot will automatically add all reactions.

```javascript
/*
* This builder will only use the stop and back emojis. 
* Using this also allows you to rearrange the order in which the bot will react with the emojis.
*/
embedBuilder.defaultReactions(['stop', 'back']);
```

<hr/>

## Events
### [`create`](http://github.muricans.xyz/embedbuilder/classes/PageEmbedBuilder.html#create)

Emitted from build() when the first page has finished building.

### [`stop`](http://github.muricans.xyz/embedbuilder/classes/PageEmbedBuilder.html#stop)

Emitted from build() when the timer has run out, or the collector is canceled in any way.

### [`pageUpdate`](http://github.muricans.xyz/embedbuilder/classes/PageEmbedBuilder.html#pageupdate)

Emitted from from build() when the builder has changed pages. Sets the new page for the bot.

### [`preSend`](http://github.muricans.xyz/embedbuilder/classes/PageEmbedBuilder.html#presend)

Emitted from build() before the first embed page has been sent in Discord.

## PageUpdater
PageUpdater documentation can be found [here](http://github.muricans.xyz/embedbuilder/classes/PageUpdater.html).

## Example
First import discord-embedbuilder into your project.

```javascript
const {
    PageEmbedBuilder,
 } = require('discord-embedbuilder');
```

Create a command or some way to get a channel to pass through the builder. If you are unsure on how to make a command, checking [this](https://discordjs.guide/) out might be helpful.

Next make your PageEmbedBuilder.

```javascript
client.on('message', message => {
    const builder = new PageEmbedBuilder()
        .setChannel(message.channel)
        .setTime(60000); // Time is in milliseconds
    const myEmbedArray = [
        new Discord.EmbedBuilder().addFields({name:'1st', value:'page'}),
        new Discord.EmbedBuilder().addFields({name:'2nd', value:'page'}), 
        new Discord.EmbedBuilder().addFields({name:'3rd', value:'page'}),
    ];
    builder
        .setEmbeds(myEmbedArray)
        .setTitle('This title stays the same on all pages!')
        .build(); // No need to send a message, building it will automatically do it.
});
```

Here's an example taken from my bot [rolesbot](https://github.com/muricans/rolesbot/)

```javascript
const rolebot = require('../rolebot');
const fs = require('fs');
const {
    PageEmbedBuilder,
} = require('discord-embedbuilder');

module.exports = {
    name: 'list',
    description: 'Refreshes and lists all currently active role react messages.',
    permissions: ['MANAGE_GUILD'],
    async execute(message) {
        rolebot.refreshActiveMessagesFor(message.guild.id);
        const messages = JSON.parse(fs.readFileSync('./messages.json', 'utf-8'));
        const list = messages.ids.filter(v => v.guildId === message.guild.id);
        if (list.length > 0) {
            const builder = new PageEmbedBuilder(message.channel);
            const guild = await message.guild.fetch();
            builder.calculatePages(list.length, 8, async (embed, i) => {
                    const channelName = guild.channels.cache.get(list[i].channelId);
                    const roleName = guild.roles.cache.get(list[i].roleId);
                    embed.addField("Message ID", list[i].messageId, true);
                    embed.addField("Channel", `${channelName}`, true);
                    embed.addField("Role", `${roleName}`, true);
                })
                .setTitle("List of All Active Messages")
                .build();
        } else {
            message.channel.send(`${message.author} No messages are currently registered in this guild!`);
        }
    },
};
```
