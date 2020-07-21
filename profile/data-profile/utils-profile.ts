import { IProfile } from '../profile.interface';

/*------------------
    PROFILE UTILS
------------------*/

/**
 * Output text for profile display in Slack messages
 * @param {IProfile} data profile data
 * @param {boolean} isPublic (optional) is this a public message?
 */
const profileSlackMsg = (data: IProfile, isPublic?: boolean): string => {
  // Public
  const required = `*Name:* ${data.name}\n*Location:* ${data.location}\n*Bio:* ${data.bio}\n*Expertise:* ${data.expertise}`;
  const website = data.website ? `\n*Website:* ${data.website}` : '';
  const twitter = data.twitter ? `\n*Twitter:* ${data.twitter}` : '';
  const github = data.github ? `\n*GitHub:* ${data.github}` : '';
  // Private
  const email = `\n_*Email*: ${data.email}_`;
  const airport = data.airport ? `\n_*Airport Code:* ${data.airport}_` : '';
  const airline = data.airline ? `\n_*Preferred Airline:* ${data.airline}_` : '';
  const ff = data.ff ? `\n_*Frequent Flyer:* ${data.ff}_` : '';
  // Compose
  const publicMsg = required + website + twitter + github;
  const privateMsg = publicMsg + email + airport + airline + ff;
  // Return appropriate public or private message
  return isPublic ? publicMsg : privateMsg;
};

export { profileSlackMsg };
