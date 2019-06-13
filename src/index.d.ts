import { TextChannel, RichEmbed, Message, ColorResolvable, Attachment, FileOptions, DMChannel, GroupDMChannel } from "discord.js";
import { EventEmitter } from "events";
interface Emojis {
    emoji: string;
    do: (sent: Message, page: number, emoji: string) => void;
}
/**
 * Builds an embed with a number of pages based on how many are in the RichEmbed array given.
 * ```javascript
 * const myEmbeds = [new Discord.RichEmbed().addField('This is', 'a field!'),
 *  new Discord.RichEmbed().addField('This is', 'another field!')];
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
    constructor(channel?: TextChannel | DMChannel | GroupDMChannel);
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
    calculatePages(data: number, dataPerPage: number, insert: (embed: RichEmbed, index: number) => void): this;
    /**
     *
     * @param use Use the page system for the embed.
     */
    usePages(use: boolean): this;
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
     *
     * @param channel The channel the embed will be sent to.
     */
    setChannel(channel: TextChannel | DMChannel | GroupDMChannel): this;
    /**
     * Adds the embeds given to the end of the current embeds array.
     *
     * @param embedArray The embeds given here will be put at the end of the current embed array.
     */
    concatEmbeds(embedArray: RichEmbed[]): this;
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
    setDescription(description: any): this;
    setImage(url: string): this;
    setThumbnail(url: string): this;
    addBlankField(inline?: boolean): this;
    attachFile(file: string | Attachment | FileOptions): this;
    attachFiles(files: string[] | Attachment[] | FileOptions[]): this;
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
    addEmojis(emojis: Emojis[]): this;
    /**
     * Builds the embed.
     * @emits stop
     * @emits create
     */
    build(): this;
}
declare namespace EmbedBuilder {
}
export = EmbedBuilder;
