import {
    TextChannel,
    RichEmbed,
    Message,
    ColorResolvable,
    Collection,
} from "discord.js";

interface Emojis {
    emoji: string;
    do: (sent: Message, page: number, builder: EmbedBuilder, emoji: string) => void;
}

/**
 * Builds an embed with a number of pages based on how many are in the RichEmbed array given.
 * @example
 * const myEmbeds = [new Discord.RichEmbed().addField('This is', 'a field!'),
 *  new Discord.RichEmbed().addField('This is', 'another field!')];
 * embedBuilder
 *  .setChannel(message.channel)
 *  .setTime(30000)
 *  .setEmbeds(myEmbeds)
 *  .build();
 * // returns -> an embed with 2 pages that will listen for reactions for a total of 30 seconds. embed will be sent to channel specified.
 */
class EmbedBuilder {
    private embedArray: RichEmbed[] = [];
    private hasColor: boolean = false;
    private emojis: Emojis[] = [];
    private usingPages: boolean = true;
    private collection: Collection;
    private channel: TextChannel;
    private time: number;
    private back: string;
    private next: string;
    private stop: string;
    private first: string;
    private last: string;

    /**
     * 
     * @param use Use the page system for the embed.
     */
    usePages(use: boolean) {
        this.usingPages = use;
        return this;
    }

    /**
     * 
     * @param channel The channel the embed will be sent to.
     */
    setChannel(channel: TextChannel) {
        this.channel = channel;
        return this;
    }

    /**
     * 
     * @param embedArray The array of embeds to use.
     */
    setEmbeds(embedArray: RichEmbed[]) {
        this.embedArray = embedArray;
        return this;
    }

    /**
     * 
     * @param time The amount of time the bot will allow reactions for.
     */
    setTime(time: number) {
        this.time = time;
        return this;
    }

    /**
     * 
     * @param embed The embed to push to the array of embeds.
     */
    addEmbed(embed: RichEmbed) {
        this.embedArray.push(embed);
        return this;
    }

    /**
     * @returns {RichEmbed[]} The current embeds that this builder has.
     */
    getEmbeds() {
        return this.embedArray;
    }

    setTitle(title: string) {
        this._all((i: number) => {
            this.embedArray[i].setTitle(title);
        });
        return this;
    }

    setFooter(text: any, icon?: string) {
        this._all((i: number) => {
            this.embedArray[i].setFooter(text, icon);
        });
        return this;
    }

    addField(name: any, value: any, inline?: boolean) {
        this._all((i: number) => {
            this.embedArray[i].addField(name, value, inline);
        });
        return this;
    }

    setURL(url: string) {
        this._all((i: number) => {
            this.embedArray[i].setURL(url);
        });
        return this;
    }

    setAuthor(name: any, icon?: string, url?: string) {
        this._all((i: number) => {
            this.embedArray[i].setAuthor(name, icon, url);
        });
        return this;
    }

    setTimestamp(timestamp?: Date | number) {
        this._all((i: number) => {
            this.embedArray[i].setTimestamp(timestamp);
        });
        return this;
    }

    _all(index: (i: number) => void) {
        for (let i = 0; i < this.embedArray.length; i++)
            index(i);
    }

    /**
     * Set the emoji for going backwards.
     */
    setBackEmoji(unicodeEmoji: string) {
        this.back = unicodeEmoji;
        return this;
    }

    /**
     * Set the emoji for going forward.
     */
    setNextEmoji(unicodeEmoji: string) {
        this.next = unicodeEmoji;
        return this;
    }

    /**
     * Set the emoji to stop the embed from listening for reactions.
     */
    setStopEmoji(unicodeEmoji: string) {
        this.stop = unicodeEmoji;
        return this;
    }

    /**
     * Set the emoji to go to the first page.
     */
    setFirstEmoji(unicodeEmoji: string) {
        this.first = unicodeEmoji;
        return this;
    }

    /**
     * Set the emoji to go the the last page.
     */
    setLastEmoji(unicodeEmoji: string) {
        this.last = unicodeEmoji;
        return this;
    }

    /**
     * Add an emoji which will perform it's own action when pressed.
     */
    addEmoji(unicodeEmoji: string, func: (sent: Message, page: number, builder: EmbedBuilder, emoji: string) => void) {
        this.emojis.push({
            emoji: unicodeEmoji,
            do: func,
        });
        return this;

    }

    /**
     * Deletes an emoji from the emoji list
     */
    deleteEmoji(unicodeEmoji: string) {
        const index = this.emojis.find(emoji => emoji.emoji === unicodeEmoji);
        if (!index) throw new Error('Emoji was undefined');
        this.emojis.splice(this.emojis.indexOf(index), 1);
        return this;
    }

    setColor(color: ColorResolvable) {
        this._all((i) => {
            this.embedArray[i].setColor(color);
        });
        this.hasColor = true;
        return this;
    }

    _setColor(color: ColorResolvable) {
        this._all((i) => {
            this.embedArray[i].setColor(color);
        });
        return this;
    }

    /**
     * Cancel the EmbedBuilder
     */
    cancel(callback?: () => void) {
        this.collection.stop();
        if (callback)
            callback();
        return this;
    }

    /**
     * Builds the embed.
     */
    build() {
        if (!this.channel || !this.embedArray.length || !this.time) throw new Error('A channel, an array of embeds, and time is required!');
        const back = this.back ? this.back : '◀';
        const first = this.first ? this.first : '⏪';
        const stop = this.stop ? this.stop : '⏹';
        const last = this.last ? this.last : '⏩';
        const next = this.next ? this.next : '▶';
        if (!this.hasColor)
            this._setColor(0x2872DB);
        let page = 0;
        this.channel.send(this.embedArray[page]).then(async sent => {
            if (sent instanceof Array) throw new Error('Got multiple messages instead of one');
            if (this.usingPages && this.embedArray.length > 1) {
                await sent.react(back);
                await sent.react(first);
                await sent.react(stop);
                await sent.react(last);
                await sent.react(next);
            }
            if (this.emojis.length !== 0) {
                for (let i = 0; i < this.emojis.length; i++)
                    await sent.react(this.emojis[i].emoji);
            }
            const collection = sent.createReactionCollector((reaction, user) => user.id !== sent.author.id && reaction.remove(user), {
                time: this.time,
            }).on('end', () => {
                if (!this.hasColor)
                    sent.edit(this.embedArray[page].setColor(0xE21717));
            });
            collection.on('collect', reaction => {
                if (this.usingPages && this.embedArray.length > 1) {
                    switch (reaction.emoji.name) {
                        case first:
                            page = 0;
                            break;
                        case back:
                            if (page === 0) return;
                            page--;
                            break;
                        case stop:
                            collection.stop();
                            break;
                        case next:
                            if (page === this.embedArray.length - 1) return;
                            page++;
                            break;
                        case last:
                            page = this.embedArray.length - 1;
                            break;
                    }
                }
                for (let i = 0; i < this.emojis.length; i++) {
                    if (reaction.emoji.name === this.emojis[i].emoji)
                        return this.emojis[i].do(sent, page, this, this.emojis[i].emoji);
                }
                sent.edit(this.embedArray[page]);
            });
            this.collection = collection;
        });
    }
}

export = EmbedBuilder;