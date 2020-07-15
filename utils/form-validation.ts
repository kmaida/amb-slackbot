import { IObjectAny } from './types';

/*------------------
  FORM VALIDATION
------------------*/

/**
 * Ensure input is string and has no trailing whitespace
 * @param {any} input form input (could be any type, but most likely already a string)
 * @returns {string}
 */
const _cleanStr = (input: any): string => {
  return input.toString().trim();
}

/**
 * Is the string input a valid URL?
 * @param {string} input
 * @return {boolean}
 */
const validUrl = (input: string): boolean => {
  const regexStr = /((?:[A-Za-z]{3,9})(?::\/\/|@)(?:(?:[A-Za-z0-9\-.]+[.:])|(?:www\.|[-;:&=+$,\w]+@))(?:[A-Za-z0-9.-]+)(?:[/\-+=&;%@.\w_~()]*)(?:[.!/\\\w-?%#~&=+()]*))/g;
  const regex = new RegExp(regexStr);
  return !!_cleanStr(input).match(regex);
}

/**
 * Is the string input a valid integer?
 * @param {number} input form input
 * @returns {boolean}
 */
const validNumber = (input: number): boolean => {
  const regexStr = /^[0-9]*$/g;
  const regex = new RegExp(regexStr);
  return !!_cleanStr(input).match(regex);
}

export { validUrl, validNumber };
