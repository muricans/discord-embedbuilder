"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageUpdater = void 0;
const events_1 = require("events");
/**
 * @noInheritDoc
 */
class PageUpdater extends events_1.EventEmitter {
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
    constructor(pageEmbedBuilder, user, options) {
        super();
        this.options = {
            message: '%u Please pick a page to go to.',
            cancel: true,
            cancelFormat: '%u Successfully canceled request',
            singleListen: false,
            time: 10000,
            invalidPage: '%u Sorry, I could not find that page.',
            success: '%u Set the page to %n',
        };
        this.channel = pageEmbedBuilder.channel;
        this.user = user;
        this.embedArray = pageEmbedBuilder.embeds;
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
    awaitPageUpdate() {
        const { message, cancel, cancelFormat, time, invalidPage, success, } = this.options;
        this.channel.send(message.replace('%u', `${this.user}`)).then(sent => {
            if (sent instanceof Array)
                sent = sent[0];
            const collector = sent.channel.createMessageCollector({ filter: (msg) => msg.author.id === this.user.id,
                time: time,
            });
            collector.on('collect', (response) => {
                const page = parseInt(response.content);
                if (isNaN(page) && response.content.startsWith('cancel') && cancel) {
                    this.emit('cancel', collector, response.content, cancelFormat.replace('%u', response.author.toString()));
                }
                else if (!isNaN(page)) {
                    if (page < 1 || page > this.embedArray.length) {
                        this.emit('invalid', collector, response.content, invalidPage.replace('%u', response.author.toString()));
                        return;
                    }
                    this.emit('page', page - 1, response.content, collector, success
                        .replace('%u', response.author.toString())
                        .replace('%n', page.toString()));
                }
                else {
                    this.emit('invalid', collector, response.content, invalidPage.replace('%u', response.author.toString()));
                }
            });
        });
        return this;
    }
}
exports.PageUpdater = PageUpdater;
/**
 * Emitted when it has received a valid number.
 * @event
 * @param page The page number received.
 * @param content The content that contained the page number.
 * @param collector The message collector.
 * @param message The message that has been formatted to be sent to the user.
 */
//eslint-disable-next-line @typescript-eslint/no-empty-function
PageUpdater.page = (page, content, collector, message) => { };
/**
 * Emitted when it has received an invalid number or page.
 * @event
 * @param content The content that contained the page number.
 * @param collector The message collector.
 * @param message The message that has been formatted to be sent to the user.
 */
//eslint-disable-next-line @typescript-eslint/no-empty-function
PageUpdater.invalid = (collector, content, message) => { };
/**
 * Emitted when it has been canceled or it has ended.
 * @event
 * @param collector The message collector.
 * @param content The content that contained the cancel keyword.
 * @param message The message that has been formatted to be sent to the user.
 */
//eslint-disable-next-line @typescript-eslint/no-empty-function
PageUpdater.cancel = (collector, content, message) => { };
