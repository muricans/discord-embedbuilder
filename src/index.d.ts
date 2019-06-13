import { TextChannel, MessageEmbed, Message, ColorResolvable, FileOptions, DMChannel, MessageAttachment } from "discord.js";
import { EventEmitter } from "events";
/**
 * @private
 * @ignore
 */
interface Emoji {
    emoji: string;
    do: (sent: Message, page: number, emoji: string) => void;
}
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
 * @noInheritDoc
 */
declare class EmbedBuilder extends EventEmitter {
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
    private usingPageNumber;
    private pageFormat;
    constructor(channel?: TextChannel | DMChannel);
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
    calculatePages(data: number, dataPerPage: number, insert: (embed: MessageEmbed, index: number) => void): this;
    /**
     *
     * @param use Use the page system for the embed.
     */
    usePages(use: boolean): this;
    /**
     * Sets the current embeds page to the one provided.
     * Do not use this unless the first page has initialized already.
     *
     * @param page The page to update the embed to.
     * @emits pageUpdate
     */
    updatePage(page: number): this;
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
    setPageFormat(format: string): this;
    /**
     * @deprecated Use constructor to set the channel instead. Will be removed on update 3.0.0
     * @param channel The channel the embed will be sent to.
     */
    setChannel(channel: TextChannel | DMChannel): this;
    /**
     * Adds the embeds given to the end of the current embeds array.
     *
     * @param embedArray The embeds given here will be put at the end of the current embed array.
     */
    concatEmbeds(embedArray: MessageEmbed[]): this;
    /**
     *
     * @param embedArray The array of embeds to use.
     */
    setEmbeds(embedArray: MessageEmbed[]): this;
    /**
     *
     * @param time The amount of time the bot will allow reactions for.
     */
    setTime(time: number): this;
    /**
     *
     * @param embed The embed to push to the array of embeds.
     */
    addEmbed(embed: MessageEmbed): this;
    /**
     * @returns {MessageEmbed[]} The current embeds that this builder has.
     */
    getEmbeds(): MessageEmbed[];
    setTitle(title: string): this;
    setFooter(text: any, icon?: string): this;
    setDescription(description: any): this;
    setImage(url: string): this;
    setThumbnail(url: string): this;
    addBlankField(inline?: boolean): this;
    spliceField(index: number, deleteCount: number, name?: any, value?: any, inline?: boolean): this;
    attachFiles(files: string[] | MessageAttachment[] | FileOptions[]): this;
    addField(name: any, value: any, inline?: boolean): this;
    setURL(url: string): this;
    setAuthor(name: any, icon?: string, url?: string): this;
    setTimestamp(timestamp?: Date | number): this;
    private _all;
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
    addEmoji(unicodeEmoji: string, func: (sent: Message, page: number, emoji: string) => void): this;
    /**
     * Deletes an emoji from the emoji list
     */
    deleteEmoji(unicodeEmoji: string): this;
    setColor(color: ColorResolvable): this;
    private _setColor;
    /**
     * Cancels the EmbedBuilder
     * @emits stop
     */
    cancel(callback?: () => void): this;
    showPageNumber(use: boolean): this;
    /**
     * ```javascript
     * builder.addEmojis([{
     *   emoji: '❗',
     *   do(sent, page, emoji) => {
     *       sent.delete();
     *       builder.cancel();
     *       sent.channel.send(`A new message${emoji}\nThe page you were on before was ${page}`);
     *   },
     * }]);
     * ```
     *
     * @param emojis The list of emojis to push.
     */
    addEmojis(emojis: Emoji[]): this;
    private _pageFooter;
    /**
     * Builds the embed.
     * @emits stop
     * @emits create
     * @listens pageUpdate
     */
    build(): this;
}
declare namespace EmbedBuilder {
}
export = EmbedBuilder;
