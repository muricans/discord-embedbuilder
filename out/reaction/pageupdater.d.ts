import { EventEmitter } from "events";
import { User, MessageCollector } from "discord.js";
import { PageEmbedBuilder } from "../index";
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
    /**
     * Emitted when it has received a valid number.
     * @event
     * @param page The page number received.
     * @param content The content that contained the page number.
     * @param collector The message collector.
     * @param message The message that has been formatted to be sent to the user.
     */
    static page: (page: number, content: string, collector: MessageCollector, message: string) => void;
    /**
     * Emitted when it has received an invalid number or page.
     * @event
     * @param content The content that contained the page number.
     * @param collector The message collector.
     * @param message The message that has been formatted to be sent to the user.
     */
    static invalid: (collector: MessageCollector, content: string, message: string) => void;
    /**
     * Emitted when it has been canceled or it has ended.
     * @event
     * @param collector The message collector.
     * @param content The content that contained the cancel keyword.
     * @param message The message that has been formatted to be sent to the user.
     */
    static cancel: (collector: MessageCollector, content: string, message: string) => void;
    private channel;
    private user;
    private embedArray;
    private options;
    /**
     * Create a PageUpdater to await a response from a user, and set the embedArray to the provided number.
     * ```javascript
     * const pageUpdater = new PageUpdater(pageEmbedBuilder, message.author, builder.getEmbeds());
     * pageUpdater.awaitPageUpdate()
     *  .on('cancel', (collector) => collector.stop())
     *  .on('page', (page) => builder.updatePage(page));
     * ```
     *
     * @param pageEmbedBuilder The PageEmbedBuilder to grab info from.
     * @param user The user this will be accepting messages from/
     * @param options Options such as messages, time, cancel.
     */
    constructor(pageEmbedBuilder: PageEmbedBuilder, user: User, options?: PageUpdateOptions);
    /**
     * Awaits a page update.
     * @emits page
     * @emits invalid
     * @emits cancel
     */
    awaitPageUpdate(): this;
}
