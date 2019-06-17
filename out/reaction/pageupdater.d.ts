import { EventEmitter } from "events";
import { TextChannel, User, MessageEmbed, DMChannel } from "discord.js";
export interface PageUpdateOptions {
    message: string;
    time: number;
    cancel: boolean;
    cancelFormat: string;
    invalidPage: string;
    success: string;
}
export declare class PageUpdater extends EventEmitter {
    private channel;
    private user;
    private embedArray;
    private options?;
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
    awaitPageUpdate(): this;
}
export declare namespace PageUpdater {
}
