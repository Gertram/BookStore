"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("../environment");
const null_1 = require("../cache/null");
class TwingEnvironmentBrowser extends environment_1.TwingEnvironment {
    cacheFromString(cache) {
        return new null_1.TwingCacheNull();
    }
}
exports.TwingEnvironmentBrowser = TwingEnvironmentBrowser;
