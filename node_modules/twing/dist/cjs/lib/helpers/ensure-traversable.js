"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_traversable_1 = require("./is-traversable");
const is_plain_object_1 = require("./is-plain-object");
function ensureTraversable(seq) {
    if (is_traversable_1.isTraversable(seq) || is_plain_object_1.isPlainObject(seq)) {
        return seq;
    }
    return [];
}
exports.ensureTraversable = ensureTraversable;
