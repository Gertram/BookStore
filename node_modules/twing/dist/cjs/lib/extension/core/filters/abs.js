"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Return the absolute value of a number.
 *
 * @param {number} x
 * @returns {Promise<number>}
 */
function abs(x) {
    return Promise.resolve(Math.abs(x));
}
exports.abs = abs;
