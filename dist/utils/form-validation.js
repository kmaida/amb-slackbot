"use strict";
/*------------------
  FORM VALIDATION
------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.validAirport = exports.dateCompare = exports.emailIsh = exports.validNumber = exports.validUrl = void 0;
/**
 * Ensure input is string and has no trailing whitespace
 * @param {any} input form input (could be any type, but most likely already a string)
 * @return {string}
 */
const _cleanStr = (input) => {
    return input.toString().trim();
};
/**
 * Is the string input a valid URL?
 * @param {string} input
 * @param {string} domain (optional) domain to check for in link
 * @return {boolean}
 */
const validUrl = (input, domain) => {
    const regexStr = /((?:[A-Za-z]{3,9})(?::\/\/|@)(?:(?:[A-Za-z0-9\-.]+[.:])|(?:www\.|[-;:&=+$,\w]+@))(?:[A-Za-z0-9.-]+)(?:[/\-+=&;%@.\w_~()]*)(?:[.!/\\\w-?%#~&=+()]*))/g;
    const regex = new RegExp(regexStr);
    const cleanStr = _cleanStr(input);
    const matchRegex = !!cleanStr.match(regex);
    const includesDomain = domain ? cleanStr.includes(domain) : true;
    return matchRegex && includesDomain;
};
exports.validUrl = validUrl;
/**
 * Is the string input a valid integer?
 * @param {number} input form input
 * @return {boolean}
 */
const validNumber = (input) => {
    const regexStr = /^[0-9]*$/g;
    const regex = new RegExp(regexStr);
    const cleanStr = _cleanStr(input);
    return !!cleanStr.match(regex);
};
exports.validNumber = validNumber;
/**
 * Does this look like an airport code? (3 letters)
 * @param {string} input form input
 * @return {boolean}
 */
const validAirport = (input) => {
    const regexStr = /^[A-Za-z]{3}$/g;
    const regex = new RegExp(regexStr);
    const cleanStr = _cleanStr(input);
    return !!cleanStr.match(regex);
};
exports.validAirport = validAirport;
/**
 * Is the string formatted sort of like an email address?
 * @param {string} input https://stackoverflow.com/a/38137215
 * @return {boolean}
 */
const emailIsh = (input) => {
    const regexStr = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+[^<>()\.,;:\s@\"]{2,})$/g;
    const regex = new RegExp(regexStr);
    const cleanStr = _cleanStr(input);
    return !!cleanStr.match(regex);
};
exports.emailIsh = emailIsh;
/**
 * Compare input date with today's date
 * @param {string} dateInput ISO string date
 * @param {boolean} testFuture Are we testing for a future date? (false = test for past)
 * @param {boolean} futureStartTomorrow Count today as the future?
 * @return {boolean}
 */
const dateCompare = (dateInput, testFuture = false, futureStartTomorrow = false) => {
    // Get today's date in ISO at 11:59:59
    const now = new Date().toISOString().split('T')[0];
    const todayISO = now + 'T23:59:59Z';
    const today = new Date(todayISO);
    // Get submitted date in ISO at 11:59:59
    const sDate = new Date(dateInput + 'T23:59:59Z');
    // Compare timestamps for UTC submitted date and UTC today to determine past/future
    // (Today is always valid for past, and valid for future if !futureStartTomorrow)
    const isFuture = !futureStartTomorrow ? sDate.getTime() >= today.getTime() : sDate.getTime() > today.getTime();
    const isPast = sDate.getTime() <= today.getTime();
    // Are we checking for a future date or a past date?
    if (testFuture) {
        return isFuture;
    }
    else {
        return isPast;
    }
};
exports.dateCompare = dateCompare;
//# sourceMappingURL=form-validation.js.map