"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locutusNl2br = require('locutus/php/strings/nl2br');
function nl2br() {
    return Promise.resolve(locutusNl2br(...arguments));
}
exports.nl2br = nl2br;
