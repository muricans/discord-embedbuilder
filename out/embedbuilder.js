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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.EmbedBuilder = void 0;
var discord_js_1 = require("discord.js");
var events_1 = require("events");
var pageupdater_1 = require("./reaction/pageupdater");
var EmbedBuilder = (function (_super) {
    __extends(EmbedBuilder, _super);
    function EmbedBuilder(channel) {
        var _this = _super.call(this) || this;
        _this.embeds = [];
        _this.hasColor = false;
        _this.endColor = 0xE21717;
        _this.emojis = [];
        _this.usingPages = true;
        _this.time = 60000;
        _this.enabledReactions = ['first', 'back', 'stop', 'next', 'last'];
        _this.back = '◀';
        _this.next = '▶';
        _this.stop = '⏹';
        _this.first = '⏪';
        _this.last = '⏩';
        _this.usingPageNumber = true;
        _this.pageFormat = '%p/%m';
        _this.channel = channel;
        return _this;
    }
    EmbedBuilder.prototype.calculatePages = function (data, dataPerPage, insert) {
        var page = 1;
        for (var i = 0; i < dataPerPage * page; i++) {
            if (i === data)
                break;
            if (!this.embeds[page - 1])
                this.embeds.push(new discord_js_1.MessageEmbed());
            insert(this.embeds[page - 1], i);
            if (i === (dataPerPage * page) - 1)
                page++;
        }
        return this;
    };
    EmbedBuilder.prototype.calculatePagesAsync = function (data, dataPerPage, insert) {
        return __awaiter(this, void 0, void 0, function () {
            var page, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        page = 1;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < dataPerPage * page)) return [3, 4];
                        if (i === data)
                            return [3, 4];
                        if (!this.embeds[page - 1])
                            this.embeds.push(new discord_js_1.MessageEmbed());
                        return [4, insert(this.embeds[page - 1], i)];
                    case 2:
                        _a.sent();
                        if (i == (dataPerPage * page) - 1)
                            page++;
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3, 1];
                    case 4: return [2, this];
                }
            });
        });
    };
    EmbedBuilder.prototype.usePages = function (use) {
        this.usingPages = use;
        return this;
    };
    EmbedBuilder.prototype.updatePage = function (page) {
        this.emit('pageUpdate', page);
        return this;
    };
    EmbedBuilder.prototype.setPageFormat = function (format) {
        this.pageFormat = format;
        return this;
    };
    EmbedBuilder.prototype.changeChannel = function (channel) {
        this.channel = channel;
        return this;
    };
    EmbedBuilder.prototype.concatEmbeds = function (embeds) {
        this.embeds = this.embeds.concat(embeds);
        return this;
    };
    EmbedBuilder.prototype.setEmbeds = function (embeds) {
        this.embeds = embeds;
        return this;
    };
    EmbedBuilder.prototype.setTime = function (time) {
        this.time = time;
        return this;
    };
    EmbedBuilder.prototype.addTime = function (time) {
        var notReady = false;
        if (this.date) {
            this.time += time;
            var currentTime = (this.time + this.date) - Date.now();
            if (this.timer && currentTime > 0 && this.stopFunc !== undefined) {
                clearTimeout(this.timer);
                this.timer = setTimeout(this.stopFunc, currentTime);
            }
            else
                notReady = true;
        }
        else
            notReady = true;
        if (notReady)
            throw new Error('Builder was not ready to add time! Date, timer, and stopFunc must be defined by the builder.');
        return this;
    };
    EmbedBuilder.prototype.resetTimer = function (time) {
        var notReady = false;
        if (this.timer && this.stopFunc !== undefined) {
            clearTimeout(this.timer);
            this.date = Date.now();
            this.timer = setTimeout(this.stopFunc, time || this.time);
        }
        else
            notReady = true;
        if (notReady)
            throw new Error('Builder was not ready to add time! Date, timer, and stopFunc must be defined by the builder.');
        return this;
    };
    EmbedBuilder.prototype.addTimeOnPage = function (timeToAdd) {
        var _this = this;
        this.on('pageUpdate', function () {
            _this.addTime(timeToAdd);
        });
        return this;
    };
    EmbedBuilder.prototype.resetTimerOnPage = function (time) {
        var _this = this;
        this.on('pageUpdate', function () {
            _this.resetTimer(time);
        });
        return this;
    };
    EmbedBuilder.prototype.addEmbed = function (embed) {
        this.embeds.push(embed);
        return this;
    };
    EmbedBuilder.prototype.setTitle = function (title) {
        var _this = this;
        this._all(function (i) {
            _this.embeds[i].setTitle(title);
        });
        return this;
    };
    EmbedBuilder.prototype.setFooter = function (text, icon) {
        var _this = this;
        this._all(function (i) {
            _this.embeds[i].setFooter(text, icon);
        });
        return this;
    };
    EmbedBuilder.prototype.setDescription = function (description) {
        var _this = this;
        this._all(function (i) {
            _this.embeds[i].setDescription(description);
        });
        return this;
    };
    EmbedBuilder.prototype.setImage = function (url) {
        var _this = this;
        this._all(function (i) {
            _this.embeds[i].setImage(url);
        });
        return this;
    };
    EmbedBuilder.prototype.setThumbnail = function (url) {
        var _this = this;
        this._all(function (i) {
            _this.embeds[i].setThumbnail(url);
        });
        return this;
    };
    EmbedBuilder.prototype.spliceFields = function (index, deleteCount, fields) {
        var _this = this;
        this._all(function (i) {
            if (!fields)
                _this.embeds[i].spliceFields(index, deleteCount);
            else
                _this.embeds[i].spliceFields(index, deleteCount, fields);
        });
        return this;
    };
    EmbedBuilder.prototype.addField = function (name, value, inline) {
        var _this = this;
        this._all(function (i) {
            _this.embeds[i].addField(name, value, inline);
        });
        return this;
    };
    EmbedBuilder.prototype.addFields = function (fields) {
        var _this = this;
        this._all(function (i) {
            _this.embeds[i].addFields(fields);
        });
        return this;
    };
    EmbedBuilder.prototype.setURL = function (url) {
        var _this = this;
        this._all(function (i) {
            _this.embeds[i].setURL(url);
        });
        return this;
    };
    EmbedBuilder.prototype.setAuthor = function (name, icon, url) {
        var _this = this;
        this._all(function (i) {
            _this.embeds[i].setAuthor(name, icon, url);
        });
        return this;
    };
    EmbedBuilder.prototype.setTimestamp = function (timestamp) {
        var _this = this;
        this._all(function (i) {
            _this.embeds[i].setTimestamp(timestamp);
        });
        return this;
    };
    EmbedBuilder.prototype._all = function (index) {
        for (var i = 0; i < this.embeds.length; i++)
            index(i);
    };
    EmbedBuilder.prototype.addEmoji = function (unicodeEmoji, func) {
        this.emojis.push({
            emoji: unicodeEmoji,
            "do": func
        });
        return this;
    };
    EmbedBuilder.prototype.deleteEmoji = function (unicodeEmoji) {
        var index = this.emojis.find(function (emoji) { return emoji.emoji === unicodeEmoji; });
        if (!index)
            throw new Error('Emoji was undefined');
        this.emojis.splice(this.emojis.indexOf(index), 1);
        return this;
    };
    EmbedBuilder.prototype.setColor = function (color) {
        var _this = this;
        this._all(function (i) {
            _this.embeds[i].setColor(color);
        });
        this.hasColor = true;
        return this;
    };
    EmbedBuilder.prototype.setEndColor = function (color) {
        this.endColor = color;
        return this;
    };
    EmbedBuilder.prototype._setColor = function (color) {
        var _this = this;
        this._all(function (i) {
            _this.embeds[i].setColor(color);
        });
        return this;
    };
    EmbedBuilder.prototype.cancel = function (callback) {
        if (this.collection) {
            this.collection.stop();
            if (callback)
                callback();
        }
        else
            throw new Error('The collection has not yet started');
        return this;
    };
    EmbedBuilder.prototype.showPageNumber = function (use) {
        this.usingPageNumber = use;
        return this;
    };
    EmbedBuilder.prototype.addEmojis = function (emojis) {
        var keys = Object.keys(emojis);
        var values = Object.values(emojis);
        for (var i = 0; i < keys.length; i++)
            this.addEmoji(keys[i], values[i]);
        return this;
    };
    EmbedBuilder.prototype.defaultReactions = function (reactions) {
        this.enabledReactions = reactions;
        return this;
    };
    EmbedBuilder.prototype.setPageEmoji = function (emoji, newEmoji) {
        switch (emoji) {
            case "back":
                this.back = newEmoji;
                break;
            case "first":
                this.first = newEmoji;
                break;
            case "stop":
                this.stop = newEmoji;
                break;
            case "last":
                this.last = newEmoji;
                break;
            case "next":
                this.next = newEmoji;
                break;
            default:
                throw new Error('Unreconized emoji name. Use types: back, first, stop, last or next');
        }
        return this;
    };
    EmbedBuilder.prototype.awaitPageUpdate = function (user, options) {
        var _this = this;
        if (!this.channel)
            throw new Error('A channel is required.');
        var update = new pageupdater_1.PageUpdater(this.channel, user, this.embeds, options).awaitPageUpdate();
        update.on('page', function (page, a, c, m) {
            var _a;
            if (!((_a = _this.collection) === null || _a === void 0 ? void 0 : _a.ended)) {
                _this.emit('pageUpdate', page);
                _this.channel.send(m);
            }
            if (options === null || options === void 0 ? void 0 : options.singleListen)
                c.stop();
        });
        update.on('cancel', function (c, r, m) {
            var _a;
            if (!((_a = _this.collection) === null || _a === void 0 ? void 0 : _a.ended))
                _this.channel.send(m);
            c.stop();
        });
        update.on('invalid', function (c, r, m) {
            var _a;
            if (!((_a = _this.collection) === null || _a === void 0 ? void 0 : _a.ended))
                _this.channel.send(m);
        });
        return this;
    };
    EmbedBuilder.prototype.build = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.channel || !_this.embeds.length)
                return reject(new Error('A channel, and array of embeds is required.'));
            var reactions = new Map();
            var defaultReactionEmojis = ['first', 'back', 'stop', 'next', 'last'];
            if (_this.enabledReactions != defaultReactionEmojis) {
                defaultReactionEmojis.forEach(function (r) {
                    if (!_this.enabledReactions.find(function (v) { return v === r; }))
                        reactions.set(r, false);
                    else
                        reactions.set(r, true);
                });
            }
            if (!_this.hasColor)
                _this._setColor(0x2872DB);
            if (_this.usingPageNumber)
                for (var _i = 0, _a = _this.embeds; _i < _a.length; _i++) {
                    var embed = _a[_i];
                    embed.setFooter(_this.pageFormat
                        .replace('%p', (_this.embeds.indexOf(embed) + 1).toString())
                        .replace('%m', _this.embeds.length.toString()));
                }
            _this.emit('preSend', reactions);
            _this.channel.send({ embeds: [_this.embeds[0]] }).then(function (sent) { return __awaiter(_this, void 0, void 0, function () {
                var author, _i, _a, emoji, page, collection;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (sent instanceof Array)
                                return [2, reject(new Error('Got multiple messages instead of one.'))];
                            if (sent.author)
                                author = sent.author;
                            else
                                return [2, reject(new Error('Author was not a user!'))];
                            if (this.usingPages && this.embeds.length > 1) {
                                reactions.forEach(function (e, r) { return __awaiter(_this, void 0, void 0, function () {
                                    var emojiResolvable;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!e) return [3, 2];
                                                emojiResolvable = void 0;
                                                switch (r) {
                                                    case 'first':
                                                        emojiResolvable = this.first;
                                                        break;
                                                    case 'next':
                                                        emojiResolvable = this.next;
                                                        break;
                                                    case 'stop':
                                                        emojiResolvable = this.stop;
                                                        break;
                                                    case 'back':
                                                        emojiResolvable = this.back;
                                                        break;
                                                    case 'last':
                                                        emojiResolvable = this.last;
                                                        break;
                                                    default:
                                                        return [2, reject(new Error("Could not parse emoji"))];
                                                }
                                                return [4, sent.react(emojiResolvable)];
                                            case 1:
                                                _a.sent();
                                                _a.label = 2;
                                            case 2: return [2];
                                        }
                                    });
                                }); });
                            }
                            if (!this.emojis.length) return [3, 4];
                            _i = 0, _a = this.emojis;
                            _b.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3, 4];
                            emoji = _a[_i];
                            return [4, sent.react(emoji.emoji)];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3, 1];
                        case 4:
                            this.emit('create', sent, sent.reactions);
                            page = 0;
                            collection = sent.createReactionCollector({ filter: function (reaction, user) { return user.id !== author.id; } })
                                .on('end', function () {
                                sent.edit({ embeds: [_this.embeds[page].setColor(_this.endColor)] });
                                if (_this.timer) {
                                    clearTimeout(_this.timer);
                                    _this.timer = undefined;
                                }
                                _this.emit('stop', sent, page, collection);
                            })
                                .on('collect', function (reaction, user) {
                                reaction.users.remove(user);
                                if (_this.usingPages && _this.embeds.length > 1) {
                                    switch (reaction.emoji.name) {
                                        case _this.first:
                                            page = 0;
                                            break;
                                        case _this.back:
                                            if (page === 0)
                                                return;
                                            page--;
                                            break;
                                        case _this.stop:
                                            collection.stop();
                                            break;
                                        case _this.next:
                                            if (page === _this.embeds.length - 1)
                                                return;
                                            page++;
                                            break;
                                        case _this.last:
                                            page = _this.embeds.length - 1;
                                            break;
                                    }
                                    if (reaction.emoji.name !== _this.stop)
                                        _this.emit('pageUpdate', page);
                                }
                                if (_this.emojis.length > 0) {
                                    var customEmoji = _this.emojis.find(function (e) { return e.emoji === reaction.emoji.name || e.emoji === reaction.emoji.id; });
                                    if (customEmoji)
                                        customEmoji["do"](sent, page, customEmoji.emoji);
                                }
                            });
                            this.on('pageUpdate', function (newPage) {
                                if (collection.ended || newPage > _this.embeds.length - 1 || newPage < 0)
                                    return;
                                else {
                                    page = newPage;
                                    sent.edit({ embeds: [_this.embeds[newPage]] });
                                }
                            });
                            this.collection = collection;
                            this.stopFunc = function () {
                                var _a;
                                (_a = _this.collection) === null || _a === void 0 ? void 0 : _a.stop();
                                _this.emit('stop', sent, page, collection);
                            };
                            this.date = Date.now();
                            this.timer = setTimeout(this.stopFunc, this.time);
                            return [2, resolve(this)];
                    }
                });
            }); });
        });
    };
    return EmbedBuilder;
}(events_1.EventEmitter));
exports.EmbedBuilder = EmbedBuilder;
(function (EmbedBuilder) {
})(EmbedBuilder = exports.EmbedBuilder || (exports.EmbedBuilder = {}));
exports.EmbedBuilder = EmbedBuilder;
//# sourceMappingURL=embedbuilder.js.map