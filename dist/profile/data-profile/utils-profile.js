"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileSlackMsg = void 0;
/*------------------
    PROFILE UTILS
------------------*/
/**
 * Output text for profile display in Slack messages
 * @param {IProfile} data profile data
 * @param {boolean} isPublic (optional) is this a public message?
 */
const profileSlackMsg = (data, isPublic) => {
    const required = `*Name:* ${data.name}\n*Location:* ${data.location}\n*Bio:* ${data.bio}\n`;
    const email = `\n*Email*: ${data.email}`;
    const website = data.website ? `\n*Website:* ${data.website}` : '';
    const twitter = data.twitter ? `\n*Twitter:* ${data.twitter}` : '';
    const github = data.github ? `\n*GitHub:* ${data.github}` : '';
    const airport = data.airport ? `\n*Airport Code:* ${data.airport}` : '';
    const airline = data.airline ? `\n*Preferred Airline:* ${data.airline}` : '';
    const ff = data.ff ? `\n*Frequent Flyer:* ${data.ff}` : '';
    const publicMsg = required + website + twitter + github;
    const privateMsg = publicMsg + email + airport + airline + ff;
    return isPublic ? publicMsg : privateMsg;
};
exports.profileSlackMsg = profileSlackMsg;
//# sourceMappingURL=utils-profile.js.map