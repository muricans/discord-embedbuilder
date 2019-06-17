"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const events_1 = require("events");
const pageupdater_1 = require("./reaction/pageupdater");
/**
 * EmbedBuilder class
 * @noInheritDoc
 */
class EmbedBuilder extends events_1.EventEmitter {
    /**
    * Builds an embed with a number of pages based on how many are in the MessageEmbed array given.
    * ```javascript
    * const myEmbeds = [new Discord.MessageEmbed().addField('This is', 'a field!'),
    *  new Discord.MessageEmbed().addField('This is', 'another field!')];
    * embedBuilder
    *  .setChannel(message.channel)
    *  .setTime(30000)
    *  .setEmbeds(myEmbeds)
    *  .build();
    * // returns -> an embed with 2 pages that will listen for reactions for a total of 30 seconds. embed will be sent to channel specified.
    * ```
    */
    constructor(channel) {
        super();
        this.embeds = [];
        this.hasColor = false;
        this.emojis = [];
        this.usingPages = true;
        this.time = 60000;
        this.usingPageNumber = true;
        this.pageFormat = '%p/%m';
        this.channel = channel;
    }
    /**
     * This calculates pages for the builder to work with.
     * ```javascript
     * // This will generate a builder with a data length set to an array
     * // It will have 10 fields per page, which will all be inline, containing username and points data.
     * embedBuilder.calculatePages(users.length, 10, (embed, i) => {
     *  embed.addField(users[i].username, users[i].points, true);
     * });
     * ```
     *
     * @param data This is amount of data to process.
     * @param dataPerPage This is how much data you want displayed per page.
     * @param insert Gives you an embed and the current index.
     */
    calculatePages(data, dataPerPage, insert) {
        return new Promise((resolve, reject) => {
            let multiplier = 1;
            for (let i = 0; i < dataPerPage * multiplier; i++) {
                if (i === data) {
                    resolve(this);
                    break;
                }
                if (!this.embeds[multiplier - 1])
                    this.embeds.push(new discord_js_1.MessageEmbed());
                insert(this.embeds[multiplier - 1], i);
                if (i === (dataPerPage * multiplier) - 1)
                    multiplier++;
            }
        });
    }
    /**
     *
     * @param use Use the page system for the embed.
     */
    usePages(use) {
        this.usingPages = use;
        return this;
    }
    /**
     * Sets the current embeds page to the one provided.
     * Do not use this unless the first page has initialized already.
     *
     * @param page The page to update the embed to.
     * @emits pageUpdate
     */
    updatePage(page) {
        this.emit('pageUpdate', page);
        return this;
    }
    /**
     *
     * @param format The format that the footer will use to display page number (if enabled).
     * ```javascript
     * // %p = current page
     * // %m = the amount of pages there are
     * embedBuilder.setPageFormat('Page (%p/%m)');
     * // -> Page (1/3)
     * ```
     */
    setPageFormat(format) {
        this.pageFormat = format;
        return this;
    }
    /**
     * **<span style="color:red">Warning:</span>** This should not be used to set the channel. You can set that in the constructor
     *
     * @param channel The channel to switch the current one to.
     */
    changeChannel(channel) {
        this.channel = channel;
        return this;
    }
    /**
     * Adds the embeds given to the end of the current embeds array.
     *
     * @param embeds The embeds given here will be put at the end of the current embed array.
     */
    concatEmbeds(embeds) {
        this.embeds.concat(embeds);
        return this;
    }
    /**
     *
     * @param embeds The array of embeds to use.
     */
    setEmbeds(embeds) {
        this.embeds = embeds;
        return this;
    }
    /**
     *
     * @param time The amount of time the bot will allow reactions for.
     */
    setTime(time) {
        this.time = time;
        return this;
    }
    /**
     *
     * @param embed The embed to push to the array of embeds.
     */
    addEmbed(embed) {
        this.embeds.push(embed);
        return this;
    }
    /**
     * @returns {MessageEmbed[]} The current embeds that this builder has.
     * @deprecated Use [[EmbedBuilder.embeds]] instead.
     */
    getEmbeds() {
        process.emitWarning('#getEmbeds() is deprecated. Use #embeds instead.', 'DeprecationWarning');
        return this.embeds;
    }
    setTitle(title) {
        this._all((i) => {
            this.embeds[i].setTitle(title);
        });
        return this;
    }
    setFooter(text, icon) {
        this._all((i) => {
            this.embeds[i].setFooter(text, icon);
        });
        return this;
    }
    setDescription(description) {
        this._all(i => {
            this.embeds[i].setDescription(description);
        });
        return this;
    }
    setImage(url) {
        this._all(i => {
            this.embeds[i].setImage(url);
        });
        return this;
    }
    setThumbnail(url) {
        this._all(i => {
            this.embeds[i].setThumbnail(url);
        });
        return this;
    }
    addBlankField(inline) {
        this._all(i => {
            this.embeds[i].addBlankField(inline);
        });
        return this;
    }
    spliceField(index, deleteCount, name, value, inline) {
        this._all(i => {
            this.embeds[i].spliceField(index, deleteCount, name, value, inline);
        });
        return this;
    }
    attachFiles(file) {
        this._all(i => {
            this.embeds[i].attachFiles(file);
        });
        return this;
    }
    addField(name, value, inline) {
        this._all((i) => {
            this.embeds[i].addField(name, value, inline);
        });
        return this;
    }
    setURL(url) {
        this._all((i) => {
            this.embeds[i].setURL(url);
        });
        return this;
    }
    setAuthor(name, icon, url) {
        this._all((i) => {
            this.embeds[i].setAuthor(name, icon, url);
        });
        return this;
    }
    setTimestamp(timestamp) {
        this._all((i) => {
            this.embeds[i].setTimestamp(timestamp);
        });
        return this;
    }
    /**
     * @ignore
     */
    _all(index) {
        for (let i = 0; i < this.embeds.length; i++)
            index(i);
    }
    /**
     * Add an emoji which will perform it's own action when pressed.
     */
    addEmoji(unicodeEmoji, func) {
        this.emojis.push({
            emoji: unicodeEmoji,
            do: func,
        });
        return this;
    }
    /**
     * Deletes an emoji from the emoji list
     */
    deleteEmoji(unicodeEmoji) {
        const index = this.emojis.find(emoji => emoji.emoji === unicodeEmoji);
        if (!index)
            throw new Error('Emoji was undefined');
        this.emojis.splice(this.emojis.indexOf(index), 1);
        return this;
    }
    setColor(color) {
        this._all((i) => {
            this.embeds[i].setColor(color);
        });
        this.hasColor = true;
        return this;
    }
    /**
     * @ignore
     */
    _setColor(color) {
        this._all((i) => {
            this.embeds[i].setColor(color);
        });
        return this;
    }
    /**
     * Cancels the EmbedBuilder
     * @emits stop
     */
    cancel(callback) {
        if (this.collection) {
            this.collection.stop();
            if (callback)
                callback();
        }
        else
            throw new Error('The collection has not yet started');
        return this;
    }
    showPageNumber(use) {
        this.usingPageNumber = use;
        return this;
    }
    /**
     * ```javascript
     * builder.addEmojis({
     *  '❗': (sent, page, emoji) => {
     *      builder.cancel();
     *      sent.delete();
     *      sent.channel.send(`A new message ${emoji}\nThe page you were on before was ${page}`);
     *  }
     * });
     * ```
     *
     * @param emojis The emojis to push.
     */
    addEmojis(emojis) {
        const keys = Object.keys(emojis);
        const values = Object.values(emojis);
        for (let i = 0; i < keys.length; i++)
            this.addEmoji(keys[i], values[i]);
        return this;
    }
    /**
     * Replaces current type of emoji given with the new emoji provided.
     *
     * @param emoji The type of page emoji to replace. Types: back, first, stop, last, next.
     * @param newEmoji This emoji will replace the current page emoji for the given type.
     */
    setPageEmoji(emoji, newEmoji) {
        switch (emoji) {
            case "back":
                this.back = newEmoji;
                break;
            case "first":
                this.first = newEmoji;
                break;
            case "stop":
                this.stop = newEmoji;
                break;
            case "last":
                this.last = newEmoji;
                break;
            case "next":
                this.next = newEmoji;
                break;
            default:
                throw new Error('Unreconized emoji name. Use types: bacl, first, stop, last or next');
        }
        return this;
    }
    /**
     * Create an updater to await responses from a user,
     * then set the builders current page to the page given.
     *
     * @param user The user to accept a page update from.
     * @emits pageUpdate
     */
    awaitPageUpdate(user, options) {
        if (!this.channel)
            return;
        const update = new pageupdater_1.PageUpdater(this.channel, user, this.embeds, options).awaitPageUpdate();
        update.on('page', (page, c) => {
            this.emit('pageUpdate', page);
            c.stop();
        });
        update.on('cancel', c => {
            c.stop();
        });
        return this;
    }
    /**
     * Builds the embed.
     * @emits stop
     * @emits create
     * @listens pageUpdate
     */
    build() {
        return new Promise((resolve, reject) => {
            if (!this.channel || !this.embeds.length)
                return reject(new Error('A channel, and array of embeds is required.'));
            const back = this.back ? this.back : '◀';
            const first = this.first ? this.first : '⏪';
            const stop = this.stop ? this.stop : '⏹';
            const last = this.last ? this.last : '⏩';
            const next = this.next ? this.next : '▶';
            if (!this.hasColor)
                this._setColor(0x2872DB);
            let page = 0;
            if (this.usingPageNumber)
                for (let i = 0; i < this.embeds.length; i++)
                    this.embeds[i].setFooter(this.pageFormat
                        .replace('%p', (i + 1).toString())
                        .replace('%m', this.embeds.length.toString()));
            this.channel.send(this.embeds[page]).then((sent) => __awaiter(this, void 0, void 0, function* () {
                if (sent instanceof Array)
                    return reject(new Error('Got multiple messages instead of one.'));
                let author;
                if (sent.author)
                    author = sent.author;
                else
                    throw new Error('Author was not a user!');
                if (this.usingPages && this.embeds.length > 1) {
                    yield sent.react(back);
                    yield sent.react(first);
                    yield sent.react(stop);
                    yield sent.react(last);
                    yield sent.react(next);
                }
                if (this.emojis.length) {
                    for (let i = 0; i < this.emojis.length; i++) {
                        yield sent.react(this.emojis[i].emoji);
                    }
                }
                this.emit('create', sent, sent.reactions);
                const collection = sent.createReactionCollector((reaction, user) => user.id !== author.id, {
                    time: this.time,
                }).on('end', () => {
                    if (!this.hasColor)
                        sent.edit(this.embeds[page].setColor(0xE21717));
                    this.emit('stop', sent, page, collection);
                });
                collection.on('collect', (reaction, user) => {
                    reaction.users.remove(user);
                    if (this.usingPages && this.embeds.length > 1) {
                        switch (reaction.emoji.name) {
                            case first:
                                page = 0;
                                break;
                            case back:
                                if (page === 0)
                                    return;
                                page--;
                                break;
                            case stop:
                                collection.stop();
                                break;
                            case next:
                                if (page === this.embeds.length - 1)
                                    return;
                                page++;
                                break;
                            case last:
                                page = this.embeds.length - 1;
                                break;
                        }
                    }
                    for (let i = 0; i < this.emojis.length; i++) {
                        if (reaction.emoji.name === this.emojis[i].emoji)
                            return this.emojis[i].do(sent, page, this.emojis[i].emoji);
                    }
                    sent.edit(this.embeds[page]);
                });
                this.on('pageUpdate', (newPage) => {
                    newPage = newPage - 1;
                    if (collection.ended)
                        return;
                    else if (newPage > this.embeds.length - 1)
                        return;
                    else if (newPage < 0)
                        return;
                    else {
                        page = newPage;
                        sent.edit(this.embeds[newPage]);
                    }
                });
                this.collection = collection;
                return resolve(this);
            }));
        });
    }
}
exports.EmbedBuilder = EmbedBuilder;
(function (EmbedBuilder) {
})(EmbedBuilder = exports.EmbedBuilder || (exports.EmbedBuilder = {}));
