"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.PageUpdater = void 0;
var events_1 = require("events");
var PageUpdater = (function (_super) {
    __extends(PageUpdater, _super);
    function PageUpdater(channel, user, embedArray, options) {
        var _this = _super.call(this) || this;
        _this.options = {
            message: '%u Please pick a page to go to.',
            cancel: true,
            cancelFormat: '%u Successfully canceled request',
            singleListen: false,
            time: 10000,
            invalidPage: '%u Sorry, I could not find that page.',
            success: '%u Set the page to %n'
        };
        _this.channel = channel;
        _this.user = user;
        _this.embedArray = embedArray;
        if (options) {
            _this.options.message = options.message || _this.options.message;
            _this.options.cancel = options.cancel || _this.options.cancel;
            _this.options.cancelFormat = options.cancelFormat || _this.options.cancelFormat;
            _this.options.singleListen = options.singleListen || _this.options.singleListen;
            _this.options.time = options.time || _this.options.time;
            _this.options.invalidPage = options.invalidPage || _this.options.invalidPage;
            _this.options.success = options.success || _this.options.success;
        }
        return _this;
    }
    PageUpdater.prototype.awaitPageUpdate = function () {
        var _this = this;
        var _a = this.options, message = _a.message, cancel = _a.cancel, cancelFormat = _a.cancelFormat, time = _a.time, invalidPage = _a.invalidPage, success = _a.success;
        this.channel.send(message.replace('%u', "" + this.user)).then(function (sent) {
            if (sent instanceof Array)
                sent = sent[0];
            var collector = sent.channel.createMessageCollector({ filter: function (msg) { return msg.author.id === _this.user.id; },
                time: time });
            collector.on('collect', function (response) {
                var page = parseInt(response.content);
                if (isNaN(page) && response.content.startsWith('cancel') && cancel) {
                    _this.emit('cancel', collector, response.content, cancelFormat.replace('%u', response.author.toString()));
                }
                else if (!isNaN(page)) {
                    if (page < 1 || page > _this.embedArray.length) {
                        _this.emit('invalid', collector, response.content, invalidPage.replace('%u', response.author.toString()));
                        return;
                    }
                    _this.emit('page', page - 1, response.content, collector, success
                        .replace('%u', response.author.toString())
                        .replace('%n', page.toString()));
                }
                else {
                    _this.emit('invalid', collector, response.content, invalidPage.replace('%u', response.author.toString()));
                }
            });
        });
        return this;
    };
    return PageUpdater;
}(events_1.EventEmitter));
exports.PageUpdater = PageUpdater;
(function (PageUpdater) {
})(PageUpdater = exports.PageUpdater || (exports.PageUpdater = {}));
exports.PageUpdater = PageUpdater;
//# sourceMappingURL=pageupdater.js.map