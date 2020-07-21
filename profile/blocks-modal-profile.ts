import { IProfilePrefill } from './profile.interface';
import { IObjectAny } from '../utils/types';

/*------------------
 BLOCKS: MODAL PROFILE
------------------*/

const blocksModalProfile = (prefill: IProfilePrefill = {}) => {
  const placeholderName = prefill.name ? prefill.name : '[Name]';
  return [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `You have a public profile and a private profile. Private profile information is visible only to Gatsby Ambassador program administrators.`
      }
    },
    {
      "type": "input",
      "block_id": "bp_name",
      "element": {
        "type": "plain_text_input",
        "action_id": "ap_name",
        "placeholder": {
          "type": "plain_text",
          "text": "Firstname Lastname"
        },
        "initial_value": prefill.name
      },
      "label": {
        "type": "plain_text",
        "text": "Name:"
      },
      "hint": {
        "type": "plain_text",
        "text": "Your full name as you would like it displayed publicly to the community and internally for booking, events, etc."
      }
    },
    {
      "type": "input",
      "block_id": "bp_image",
      "element": {
        "type": "plain_text_input",
        "action_id": "ap_image",
        "placeholder": {
          "type": "plain_text",
          "text": "https://[...jpg]"
        },
        "initial_value": prefill.image
      },
      "label": {
        "type": "plain_text",
        "text": "Image URL:"
      },
      "hint": {
        "type": "plain_text",
        "text": "Please provide a link to your desired profile image."
      }
    },
    {
      "type": "input",
      "block_id": "bp_email",
      "element": {
        "type": "plain_text_input",
        "action_id": "ap_email",
        "placeholder": {
          "type": "plain_text",
          "text": "you@domain.com"
        },
        "initial_value": prefill.email
      },
      "label": {
        "type": "plain_text",
        "text": "Email:"
      },
      "hint": {
        "type": "plain_text",
        "text": "Email address is for internal contact only, and will never be displayed publicly."
      }
    },
    {
      "type": "input",
      "block_id": "bp_location",
      "element": {
        "type": "plain_text_input",
        "action_id": "ap_location",
        "placeholder": {
          "type": "plain_text",
          "text": "City, [State/Province], Country"
        },
        "initial_value": prefill.location
      },
      "label": {
        "type": "plain_text",
        "text": "Location:"
      },
      "hint": {
        "type": "plain_text",
        "text": "Where are you based out of?"
      }
    },
    {
      "type": "input",
      "block_id": "bp_bio",
      "element": {
        "type": "plain_text_input",
        "action_id": "ap_bio",
        "multiline": true,
        "placeholder": {
          "type": "plain_text",
          "text": `${placeholderName} enjoys [...].`
        },
        "initial_value": prefill.bio
      },
      "label": {
        "type": "plain_text",
        "text": "Bio:"
      },
      "hint": {
        "type": "plain_text",
        "text": "Please enter your bio, preferably using third person."
      }
    },
    {
      "type": "input",
      "block_id": "bp_expertise",
      "element": {
        "type": "plain_text_input",
        "action_id": "ap_expertise",
        "multiline": true,
        "placeholder": {
          "type": "plain_text",
          "text": `${placeholderName} works at [...] and specializes in [...].`
        },
        "initial_value": prefill.expertise
      },
      "label": {
        "type": "plain_text",
        "text": "Expertise:"
      },
      "hint": {
        "type": "plain_text",
        "text": "Share your areas of expertise and professional experience, preferably using third person."
      }
    },
    {
      "type": "input",
      "block_id": "bp_website",
      "element": {
        "type": "plain_text_input",
        "action_id": "ap_website",
        "placeholder": {
          "type": "plain_text",
          "text": "https://"
        },
        "initial_value": prefill.website
      },
      "label": {
        "type": "plain_text",
        "text": "Personal Website:"
      },
      "hint": {
        "type": "plain_text",
        "text": "Provide a link to your personal website."
      },
      "optional": true
    },
    {
      "type": "input",
      "block_id": "bp_twitter",
      "element": {
        "type": "plain_text_input",
        "action_id": "ap_twitter",
        "placeholder": {
          "type": "plain_text",
          "text": "https://twitter.com/[TwitterUsername]"
        },
        "initial_value": prefill.twitter
      },
      "label": {
        "type": "plain_text",
        "text": "Twitter URL:"
      },
      "hint": {
        "type": "plain_text",
        "text": "Provide the URL for your Twitter profile."
      },
      "optional": true
    },
    {
      "type": "input",
      "block_id": "bp_github",
      "element": {
        "type": "plain_text_input",
        "action_id": "ap_github",
        "placeholder": {
          "type": "plain_text",
          "text": "https://github.com/[GitHubUsername]"
        },
        "initial_value": prefill.github
      },
      "label": {
        "type": "plain_text",
        "text": "GitHub URL:"
      },
      "hint": {
        "type": "plain_text",
        "text": "Provide the URL for your GitHub page."
      },
      "optional": true
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `*Private Travel Information:* We ask for your air travel defaults so that we can more easily and quickly book flights for you, should you need them. This information will never be made public. Identifying data such as passport number, Global Entry pass ID, etc. will be requested _at the time_ a flight is booked.`
      }
    },
    {
      "type": "input",
      "block_id": "bp_airport",
      "element": {
        "type": "plain_text_input",
        "action_id": "ap_airport",
        "placeholder": {
          "type": "plain_text",
          "text": "E.g., DTW"
        },
        "min_length": 3,
        "max_length": 3,
        "initial_value": prefill.airport
      },
      "label": {
        "type": "plain_text",
        "text": "Airport Code (3 letters):"
      },
      "hint": {
        "type": "plain_text",
        "text": "What is the airport code for your primary airport? This should be the airport you would fly out of most frequently."
      },
      "optional": true
    },
    {
      "type": "input",
      "block_id": "bp_airline",
      "element": {
        "type": "plain_text_input",
        "action_id": "ap_airline",
        "placeholder": {
          "type": "plain_text",
          "text": "E.g., Delta"
        },
        "max_length": 24,
        "initial_value": prefill.airline
      },
      "label": {
        "type": "plain_text",
        "text": "Preferred Airline:"
      },
      "hint": {
        "type": "plain_text",
        "text": "Do you have a specific airline you prefer to fly? Please note that there is no guarantee we'll be able to book your preferred airline for any given trip (given cost, route availability, etc.), but we will always review your preferred airline options."
      },
      "optional": true
    },
    {
      "type": "input",
      "block_id": "bp_ff",
      "element": {
        "type": "plain_text_input",
        "action_id": "ap_ff",
        "placeholder": {
          "type": "plain_text",
          "text": "123456"
        },
        "max_length": 36,
        "initial_value": prefill.ff
      },
      "label": {
        "type": "plain_text",
        "text": "Frequent Flyer Account:"
      },
      "hint": {
        "type": "plain_text",
        "text": "If you've provided a preferred airline, you can also provide a frequent flyer account for that airline."
      },
      "optional": true
    }
  ];
}

export { blocksModalProfile };