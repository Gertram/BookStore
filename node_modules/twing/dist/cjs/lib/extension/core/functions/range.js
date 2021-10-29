"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create_range_1 = require("../../../helpers/create-range");
function range(low, high, step) {
    return Promise.resolve(create_range_1.createRange(low, high, step));
}
exports.range = range;
