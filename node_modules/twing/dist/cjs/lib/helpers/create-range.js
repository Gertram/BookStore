"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iterator_to_map_1 = require("./iterator-to-map");
const locutusRange = require('locutus/php/array/range');
function createRange(low, high, step) {
    let range = locutusRange(low, high, step);
    return iterator_to_map_1.iteratorToMap(range);
}
exports.createRange = createRange;
