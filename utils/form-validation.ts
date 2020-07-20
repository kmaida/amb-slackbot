/*------------------
  FORM VALIDATION
------------------*/

/**
 * Ensure input is string and has no trailing whitespace
 * @param {any} input form input (could be any type, but most likely already a string)
 * @return {string}
 */
const _cleanStr = (input: any): string => {
  return input.toString().trim();
};

/**
 * Is the string input a valid URL?
 * @param {string} input
 * @param {string} domain (optional) domain to check for in link
 * @return {boolean}
 */
const validUrl = (input: string, domain?: string): boolean => {
  const regexStr = /((?:[A-Za-z]{3,9})(?::\/\/|@)(?:(?:[A-Za-z0-9\-.]+[.:])|(?:www\.|[-;:&=+$,\w]+@))(?:[A-Za-z0-9.-]+)(?:[/\-+=&;%@.\w_~()]*)(?:[.!/\\\w-?%#~&=+()]*))/g;
  const regex = new RegExp(regexStr);
  const cleanStr = _cleanStr(input);
  const matchRegex = !!cleanStr.match(regex);
  const includesDomain = domain ? cleanStr.includes(domain) : true;
  return matchRegex && includesDomain;
};

/**
 * Is the string input a valid integer?
 * @param {number} input form input
 * @return {boolean}
 */
const validNumber = (input: number): boolean => {
  const regexStr = /^[0-9]*$/g;
  const regex = new RegExp(regexStr);
  const cleanStr = _cleanStr(input);
  return !!cleanStr.match(regex);
};

/**
 * Does this look like an airport code? (3 letters)
 * @param {string} input form input
 * @return {boolean}
 */
const validAirport = (input: string): boolean => {
  const regexStr = /^[A-Za-z]{3}$/g;
  const regex = new RegExp(regexStr);
  const cleanStr = _cleanStr(input);
  return !!cleanStr.match(regex);
};

/**
 * Is the string formatted sort of like an email address?
 * @param {string} input https://stackoverflow.com/a/38137215
 * @return {boolean}
 */
const emailIsh = (input: string): boolean => {
  const regexStr = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+[^<>()\.,;:\s@\"]{2,})$/g;
  const regex = new RegExp(regexStr);
  const cleanStr = _cleanStr(input);
  return !!cleanStr.match(regex);
};

/**
 * Compare input date with today's date
 * @param {string} dateInput ISO string date
 * @param {boolean} testFuture Are we testing for a future date? (false = test for past)
 * @param {boolean} futureStartTomorrow Count today as the future?
 * @return {boolean}
 */
const dateCompare = (dateInput: string, testFuture: boolean = false, futureStartTomorrow: boolean = false): boolean => {
  // Get today's date in ISO at 11:59:59
  const now: string = new Date().toISOString().split('T')[0];
  const todayISO: string = now + 'T23:59:59Z';
  const today: Date = new Date(todayISO);
  // Get submitted date in ISO at 11:59:59
  const sDate: Date = new Date(dateInput + 'T23:59:59Z');
  // Compare timestamps for UTC submitted date and UTC today to determine past/future
  // (Today is always valid for past, and valid for future if !futureStartTomorrow)
  const isFuture: boolean = !futureStartTomorrow ? sDate.getTime() >= today.getTime() : sDate.getTime() > today.getTime();
  const isPast: boolean = sDate.getTime() <= today.getTime();
  // Are we checking for a future date or a past date?
  if (testFuture) {
    return isFuture;
  } else {
    return isPast;
  }
};

export { validUrl, validNumber, emailIsh, dateCompare, validAirport };
