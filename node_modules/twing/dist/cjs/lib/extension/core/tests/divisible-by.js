"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function divisibleBy(a, b) {
    return Promise.resolve(a % b === 0);
}
exports.divisibleBy = divisibleBy;
