"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iconv_1 = require("../../../helpers/iconv");
function convertEncoding(string, to, from) {
    return Promise.resolve(iconv_1.iconv(from, to, Buffer.from(string)));
}
exports.convertEncoding = convertEncoding;
