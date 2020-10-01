import {
    TextChannel,
    MessageEmbed,
    Message,
    ColorResolvable,
    ReactionCollector,
    FileOptions,
    DMChannel,
    Collection,
    MessageReaction,
    MessageAttachment,
    User,
    EmbedFieldData,
} from "discord.js";
import { EventEmitter } from "events";
import { PageUpdateOptions, PageUpdater } from './reaction/pageupdater';

/**
 * @private
 */
interface Emoji {
    emoji: string;
    do: (sent: Message, page: number, emoji: string) => void;
}

/**
 * @private
 */
interface Emojis {
    emoji: (sent: Message, page: number, emoji: string) => void;
}

/**
 * EmbedBuilder class
 * @noInheritDoc
 */
export class EmbedBuilder extends EventEmitter {
    /**
     * The channel being used with the EmbedBuilder.
     */
    public channel: TextChannel | DMChannel;
    /**
     * All embeds in the builder.
     */
    public embeds: MessageEmbed[] = [];

    private hasColor = false;
    private endColor: ColorResolvable = 0xE21717;

    private emojis: Emoji[] = [];
    private usingPages = true;
    private collection: ReactionCollector | undefined;

    private time = 60000;
    private timer?: NodeJS.Timeout;
    private date?: number;
    private stopFunc?: () => void;

    private enabledReactions = ['first', 'back', 'stop', 'next', 'last'];

    private back = '◀';
    private next = '▶';
    private stop = '⏹';
    private first = '⏪';
    private last = '⏩';

    private usingPageNumber = true;
    private pageFormat = '%p/%m';

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
    public constructor(channel: TextChannel | DMChannel) {
        super();
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
    public calculatePages(data: number, dataPerPage: number, insert: (embed: MessageEmbed, index: number) => void): this {
        let page = 1;
        for (let i = 0; i < dataPerPage * page; i++) {
            // count equals data amount, break loop
            if (i === data)
                break;
            // check if an embed doesn't exist for page
            if (!this.embeds[page - 1])
                this.embeds.push(new MessageEmbed());
            insert(this.embeds[page - 1], i);
            // reached maximum amount per page, create new page
            if (i === (dataPerPage * page) - 1)
                page++;
        }
        return this;
    }

    /**
     * 
     * @param use Use the page system for the embed.
     */
    public usePages(use: boolean): this {
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
    public updatePage(page: number): this {
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
    public setPageFormat(format: string): this {
        this.pageFormat = format;
        return this;
    }

    /**
     * **<span style="color:red">Warning:</span>** This should not be used to set the channel. You can set that in the constructor
     * 
     * @param channel The channel to switch the current one to.
     */
    public changeChannel(channel: TextChannel | DMChannel): this {
        this.channel = channel;
        return this;
    }

    /**
     * Adds the embeds given to the end of the current embeds array.
     * 
     * @param embeds The embeds given here will be put at the end of the current embed array.
     */
    public concatEmbeds(embeds: MessageEmbed[]): this {
        this.embeds = this.embeds.concat(embeds);
        return this;
    }

    /**
     * 
     * @param embeds The array of embeds to use.
     */
    public setEmbeds(embeds: MessageEmbed[]): this {
        this.embeds = embeds;
        return this;
    }

    /**
     * 
     * @param time The amount of time the bot will allow reactions for. (ms)
     */
    public setTime(time: number): this {
        this.time = time;
        return this;
    }

    /**
     * Use after embed has already been built to add time to the current collector.
     * @param time Time to add to current amount of time. (ms)
     */
    public addTime(time: number): this {
        let notReady = false;
        if (this.date) {
            this.time += time;
            const currentTime = (this.time + this.date) - Date.now();
            if (this.timer && currentTime > 0 && this.stopFunc !== undefined) {
                clearTimeout(this.timer);
                this.timer = setTimeout(this.stopFunc, currentTime);
            } else notReady = true;
        } else notReady = true;
        if (notReady) throw new Error('Builder was not ready to add time! Date, timer, and stopFunc must be defined by the builder.');
        return this;
    }

    /**
     * Resets the timer to either the time already set, or a new time given.
     * @param time New time to set (ms)
     */
    public resetTimer(time?: number): this {
        let notReady = false;
        if (this.timer && this.stopFunc !== undefined) {
            clearTimeout(this.timer);
            this.date = Date.now();
            this.timer = setTimeout(this.stopFunc, time || this.time);
        } else notReady = true;
        if (notReady) throw new Error('Builder was not ready to add time! Date, timer, and stopFunc must be defined by the builder.');
        return this;
    }

    /**
     * Whenever the builder changes it's page, it will add specified amount of time (ms) to the current running timer.
     * @param timeToAdd Time to add to current amount of time. (ms)
     */
    public addTimeOnPage(timeToAdd: number): this {
        this.on('pageUpdate', () => {
            this.addTime(timeToAdd);
        });
        return this;
    }

    /**
     * Whenever the builder changes it's page, it will reset the timer to the current set time.
     */
    public resetTimerOnPage(): this {
        this.on('pageUpdate', () => {
            this.resetTimer();
        });
        return this;
    }

    /**
     * 
     * @param embed The embed to push to the array of embeds.
     */
    public addEmbed(embed: MessageEmbed): this {
        this.embeds.push(embed);
        return this;
    }

    /**
     * @returns {MessageEmbed[]} The current embeds that this builder has.
     * @deprecated Use [[EmbedBuilder.embeds]] instead.
     */
    public getEmbeds(): MessageEmbed[] {
        process.emitWarning('#getEmbeds() is deprecated. Use #embeds instead.', 'DeprecationWarning');
        return this.embeds;
    }

    public setTitle(title: string): this {
        this._all((i) => {
            this.embeds[i].setTitle(title);
        });
        return this;
    }

    public setFooter(text: any, icon?: string): this {
        this._all((i) => {
            this.embeds[i].setFooter(text, icon);
        });
        return this;
    }

    public setDescription(description: any): this {
        this._all(i => {
            this.embeds[i].setDescription(description);
        });
        return this;
    }

    public setImage(url: string): this {
        this._all(i => {
            this.embeds[i].setImage(url);
        });
        return this;
    }

    public setThumbnail(url: string): this {
        this._all(i => {
            this.embeds[i].setThumbnail(url);
        });
        return this;
    }

    public spliceFields(index: number, deleteCount: number, fields?: EmbedFieldData[]): this {
        this._all(i => {
            if (!fields)
                this.embeds[i].spliceFields(index, deleteCount);
            else
                this.embeds[i].spliceFields(index, deleteCount, fields);
        });
        return this;
    }

    public attachFiles(file: (string | MessageAttachment | FileOptions)[]): this {
        this._all(i => {
            this.embeds[i].attachFiles(file);
        });
        return this;
    }

    /**
     * Adds a single field to all embeds.
     * @param name Name of the field
     * @param value Value of the field
     * @param inline Inline?
     */
    public addField(name: any, value: any, inline?: boolean): this {
        this._all((i) => {
            this.embeds[i].addField(name, value, inline);
        });
        return this;
    }

    /**
     * Adds multiple fields to all embeds.
     * @param fields An array of EmbedFieldData
     */
    public addFields(fields: EmbedFieldData[]): this {
        this._all((i) => {
            this.embeds[i].addFields(fields);
        });
        return this;
    }

    public setURL(url: string): this {
        this._all((i) => {
            this.embeds[i].setURL(url);
        });
        return this;
    }

    public setAuthor(name: any, icon?: string, url?: string): this {
        this._all((i) => {
            this.embeds[i].setAuthor(name, icon, url);
        });
        return this;
    }

    public setTimestamp(timestamp?: Date | number): this {
        this._all((i) => {
            this.embeds[i].setTimestamp(timestamp);
        });
        return this;
    }

    /**
     * @ignore
     */
    private _all(index: (i: number) => void) {
        for (let i = 0; i < this.embeds.length; i++)
            index(i);
    }

    /**
     * Add an emoji which will perform it's own action when pressed.
     */
    public addEmoji(unicodeEmoji: string, func: (sent: Message, page: number, emoji: string) => void): this {
        this.emojis.push({
            emoji: unicodeEmoji,
            do: func,
        });
        return this;
    }

    /**
     * Deletes an emoji from the emoji list
     */
    public deleteEmoji(unicodeEmoji: string): this {
        const index = this.emojis.find(emoji => emoji.emoji === unicodeEmoji);
        if (!index) throw new Error('Emoji was undefined');
        this.emojis.splice(this.emojis.indexOf(index), 1);
        return this;
    }

    public setColor(color: ColorResolvable): this {
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
    public setEndColor(color: ColorResolvable): this {
        this.endColor = color;
        return this;
    }

    /**
     * @ignore
     */
    private _setColor(color: ColorResolvable): this {
        this._all((i) => {
            this.embeds[i].setColor(color);
        });
        return this;
    }

    /**
     * Cancels the EmbedBuilder
     * @emits stop
     */
    public cancel(callback?: () => void): this {
        if (this.collection) {
            this.collection.stop();
            if (callback)
                callback();
        } else
            throw new Error('The collection has not yet started');
        return this;
    }

    public showPageNumber(use: boolean): this {
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
    public addEmojis(emojis: Emojis): this {
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
    public defaultReactions(reactions: []): this {
        this.enabledReactions = reactions;
        return this;
    }

    /**
     * Replaces current type of emoji given with the new emoji provided.
     * 
     * @param emoji The type of page emoji to replace. Types: back, first, stop, last, next.
     * @param newEmoji This emoji will replace the current page emoji for the given type.
     */
    public setPageEmoji(emoji: string, newEmoji: string): this {
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
    awaitPageUpdate(user: User, options?: PageUpdateOptions): this {
        if (!this.channel) throw new Error('A channel is required.');
        const update = new PageUpdater(this.channel, user, this.embeds, options).awaitPageUpdate();
        update.on('page', (page, a, c, m) => {
            if (!this.collection?.ended) {
                this.emit('pageUpdate', page);
                this.channel.send(m);
            }
            if (options?.singleListen)
                c.stop();
        });
        update.on('cancel', (c, r, m) => {
            if (!this.collection?.ended)
                this.channel.send(m);
            c.stop();
        });
        update.on('invalid', (c, r, m) => {
            if (!this.collection?.ended)
                this.channel.send(m);
        });
        return this;
    }

    /**
     * Builds the embed.
     * @emits stop
     * @emits create
     * @emits pageUpdate
     * @emits preSend
     * @listens pageUpdate
     */
    public build(): Promise<this> {
        return new Promise((resolve, reject) => {
            if (!this.channel || !this.embeds.length) return reject(new Error('A channel, and array of embeds is required.'));

            const reactions = new Map<string, boolean>();
            const defaultReactionEmojis = ['first', 'back', 'stop', 'next', 'last'];
            if (this.enabledReactions != defaultReactionEmojis) {
                defaultReactionEmojis.forEach(r => {
                    if (!this.enabledReactions.find(v => v === r)) reactions.set(r, false);
                    else reactions.set(r, true);
                });
            }

            if (!this.hasColor)
                this._setColor(0x2872DB);
            // Is embed using page footer
            if (this.usingPageNumber)
                for (const embed of this.embeds)
                    embed.setFooter(this.pageFormat
                        .replace('%p', (this.embeds.indexOf(embed) + 1).toString())
                        .replace('%m', this.embeds.length.toString())
                    );
            this.emit('preSend', reactions);
            this.channel.send(this.embeds[0]).then(async sent => {
                if (sent instanceof Array) return reject(new Error('Got multiple messages instead of one.'));
                let author: User;
                if (sent.author)
                    author = sent.author;
                else
                    return reject(new Error('Author was not a user!'));
                // Embed has multiple pages, set up emoji buttons
                if (this.usingPages && this.embeds.length > 1) {
                    reactions.forEach(async (e, r) => {
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
                            await sent.react(emojiResolvable);
                        }
                    });
                }
                // React with custom emojis, if any were given.
                if (this.emojis.length) {
                    for (const emoji of this.emojis)
                        await sent.react(emoji.emoji);
                }
                // Finished sending first page + reactions, emit create event.
                this.emit('create', sent, sent.reactions);
                // Set up collection event.
                let page = 0;
                const collection = sent.createReactionCollector((reaction, user) => user.id !== author.id)
                    .on('end', () => {
                        sent.edit(this.embeds[page].setColor(this.endColor));
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
                                    if (page === 0) return;
                                    page--;
                                    break;
                                case this.stop:
                                    collection.stop();
                                    break;
                                case this.next:
                                    if (page === this.embeds.length - 1) return;
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
                        page = newPage;
                        sent.edit(this.embeds[newPage]);
                    }
                });

                this.collection = collection;
                this.stopFunc = () => {
                    this.collection?.stop();
                    this.emit('stop', sent, page, collection);
                };
                this.date = Date.now();
                this.timer = setTimeout(this.stopFunc, this.time);

                return resolve(this);
            });
        });
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace EmbedBuilder {
    /**
     * Emitted when the builder has stopped.
     * @event stop
     */
    declare function stop(sent: Message, lastPage: number, collector: ReactionCollector): void;
    /**
     * Emitted when the builder is finished creating the first page.
     * @event create
     */
    declare function create(sent: Message, reactions: Collection<string, MessageReaction>): void;
    /**
     * Emitted when the page for the builder has updated.
     * @event pageUpdate
     */
    declare function pageUpdate(page: number): void;
    /**
     * Emitted before the first embed has been sent.
     * @event preSend
     */
    declare function preSend(reactions: Map<string, boolean>): void;
}
