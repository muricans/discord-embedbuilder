/// <reference types="node" />
import { EventEmitter } from "events";
import { TextChannel, User, MessageEmbed, DMChannel } from "discord.js";
export interface PageUpdateOptions {
    /**
     * The initial message to send. Use %u to reference the user.
     */
    message: string;
    /**
     * How long should it listen for messages?
     */
    time: number;
    /**
     * Do you want to use a cancel message?
     */
    cancel: boolean;
    /**
     * If cancel is true, then this is the format the cancel message will follow.
     * Use %u to reference the user.
     */
    cancelFormat: string;
    /**
     * Should it stop listening after it recieves the first message?
     */
    singleListen: boolean;
    /**
     * The message that is sent when it receives an invalid page.
     * Use %u to reference the user.
     */
    invalidPage: string;
    /**
     * The message sent when it has received a valid page.
     * Use %u to reference the user, %n to get the number they gave.
     */
    success: string;
}
/**
 * @noInheritDoc
 */
export declare class PageUpdater extends EventEmitter {
    private channel;
    private user;
    private embedArray;
    private options;
    /**
     * Create a PageUpdater to await a response from a user, and set the embedArray to the provided number.
     * ```javascript
     * const pageUpdater = new PageUpdater(message.channel, message.author, builder.getEmbeds());
     * pageUpdater.awaitPageUpdate()
     *  .on('cancel', (collector) => collector.stop())
     *  .on('page', (page) => builder.updatePage(page));
     * ```
     *
     * @param channel The channel to send messages to.
     * @param user The user this will be accepting messages from/
     * @param embedArray The array of embeds to use.
     * @param options Options such as messages, time, cancel.
     */
    constructor(channel: TextChannel | DMChannel, user: User, embedArray: MessageEmbed[], options?: PageUpdateOptions);
    /**
     * Awaits a page update.
     * @emits page
     * @emits invalid
     * @emits cancel
     */
    awaitPageUpdate(): this;
}
export declare namespace PageUpdater {
}
