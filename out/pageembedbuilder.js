"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageEmbedBuilder = void 0;
const discord_js_1 = require("discord.js");
const events_1 = require("events");
const pageupdater_1 = require("./reaction/pageupdater");
/**
 * @noInheritDoc
 */
class PageEmbedBuilder extends events_1.EventEmitter {
    /**
    * Builds an embed with a number of pages based on how many are in the EmbedBuilder array given.
    */
    constructor(channel) {
        super();
        /**
         * All embeds in the builder.
         */
        this.embeds = [];
        this.hasColor = false;
        this.endColor = 0xE21717;
        this.emojis = [];
        this.usingPages = true;
        this.time = 60000;
        this.enabledReactions = ['first', 'back', 'stop', 'next', 'last'];
        this.back = '◀';
        this.next = '▶';
        this.stop = '⏹';
        this.first = '⏪';
        this.last = '⏩';
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
     *  embed.addFields({name: users[i].username, value: users[i].points, inline: true});
     * });
     * ```
     *
     * @param data This is the amount of data to process.
     * @param dataPerPage This is how much data you want displayed per page.
     * @param insert Gives you an embed and the current index.
     */
    calculatePages(data, dataPerPage, insert) {
        let page = 1;
        for (let i = 0; i < dataPerPage * page; i++) {
            // count equals data amount, break loop
            if (i === data)
                break;
            // check if an embed doesn't exist for page
            if (!this.embeds[page - 1])
                this.embeds.push(new discord_js_1.EmbedBuilder());
            insert(this.embeds[page - 1], i);
            // reached maximum amount per page, create new page
            if (i === (dataPerPage * page) - 1)
                page++;
        }
        return this;
    }
    /**
    * Async version of calculatePages
    *
    * Makes the page calculator wait for operations to finish.
    * ```javascript
    * await embedBuilder.calculatePagesAsync(users.length, 10, async (embed, i) => {
    *  const user = await getSomeUser(users[i]);
    *  embed.addFields({name: users.username, value: users.points, inline: true});
    * });
    * ```
    *
    * @param data This is the amount of data to process.
    * @param dataPerPage This is how much data you want displayed per page.
    * @param insert Gives you an embed and the current index.
    */
    calculatePagesAsync(data, dataPerPage, insert) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = 1;
            for (let i = 0; i < dataPerPage * page; i++) {
                if (i === data)
                    break;
                if (!this.embeds[page - 1])
                    this.embeds.push(new discord_js_1.EmbedBuilder());
                yield insert(this.embeds[page - 1], i);
                if (i == (dataPerPage * page) - 1)
                    page++;
            }
            return this;
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
        this.embeds = this.embeds.concat(embeds);
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
     * @param time The amount of time the bot will allow reactions for. (ms)
     */
    setTime(time) {
        this.time = time;
        return this;
    }
    /**
     * Use after embed has already been built to add time to the current collector.
     * @param time Time to add to current amount of time. (ms)
     */
    addTime(time) {
        let notReady = false;
        if (this.date) {
            this.time += time;
            const currentTime = (this.time + this.date) - Date.now();
            if (this.timer && currentTime > 0 && this.stopFunc !== undefined) {
                // build has already been called, everything is set, no undefined.
                // clear current timer
                clearTimeout(this.timer);
                // set new timer with the added amount of time
                this.timer = setTimeout(this.stopFunc, currentTime);
            }
            else
                notReady = true;
        }
        else
            notReady = true;
        if (notReady)
            throw new Error('Builder was not ready to add time! Date, timer, and stopFunc must be defined by the builder.');
        return this;
    }
    /**
     * Resets the timer to either the time already set, or a new time given.
     * @param time New time to set (ms)
     */
    resetTimer(time) {
        let notReady = false;
        if (this.timer && this.stopFunc !== undefined) {
            // build has already been called, no undefined
            // clear old timer
            clearTimeout(this.timer);
            // resetting timer, so reset the date as well.
            this.date = Date.now();
            // set new timer with updated specified time, or already set time.
            this.timer = setTimeout(this.stopFunc, time || this.time);
        }
        else
            notReady = true;
        if (notReady)
            throw new Error('Builder was not ready to add time! Date, timer, and stopFunc must be defined by the builder.');
        return this;
    }
    /**
     * Whenever the builder changes it's page, it will add specified amount of time (ms) to the current running timer.
     * @param timeToAdd Time to add to current amount of time. (ms)
     */
    addTimeOnPage(timeToAdd) {
        this.on('pageUpdate', () => {
            this.addTime(timeToAdd);
        });
        return this;
    }
    /**
     * Whenever the builder changes it's page, it will reset the timer to the current set time.
     */
    resetTimerOnPage(time) {
        this.on('pageUpdate', () => {
            this.resetTimer(time);
        });
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
    setTitle(title) {
        this._all((i) => {
            this.embeds[i].setTitle(title);
        });
        return this;
    }
    setFooter(text, icon) {
        this._all((i) => {
            this.embeds[i].setFooter({
                text: text, iconURL: icon
            });
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
    spliceFields(index, deleteCount, field) {
        this._all(i => {
            if (!field)
                this.embeds[i].spliceFields(index, deleteCount);
            else
                this.embeds[i].spliceFields(index, deleteCount, field);
        });
        return this;
    }
    /**
     * Adds a single field to all embeds.
     * @param name Name of the field
     * @param value Value of the field
     * @param inline Inline?
     */
    addField(name, value, inline) {
        this._all((i) => {
            this.embeds[i].addFields({
                name: name,
                value: value,
                inline: inline
            });
        });
        return this;
    }
    /**
     * Adds multiple fields to all embeds.
     * @param fields An array of APIEmbedField
     */
    addFields(fields) {
        this._all((i) => {
            this.embeds[i].addFields(fields);
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
            this.embeds[i].setAuthor({
                name: name,
                iconURL: icon,
                url: url
            });
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
     * When the collection has ended, and no other custom color is being used, this will be the color the embed is set to. Default is 0xE21717
     * @param color Any color resolvable
     */
    setEndColor(color) {
        this.endColor = color;
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
     * Cancels the builder
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
     *
     * @param reactions The reactions the bot will use. If this  method is not used in the builder, the bot will automatically add all reactions.
     * Any reactions left out will not be used.
     */
    defaultReactions(reactions) {
        this.enabledReactions = reactions;
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
                throw new Error('Unreconized emoji name. Use types: back, first, stop, last or next');
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
            throw new Error('A channel is required.');
        const update = new pageupdater_1.PageUpdater(this, user, options).awaitPageUpdate();
        update.on('page', (page, a, c, m) => {
            var _a;
            if (!((_a = this.collection) === null || _a === void 0 ? void 0 : _a.ended)) {
                this.emit('pageUpdate', page);
                this.channel.send(m);
            }
            if (options === null || options === void 0 ? void 0 : options.singleListen)
                c.stop();
        });
        update.on('cancel', (c, r, m) => {
            var _a;
            if (!((_a = this.collection) === null || _a === void 0 ? void 0 : _a.ended))
                this.channel.send(m);
            c.stop();
        });
        update.on('invalid', (c, r, m) => {
            var _a;
            if (!((_a = this.collection) === null || _a === void 0 ? void 0 : _a.ended))
                this.channel.send(m);
        });
        return this;
    }
    /**
     * @ignore
     */
    _checkReactionEmojis(reactions) {
        const defaultReactionEmojis = ['first', 'back', 'stop', 'next', 'last'];
        if (this.enabledReactions != defaultReactionEmojis) {
            defaultReactionEmojis.forEach(r => {
                if (!this.enabledReactions.find(v => v === r))
                    reactions.set(r, false);
                else
                    reactions.set(r, true);
            });
        }
    }
    /**
     * @ignore
     */
    _handleReactionCollection(collection, sent, page) {
        collection.on('end', () => {
            sent.edit({ embeds: [this.embeds[page].setColor(this.endColor)] });
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = undefined;
            }
            this.emit('stop', sent, page, collection);
        })
            .on('collect', (reaction, user) => {
            reaction.users.remove(user);
            if (this.usingPages && this.embeds.length > 1) {
                switch (reaction.emoji.name) {
                    case this.first:
                        page = 0;
                        break;
                    case this.back:
                        if (page === 0)
                            return;
                        page--;
                        break;
                    case this.stop:
                        collection.stop();
                        break;
                    case this.next:
                        if (page === this.embeds.length - 1)
                            return;
                        page++;
                        break;
                    case this.last:
                        page = this.embeds.length - 1;
                        break;
                }
                if (reaction.emoji.name !== this.stop)
                    this.emit('pageUpdate', page);
            }
            // Do custom emoji action
            if (this.emojis.length > 0) {
                const customEmoji = this.emojis.find(e => e.emoji === reaction.emoji.name || e.emoji === reaction.emoji.id);
                if (customEmoji)
                    customEmoji.do(sent, page, customEmoji.emoji);
            }
        });
        this.on('pageUpdate', (newPage) => {
            if (collection.ended || newPage > this.embeds.length - 1 || newPage < 0)
                return;
            else {
                // set page to specified in case it's not from reaction.
                page = newPage;
                sent.edit({ embeds: [this.embeds[newPage]] });
            }
        });
    }
    /**
     * @ignore
     */
    _handleTimer(collection, sent, page) {
        this.collection = collection;
        this.stopFunc = () => {
            var _a;
            (_a = this.collection) === null || _a === void 0 ? void 0 : _a.stop();
            this.emit('stop', sent, page, collection);
        };
        this.date = Date.now();
        this.timer = setTimeout(this.stopFunc, this.time);
    }
    /**
     * Builds the embed.
     * @emits stop
     * @emits create
     * @emits pageUpdate
     * @emits preSend
     * @listens pageUpdate
     */
    build() {
        return new Promise((resolve, reject) => {
            if (!this.channel || !this.embeds.length)
                return reject(new Error('A channel, and array of embeds is required.'));
            const reactions = new Map();
            this._checkReactionEmojis(reactions);
            if (!this.hasColor)
                this._setColor(0x2872DB);
            // Is embed using page footer
            if (this.usingPageNumber)
                for (const embed of this.embeds)
                    embed.setFooter({
                        text: this.pageFormat.replace('%p', (this.embeds.indexOf(embed) + 1)
                            .toString())
                            .replace('%m', this.embeds.length.toString())
                    });
            this.emit('preSend', reactions);
            this.channel.send({ embeds: [this.embeds[0]] }).then((sent) => __awaiter(this, void 0, void 0, function* () {
                if (sent instanceof Array)
                    return reject(new Error('Got multiple messages instead of one.'));
                let author;
                if (sent.author)
                    author = sent.author;
                else
                    return reject(new Error('Author was not a user!'));
                // Embed has multiple pages, set up emoji buttons
                if (this.usingPages && this.embeds.length > 1) {
                    reactions.forEach((e, r) => __awaiter(this, void 0, void 0, function* () {
                        if (e) {
                            let emojiResolvable;
                            switch (r) {
                                case 'first':
                                    emojiResolvable = this.first;
                                    break;
                                case 'next':
                                    emojiResolvable = this.next;
                                    break;
                                case 'stop':
                                    emojiResolvable = this.stop;
                                    break;
                                case 'back':
                                    emojiResolvable = this.back;
                                    break;
                                case 'last':
                                    emojiResolvable = this.last;
                                    break;
                                default:
                                    return reject(new Error("Could not parse emoji"));
                            }
                            yield sent.react(emojiResolvable);
                        }
                    }));
                }
                // React with custom emojis, if any were given.
                if (this.emojis.length) {
                    for (const emoji of this.emojis)
                        yield sent.react(emoji.emoji);
                }
                // Finished sending first page + reactions, emit create event.
                this.emit('create', sent, sent.reactions);
                // Set up collection event.
                //const page = 0;
                const collection = sent.createReactionCollector({ filter: (reaction, user) => user.id !== author.id });
                this._handleReactionCollection(collection, sent, 0);
                this._handleTimer(collection, sent, 0);
                return resolve(this);
            }));
        });
    }
}
exports.PageEmbedBuilder = PageEmbedBuilder;
/**
 * Emitted when the builder has stopped
 * @event
 */
//eslint-disable-next-line @typescript-eslint/no-empty-function
PageEmbedBuilder.stop = (sent, lastPage, collector) => { };
/**
 * Emitted when the builder is finished creating the first page.
 * @event
 */
//eslint-disable-next-line @typescript-eslint/no-empty-function
PageEmbedBuilder.create = (sent, reactions) => { };
/**
 * Emitted when the page for the builder has updated.
 * @event
 */
//eslint-disable-next-line @typescript-eslint/no-empty-function
PageEmbedBuilder.pageUpdate = (page) => { };
/**
 * Emitted before the first embed has been sent.
 * @event
 */
//eslint-disable-next-line @typescript-eslint/no-empty-function
PageEmbedBuilder.preSend = (reactions) => { };
