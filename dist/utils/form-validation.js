"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validNumber = exports.validUrl = void 0;
/*------------------
  FORM VALIDATION
------------------*/
/**
 * Ensure input is string and has no trailing whitespace
 * @param {any} input form input (could be any type, but most likely already a string)
 * @returns {string}
 */
const _cleanStr = (input) => {
    return input.toString().trim();
};
/**
 * Is the string input a valid URL?
 * @param {string} input
 * @return {boolean}
 */
const validUrl = (input) => {
    const regexStr = /((?:[A-Za-z]{3,9})(?::\/\/|@)(?:(?:[A-Za-z0-9\-.]+[.:])|(?:www\.|[-;:&=+$,\w]+@))(?:[A-Za-z0-9.-]+)(?:[/\-+=&;%@.\w_~()]*)(?:[.!/\\\w-?%#~&=+()]*))/g;
    const regex = new RegExp(regexStr);
    return !!_cleanStr(input).match(regex);
};
exports.validUrl = validUrl;
/**
 * Is the string input a valid integer?
 * @param {number} input form input
 * @returns {boolean}
 */
const validNumber = (input) => {
    const regexStr = /^[0-9]*$/g;
    const regex = new RegExp(regexStr);
    return !!_cleanStr(input).match(regex);
};
exports.validNumber = validNumber;
//# sourceMappingURL=form-validation.js.map