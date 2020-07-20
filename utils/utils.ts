import { IObjectAny } from './types';

/*------------------
       UTILS
------------------*/

/**
 * Does an object have properties?
 * @param {IObjectAny} obj object to test if empty
 * @return {boolean} is the object empty or not?
 */
const objNotEmpty = (obj: IObjectAny): boolean => {
  return obj && Object.keys(obj).length && obj.constructor === Object;
};

/**
 * Clear newlines or set newline values to undefined instead
 * @param {string} input to return undefined if only newline
 * @return {string} return same input or undefined if only newline
 */
const clearNewline = (input: string): string => {
  if (input === '\n') {
    return undefined;
  } else {
    return input;
  }
};

/**
 * Message middleware: ignore some kinds of messages
 * @param {IObjectAny} event event object
 * @return {Promise<void>} continue if not ignored message type
 */
const ignoreMention = async ({ event, next }: IObjectAny): Promise<void> => {
  const disallowedSubtypes = ['channel_topic', 'message_changed'];
  const ignoreSubtype = disallowedSubtypes.indexOf(event.subtype) > -1;
  const messageChanged = !!event.edited;
  // If not ignored subtype and not an edited message event, proceed
  if (!ignoreSubtype && !messageChanged) {
    await next();
  }
};

/**
 * Get quarter from ISO date
 * @param {string} isoDate YYYY-MM-DD
 * @return {string} Q1, Q2, Q3, Q4
 */
const getQ = (isoDate: string): string => {
  // Some very JavaScripty type coercion going on here :P
  const month0BI: number = <any>isoDate.split('-')[1] * 1 - 1;
  const qMap: string[] = ['Q1', 'Q1', 'Q1', 'Q2', 'Q2', 'Q2', 'Q3', 'Q3', 'Q3', 'Q4', 'Q4', 'Q4'];
  return qMap[month0BI];
};

/**
 * Takes falsey value and outputs an empty string
 * Useful for prefilling initial form values that don't exist
 * (Avoids printing "undefined" as a value in fields)
 * @param {string} input A string or falsey value
 * @return {string}
 */
const falseyToEmptyStr = (input: string): string => {
  return (!!input === false || input == 'undefined') ? '' : input;
};

/**
 * Get Airtable link for a specific record
 * @param {string} t table ID
 * @param {string} v view ID
 * @param {string} id record ID
 */
const getAtLink = (t: string, v: string, id: string): string => {
  return `https://airtable.com/${t}/${v}/${id}`;
};

export { objNotEmpty, clearNewline, ignoreMention, getQ, falseyToEmptyStr, getAtLink };
