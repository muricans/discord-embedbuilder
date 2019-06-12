import { TextChannel, RichEmbed, Message, ColorResolvable } from "discord.js";
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
declare class EmbedBuilder {
    private embedArray;
    private hasColor;
    private emojis;
    private usingPages;
    private collection;
    private channel;
    private time;
    private back;
    private next;
    private stop;
    private first;
    private last;
    /**
     *
     * @param use Use the page system for the embed.
     */
    usePages(use: boolean): this;
    /**
     *
     * @param channel The channel the embed will be sent to.
     */
    setChannel(channel: TextChannel): this;
    /**
     *
     * @param embedArray The array of embeds to use.
     */
    setEmbeds(embedArray: RichEmbed[]): this;
    /**
     *
     * @param time The amount of time the bot will allow reactions for.
     */
    setTime(time: number): this;
    /**
     *
     * @param embed The embed to push to the array of embeds.
     */
    addEmbed(embed: RichEmbed): this;
    /**
     * @returns {RichEmbed[]} The current embeds that this builder has.
     */
    getEmbeds(): RichEmbed[];
    setTitle(title: string): this;
    setFooter(text: any, icon?: string): this;
    addField(name: any, value: any, inline?: boolean): this;
    setURL(url: string): this;
    setAuthor(name: any, icon?: string, url?: string): this;
    setTimestamp(timestamp?: Date | number): this;
    _all(index: (i: number) => void): void;
    /**
     * Set the emoji for going backwards.
     */
    setBackEmoji(unicodeEmoji: string): this;
    /**
     * Set the emoji for going forward.
     */
    setNextEmoji(unicodeEmoji: string): this;
    /**
     * Set the emoji to stop the embed from listening for reactions.
     */
    setStopEmoji(unicodeEmoji: string): this;
    /**
     * Set the emoji to go to the first page.
     */
    setFirstEmoji(unicodeEmoji: string): this;
    /**
     * Set the emoji to go the the last page.
     */
    setLastEmoji(unicodeEmoji: string): this;
    /**
     * Add an emoji which will perform it's own action when pressed.
     */
    addEmoji(unicodeEmoji: string, func: (sent: Message, page: number, builder: EmbedBuilder, emoji: string) => void): this;
    /**
     * Deletes an emoji from the emoji list
     */
    deleteEmoji(unicodeEmoji: string): this;
    setColor(color: ColorResolvable): this;
    _setColor(color: ColorResolvable): this;
    /**
     * Cancel the EmbedBuilder
     */
    cancel(callback: () => void): this;
    /**
     * Builds the embed.
     */
    build(): void;
}
export = EmbedBuilder;
