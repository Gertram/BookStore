"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const security_error_1 = require("./security-error");
class TwingSandboxSecurityNotAllowedMethodError extends security_error_1.TwingSandboxSecurityError {
    constructor(message, lineno = -1, source = null) {
        super(message, lineno, source);
        this.name = 'TwingSandboxSecurityNotAllowedMethodError';
    }
}
exports.TwingSandboxSecurityNotAllowedMethodError = TwingSandboxSecurityNotAllowedMethodError;
