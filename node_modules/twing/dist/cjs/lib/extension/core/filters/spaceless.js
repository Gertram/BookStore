"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Removes whitespaces between HTML tags.
 *
 * @return {Promise<string>}
 */
function spaceless(content) {
    return Promise.resolve(content.toString().replace(/>\s+</g, '><').trim());
}
exports.spaceless = spaceless;
