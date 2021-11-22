import { EventEmitter } from "events";
import { TextChannel, User, MessageEmbed, MessageCollector, DMChannel } from "discord.js";

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
export class PageUpdater extends EventEmitter {
    /**
     * Emitted when it has received a valid number.
     * @event
     * @param page The page number received.
     * @param content The content that contained the page number.
     * @param collector The message collector.
     * @param message The message that has been formatted to be sent to the user.
     */
     //eslint-disable-next-line @typescript-eslint/no-empty-function
    static page = (page:number, content:string, collector:MessageCollector, message:string) => {};


    /**
     * Emitted when it has received an invalid number or page.
     * @event
     * @param content The content that contained the page number.
     * @param collector The message collector.
     * @param message The message that has been formatted to be sent to the user.
     */
     //eslint-disable-next-line @typescript-eslint/no-empty-function
    static invalid = (collector: MessageCollector, content: string, message: string) => {};

    /**
     * Emitted when it has been canceled or it has ended.
     * @event
     * @param collector The message collector.
     * @param content The content that contained the cancel keyword.
     * @param message The message that has been formatted to be sent to the user.
     */
     //eslint-disable-next-line @typescript-eslint/no-empty-function
     static cancel = (collector: MessageCollector, content: string, message: string) => {};

    private channel: TextChannel | DMChannel;
    private user: User;
    private embedArray: MessageEmbed[];
    private options: PageUpdateOptions = {
        message: '%u Please pick a page to go to.',
        cancel: true,
        cancelFormat: '%u Successfully canceled request',
        singleListen: false,
        time: 10000,
        invalidPage: '%u Sorry, I could not find that page.',
        success: '%u Set the page to %n',
    };
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
    constructor(channel: TextChannel | DMChannel, user: User, embedArray: MessageEmbed[], options?: PageUpdateOptions) {
        super();
        this.channel = channel;
        this.user = user;
        this.embedArray = embedArray;
        if (options) {
            this.options.message = options.message || this.options.message;
            this.options.cancel = options.cancel || this.options.cancel;
            this.options.cancelFormat = options.cancelFormat || this.options.cancelFormat;
            this.options.singleListen = options.singleListen || this.options.singleListen;
            this.options.time = options.time || this.options.time;
            this.options.invalidPage = options.invalidPage || this.options.invalidPage;
            this.options.success = options.success || this.options.success;
        }
    }
    /**
     * Awaits a page update.
     * @emits page
     * @emits invalid
     * @emits cancel
     */
    public awaitPageUpdate(): this {
        const {
            message, cancel, cancelFormat, time, invalidPage, success,
        } = this.options;
        this.channel.send(message.replace('%u', `${this.user}`)).then(sent => {
            if (sent instanceof Array) sent = sent[0];
            const collector = sent.channel.createMessageCollector({filter: (msg) => msg.author.id === this.user.id,
                time: time,
            });
            collector.on('collect', (response) => {
                const page = parseInt(response.content);
                if (isNaN(page) && response.content.startsWith('cancel') && cancel) {
                    this.emit('cancel', collector, response.content, cancelFormat.replace('%u', response.author.toString()));
                } else if (!isNaN(page)) {
                    if (page < 1 || page > this.embedArray.length) {
                        this.emit('invalid', collector, response.content, invalidPage.replace('%u', response.author.toString()));
                        return
                    }
                    this.emit('page', page - 1, response.content, collector, success
                        .replace('%u', response.author.toString())
                        .replace('%n', page.toString()));
                } else {
                    this.emit('invalid', collector, response.content, invalidPage.replace('%u', response.author.toString()));
                }
            });
        });
        return this;
    }
}