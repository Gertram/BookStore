"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser = require('regex-parser');
/**
 * @param {string} input
 * @returns {RegExp}
 */
function parseRegex(input) {
    return parser(input);
}
exports.parseRegex = parseRegex;
