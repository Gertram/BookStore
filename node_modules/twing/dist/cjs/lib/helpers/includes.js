"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function includes(map, thing) {
    for (let [key, value] of map) {
        if (value === thing) {
            return true;
        }
    }
    return false;
}
exports.includes = includes;
