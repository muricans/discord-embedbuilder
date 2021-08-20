/// <reference types="node" />
import { TextChannel, MessageEmbed, Message, ColorResolvable, DMChannel, User, EmbedFieldData } from "discord.js";
import { EventEmitter } from "events";
import { PageUpdateOptions } from './reaction/pageupdater';
/**
 * @private
 */
interface Emojis {
    emoji: (sent: Message, page: number, emoji: string) => void;
}
/**
 * @noInheritDoc
 */
export declare class EmbedBuilder extends EventEmitter {
    /**
     * The channel being used with the EmbedBuilder.
     */
    channel: TextChannel | DMChannel;
    /**
     * All embeds in the builder.
     */
    embeds: MessageEmbed[];
    private hasColor;
    private endColor;
    private emojis;
    private usingPages;
    private collection;
    private time;
    private timer?;
    private date?;
    private stopFunc?;
    private enabledReactions;
    private back;
    private next;
    private stop;
    private first;
    private last;
    private usingPageNumber;
    private pageFormat;
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
    constructor(channel: TextChannel | DMChannel);
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
     * @param data This is the amount of data to process.
     * @param dataPerPage This is how much data you want displayed per page.
     * @param insert Gives you an embed and the current index.
     */
    calculatePages(data: number, dataPerPage: number, insert: (embed: MessageEmbed, index: number) => void): this;
    /**
    * Async version of calculatePages
    *
    * Makes the page calculator wait for operations to finish.
    * ```javascript
    * await embedBuilder.calculatePagesAsync(users.length, 10, async (embed, i) => {
    *  const user = await getSomeUser(users[i]);
    *  embed.addField(user.username, user.points, true);
    * });
    * ```
    *
    * @param data This is the amount of data to process.
    * @param dataPerPage This is how much data you want displayed per page.
    * @param insert Gives you an embed and the current index.
    */
    calculatePagesAsync(data: number, dataPerPage: number, insert: (embed: MessageEmbed, index: number) => Promise<void>): Promise<this>;
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
     * **<span style="color:red">Warning:</span>** This should not be used to set the channel. You can set that in the constructor
     *
     * @param channel The channel to switch the current one to.
     */
    changeChannel(channel: TextChannel | DMChannel): this;
    /**
     * Adds the embeds given to the end of the current embeds array.
     *
     * @param embeds The embeds given here will be put at the end of the current embed array.
     */
    concatEmbeds(embeds: MessageEmbed[]): this;
    /**
     *
     * @param embeds The array of embeds to use.
     */
    setEmbeds(embeds: MessageEmbed[]): this;
    /**
     *
     * @param time The amount of time the bot will allow reactions for. (ms)
     */
    setTime(time: number): this;
    /**
     * Use after embed has already been built to add time to the current collector.
     * @param time Time to add to current amount of time. (ms)
     */
    addTime(time: number): this;
    /**
     * Resets the timer to either the time already set, or a new time given.
     * @param time New time to set (ms)
     */
    resetTimer(time?: number): this;
    /**
     * Whenever the builder changes it's page, it will add specified amount of time (ms) to the current running timer.
     * @param timeToAdd Time to add to current amount of time. (ms)
     */
    addTimeOnPage(timeToAdd: number): this;
    /**
     * Whenever the builder changes it's page, it will reset the timer to the current set time.
     */
    resetTimerOnPage(time?: number): this;
    /**
     *
     * @param embed The embed to push to the array of embeds.
     */
    addEmbed(embed: MessageEmbed): this;
    setTitle(title: string): this;
    setFooter(text: any, icon?: string): this;
    setDescription(description: any): this;
    setImage(url: string): this;
    setThumbnail(url: string): this;
    spliceFields(index: number, deleteCount: number, fields?: EmbedFieldData[]): this;
    /**
     * Adds a single field to all embeds.
     * @param name Name of the field
     * @param value Value of the field
     * @param inline Inline?
     */
    addField(name: any, value: any, inline?: boolean): this;
    /**
     * Adds multiple fields to all embeds.
     * @param fields An array of EmbedFieldData
     */
    addFields(fields: EmbedFieldData[]): this;
    setURL(url: string): this;
    setAuthor(name: any, icon?: string, url?: string): this;
    setTimestamp(timestamp?: Date | number): this;
    /**
     * @ignore
     */
    private _all;
    /**
     * Add an emoji which will perform it's own action when pressed.
     */
    addEmoji(unicodeEmoji: string, func: (sent: Message, page: number, emoji: string) => void): this;
    /**
     * Deletes an emoji from the emoji list
     */
    deleteEmoji(unicodeEmoji: string): this;
    setColor(color: ColorResolvable): this;
    /**
     * When the collection has ended, and no other custom color is being used, this will be the color the embed is set to. Default is 0xE21717
     * @param color Any color resolvable
     */
    setEndColor(color: ColorResolvable): this;
    /**
     * @ignore
     */
    private _setColor;
    /**
     * Cancels the EmbedBuilder
     * @emits stop
     */
    cancel(callback?: () => void): this;
    showPageNumber(use: boolean): this;
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
    addEmojis(emojis: Emojis): this;
    /**
     *
     * @param reactions The reactions the bot will use. If this  method is not used in the builder, the bot will automatically add all reactions.
     * Any reactions left out will not be used.
     */
    defaultReactions(reactions: []): this;
    /**
     * Replaces current type of emoji given with the new emoji provided.
     *
     * @param emoji The type of page emoji to replace. Types: back, first, stop, last, next.
     * @param newEmoji This emoji will replace the current page emoji for the given type.
     */
    setPageEmoji(emoji: string, newEmoji: string): this;
    /**
     * Create an updater to await responses from a user,
     * then set the builders current page to the page given.
     *
     * @param user The user to accept a page update from.
     * @emits pageUpdate
     */
    awaitPageUpdate(user: User, options?: PageUpdateOptions): this;
    /**
     * Builds the embed.
     * @emits stop
     * @emits create
     * @emits pageUpdate
     * @emits preSend
     * @listens pageUpdate
     */
    build(): Promise<this>;
}
export declare namespace EmbedBuilder {
}
export {};
