import { IObjectAny } from '../utils/types';

/*------------------
 BUTTON: OPEN MODAL
     PROFILE
------------------*/

const btnOpenModalProfile = (): IObjectAny => {
  return {
    "type": "button",
    "text": {
      "type": "plain_text",
      "text": "Manage Profile"
    },
    "action_id": "btn_open_modal_profile",
    "style": "primary"
  };
}

export { btnOpenModalProfile };
