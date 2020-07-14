"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.btnOpenModalActivity = void 0;
/*------------------
 BUTTON: OPEN MODAL
     ACTIVITY
   with metadata
------------------*/
const btnOpenModalActivity = (metadata) => {
    return {
        "type": "button",
        "text": {
            "type": "plain_text",
            "text": "Open Modal"
        },
        "action_id": "btn_open_modal_activity",
        // Example: metadata can be sent in triggers (e.g., as button value and then is available in modal.ts in body.actions)
        "value": metadata ? JSON.stringify(metadata) : undefined,
        "style": "primary"
    };
};
exports.btnOpenModalActivity = btnOpenModalActivity;
//# sourceMappingURL=btn-open-modal-activity.js.map