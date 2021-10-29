"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sprintf = require('locutus/php/strings/sprintf');
function format(...args) {
    return Promise.resolve(sprintf(...args));
}
exports.format = format;
