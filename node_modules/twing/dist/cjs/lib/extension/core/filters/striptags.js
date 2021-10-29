"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strip_tags = require('locutus/php/strings/strip_tags');
function striptags(...args) {
    return Promise.resolve(strip_tags(...args));
}
exports.striptags = striptags;
