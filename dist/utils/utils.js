"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getat_link = exports.falseyToEmptyStr = exports.getQ = exports.ignoreMention = exports.clearNewline = exports.objNotEmpty = void 0;
/*------------------
       UTILS
------------------*/
/**
 * Does an object have properties?
 * @param {IObjectAny} obj object to test if empty
 * @return {boolean} is the object empty or not?
 */
const objNotEmpty = (obj) => {
    return obj && Object.keys(obj).length && obj.constructor === Object;
};
exports.objNotEmpty = objNotEmpty;
/**
 * Clear newlines or set newline values to undefined instead
 * @param {string} input to return undefined if only newline
 * @return {string} return same input or undefined if only newline
 */
const clearNewline = (input) => {
    if (input === '\n') {
        return undefined;
    }
    else {
        return input;
    }
};
exports.clearNewline = clearNewline;
/**
 * Message middleware: ignore some kinds of messages
 * @param {IObjectAny} event event object
 * @return {Promise<void>} continue if not ignored message type
 */
const ignoreMention = ({ event, next }) => __awaiter(void 0, void 0, void 0, function* () {
    const disallowedSubtypes = ['channel_topic', 'message_changed'];
    const ignoreSubtype = disallowedSubtypes.indexOf(event.subtype) > -1;
    const messageChanged = !!event.edited;
    // If not ignored subtype and not an edited message event, proceed
    if (!ignoreSubtype && !messageChanged) {
        yield next();
    }
});
exports.ignoreMention = ignoreMention;
/**
 * Get quarter from ISO date
 * @param {string} isoDate YYYY-MM-DD
 * @return {string} Q1, Q2, Q3, Q4
 */
const getQ = (isoDate) => {
    // Some very JavaScripty type coercion going on here :P
    const month0BI = isoDate.split('-')[1] * 1 - 1;
    const qMap = ['Q1', 'Q1', 'Q1', 'Q2', 'Q2', 'Q2', 'Q3', 'Q3', 'Q3', 'Q4', 'Q4', 'Q4'];
    return qMap[month0BI];
};
exports.getQ = getQ;
/**
 * Takes an undefined or null value and outputs an empty string
 * Useful for prefilling initial form values that don't exist
 * (Avoids printing "undefined" as a value in fields)
 * @param {string} input A string or falsey value
 * @return {string}
 */
const falseyToEmptyStr = (input) => {
    return (!!input === false || input == 'undefined') ? '' : input;
};
exports.falseyToEmptyStr = falseyToEmptyStr;
/**
 * Get Airtable link for a specific record
 * @param {string} t table ID
 * @param {string} v view ID
 * @param {string} id record ID
 */
const getat_link = (t, v, id) => {
    return `https://airtable.com/${t}/${v}/${id}`;
};
exports.getat_link = getat_link;
//# sourceMappingURL=utils.js.map