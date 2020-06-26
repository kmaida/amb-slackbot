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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __importDefault(require("./../utils/utils"));
const errors_1 = __importDefault(require("./../utils/errors"));
/*------------------
  MODAL VIEW SUBMIT
------------------*/
const submitModal = (app, at) => {
    // Modal view submitted
    app.view('add_airtable_data', ({ ack, body, view }) => __awaiter(void 0, void 0, void 0, function* () {
        const userID = body.user.id;
        const metadata = view.private_metadata ? JSON.parse(view.private_metadata) : {};
        console.log('Metadata received from modal form:', metadata);
        const payload = view.state.values;
        // Capture data from modal interactions
        // Modal blocks data format: payload.[block_id].[action_id].value
        const data = {
            name: payload.b_name.a_name.value,
            url: payload.b_url.a_url.value,
            notes: payload.b_notes.a_notes.value || '',
            slackID: userID
        };
        // Validate form fields and handle errors
        // https://api.slack.com/surfaces/modals/using#displaying_errors#displaying_errors
        const ackParams = {
            response_action: 'errors',
            errors: {}
        };
        if (!utils_1.default.validUrl(data.url)) {
            ackParams.errors.b_url = 'Please provide a valid URL.';
        }
        if (utils_1.default.objNotEmpty(ackParams.errors)) {
            yield ack(ackParams);
            return;
        }
        yield ack();
        // Save data to Airtable
        try {
            const saveData = yield at.saveData(app, data);
        }
        catch (err) {
            errors_1.default.slackErr(app, userID, err);
        }
    }));
};
exports.default = submitModal;
//# sourceMappingURL=modal-view-submit.js.map