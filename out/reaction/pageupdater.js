"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class PageUpdater extends events_1.EventEmitter {
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
    constructor(channel, user, embedArray, options) {
        super();
        this.channel = channel;
        this.user = user;
        this.embedArray = embedArray;
        this.options = options;
    }
    awaitPageUpdate() {
        const pageUpdateOptions = this.options ? this.options : {
            message: '%u Please pick a page to go to.',
            cancel: true,
            cancelFormat: '%u Successfully canceled request.',
            time: 10000,
            invalidPage: '%u Sorry, I could not find that page.',
            success: '%u Set the page to %n',
        };
        const cancel = pageUpdateOptions.cancel === undefined ? pageUpdateOptions.cancel : true;
        const format = pageUpdateOptions.cancelFormat ? pageUpdateOptions.cancelFormat : '%u Successfully cancled request.';
        const time = pageUpdateOptions.time === undefined ? pageUpdateOptions.time : 10000;
        const invalidPage = pageUpdateOptions.invalidPage ? pageUpdateOptions.invalidPage : '%u Sorry, I could not find that page.';
        const success = pageUpdateOptions.success ? pageUpdateOptions.success : '%u Set the page number to %n';
        const message = pageUpdateOptions.message ? pageUpdateOptions.message : '%u Please pick a page to go to.';
        //const emitter = new EventEmitter();
        this.channel.send(message.replace('%u', `${this.user}`)).then(sent => {
            if (sent instanceof Array)
                sent = sent[0];
            const collector = sent.channel.createMessageCollector(msg => msg.author.id === this.user.id, {
                time: time,
            });
            collector.on('collect', response => {
                const page = parseInt(response.content);
                if (isNaN(page) && response.content.startsWith('cancel') && cancel) {
                    this.emit('cancel', collector, response.content);
                    response.channel.send(format.replace('%u', response.author));
                }
                else if (!isNaN(page)) {
                    if (page < 1 || page > this.embedArray.length) {
                        this.emit('invalid');
                        return response.channel.send(invalidPage.replace('%u', response.author));
                    }
                    this.emit('page', page, response.content, collector);
                    response.channel.send(success
                        .replace('%u', response.author)
                        .replace('%n', page.toString()));
                }
                else {
                    this.emit('invalid', collector, response.content);
                    response.channel.send(invalidPage.replace('%u', response.author));
                }
            });
        });
        return this;
    }
}
exports.PageUpdater = PageUpdater;
(function (PageUpdater) {
})(PageUpdater = exports.PageUpdater || (exports.PageUpdater = {}));
