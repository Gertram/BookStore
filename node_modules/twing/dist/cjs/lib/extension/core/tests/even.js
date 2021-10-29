"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function even(value) {
    return Promise.resolve(value % 2 === 0);
}
exports.even = even;
