"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const accessCodeController_1 = __importDefault(require("../controllers/accessCodeController"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.authenticate);
router.post('/generate', (0, auth_1.authorize)('manager'), accessCodeController_1.default.generateAccessCode);
router.get('/active', (0, auth_1.authorize)('manager'), accessCodeController_1.default.getActiveAccessCodes);
router.get('/history', (0, auth_1.authorize)('manager'), accessCodeController_1.default.getAccessCodeHistory);
router.post('/expire', (0, auth_1.authorize)('manager'), accessCodeController_1.default.expireAccessCode);
exports.default = router;
//# sourceMappingURL=accessCodeRoutes.js.map