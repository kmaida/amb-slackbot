"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blocksModalActivity = void 0;
/*------------------
 BLOCKS: MODAL FORM
------------------*/
const blocksModalActivity = (prefill = {}) => {
    const initialType = prefill.type ? {
        "text": {
            "type": "plain_text",
            "text": prefill.type
        },
        "value": prefill.type
    } : undefined;
    return [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `Please use the form below to record a completed Ambassador activity. You're awesome — thank you for your contribution! :tada:`
            }
        },
        {
            "type": "input",
            "block_id": "ba_name",
            "element": {
                "type": "plain_text_input",
                "action_id": "aa_name",
                "placeholder": {
                    "type": "plain_text",
                    "text": "Firstname Lastname"
                }
            },
            "label": {
                "type": "plain_text",
                "text": "Name:"
            },
            "hint": {
                "type": "plain_text",
                "text": "Your full name."
            }
        },
        {
            "type": "input",
            "block_id": "ba_email",
            "element": {
                "type": "plain_text_input",
                "action_id": "aa_email",
                "placeholder": {
                    "type": "plain_text",
                    "text": "you@domain.com"
                }
            },
            "label": {
                "type": "plain_text",
                "text": "Email:"
            },
            "hint": {
                "type": "plain_text",
                "text": "Email address we should contact you at if there are any questions about this activity."
            }
        },
        {
            "type": "input",
            "block_id": "ba_type",
            "element": {
                "action_id": "aa_type",
                "type": "static_select",
                "placeholder": {
                    "type": "plain_text",
                    "text": "Choose activity type"
                },
                "initial_option": initialType,
                "options": [
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "Speaking"
                        },
                        "value": "Speaking"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "Event Organization"
                        },
                        "value": "Organizing"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "Podcast"
                        },
                        "value": "Podcast"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "Written Content"
                        },
                        "value": "Written Content"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "Video Content"
                        },
                        "value": "Video Content"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "OSS Contribution"
                        },
                        "value": "OSS Contribution"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "Community Support"
                        },
                        "value": "Community Support"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "Other"
                        },
                        "value": "Other"
                    }
                ]
            },
            "label": {
                "type": "plain_text",
                "text": "Type of Activity:"
            },
            "hint": {
                "type": "plain_text",
                "text": "What kind of activity was this? (If other, please add details in the Topic field.)"
            }
        },
        {
            "type": "input",
            "block_id": "ba_title",
            "element": {
                "type": "plain_text_input",
                "action_id": "aa_title",
                "placeholder": {
                    "type": "plain_text",
                    "text": "My Great Gatsby Blog Post"
                }
            },
            "label": {
                "type": "plain_text",
                "text": "Title:"
            },
            "hint": {
                "type": "plain_text",
                "text": "Title of your activity (e.g., name of event, blog post, video, GitHub contribution, etc.)."
            }
        },
        {
            "type": "input",
            "block_id": "ba_url",
            "element": {
                "type": "plain_text_input",
                "action_id": "aa_url",
                "placeholder": {
                    "type": "plain_text",
                    "text": "https://"
                }
            },
            "label": {
                "type": "plain_text",
                "text": "URL:"
            },
            "hint": {
                "type": "plain_text",
                "text": "Provide a link supporting this activity (e.g., event URL, link to blog post or video, PR, etc.)."
            }
        },
        {
            "type": "input",
            "block_id": "ba_date",
            "element": {
                "type": "datepicker",
                "action_id": "aa_date",
                "placeholder": {
                    "type": "plain_text",
                    "text": "Select activity date"
                },
                "initial_date": prefill.date
            },
            "label": {
                "type": "plain_text",
                "text": "Date:"
            },
            "hint": {
                "type": "plain_text",
                "text": "When was this activity completed / published? Dates must be in the past."
            }
        },
        {
            "type": "input",
            "block_id": "ba_topic",
            "element": {
                "type": "plain_text_input",
                "action_id": "aa_topic",
                "multiline": true,
                "placeholder": {
                    "type": "plain_text",
                    "text": "Describe this activity."
                }
            },
            "label": {
                "type": "plain_text",
                "text": "Topic:"
            },
            "hint": {
                "type": "plain_text",
                "text": "Please describe this activity and its topic as well as how it relates to Gatsby and/or the Gatsby community."
            }
        },
        {
            "type": "input",
            "block_id": "ba_reach",
            "element": {
                "type": "plain_text_input",
                "action_id": "aa_reach",
                "placeholder": {
                    "type": "plain_text",
                    "text": "# of people"
                },
                "initial_value": prefill.reach ? prefill.reach.toString() : undefined
            },
            "label": {
                "type": "plain_text",
                "text": "Estimated Reach:"
            },
            "hint": {
                "type": "plain_text",
                "text": "Roughly how many people have you reached so far via this activity? (We understand this number may change over time.)"
            }
        }
    ];
};
exports.blocksModalActivity = blocksModalActivity;
//# sourceMappingURL=blocks-modal-activity.js.map