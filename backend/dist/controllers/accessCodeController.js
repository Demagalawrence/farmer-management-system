"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
const errorHandler_1 = require("../middleware/errorHandler");
const errors_1 = require("../utils/errors");
const crypto_1 = __importDefault(require("crypto"));
class AccessCodeController {
    constructor() {
        this.generateAccessCode = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { role } = req.body;
            const userId = req.user?.userId;
            const userEmail = req.user?.email;
            if (!role) {
                throw new errors_1.ValidationError('Role is required');
            }
            const validRoles = ['field_officer', 'finance', 'manager'];
            if (!validRoles.includes(role)) {
                throw new errors_1.ValidationError('Invalid role specified');
            }
            const db = (0, db_1.getDb)();
            await db.collection('access_codes').updateMany({ role, status: 'active' }, {
                $set: {
                    status: 'expired',
                    expires_at: new Date()
                }
            });
            const code = crypto_1.default.randomBytes(4).toString('hex').toUpperCase();
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 24);
            const newAccessCode = {
                role: role,
                code,
                status: 'active',
                created_at: new Date(),
                expires_at: expiresAt,
                created_by: userEmail || userId
            };
            await db.collection('access_codes').insertOne(newAccessCode);
            res.status(201).json({
                success: true,
                message: 'Access code generated successfully',
                data: {
                    role,
                    code,
                    expires_at: expiresAt,
                    status: 'active'
                }
            });
        });
        this.getActiveAccessCodes = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const db = (0, db_1.getDb)();
            const accessCodes = await db.collection('access_codes')
                .find({ status: 'active' })
                .sort({ created_at: -1 })
                .toArray();
            const codesByRole = {};
            accessCodes.forEach((code) => {
                if (!codesByRole[code.role] || new Date(code.created_at) > new Date(codesByRole[code.role].created_at)) {
                    codesByRole[code.role] = code;
                }
            });
            const formattedCodes = Object.values(codesByRole).map((code) => ({
                role: code.role,
                code: code.code,
                status: code.status,
                expires_at: code.expires_at,
                created_at: code.created_at,
                time_remaining: Math.max(0, Math.floor((new Date(code.expires_at).getTime() - Date.now()) / 1000))
            }));
            res.status(200).json({
                success: true,
                data: formattedCodes
            });
        });
        this.validateAndUseCode = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { code, role, userEmail } = req.body;
            if (!code || !role) {
                throw new errors_1.ValidationError('Code and role are required');
            }
            const db = (0, db_1.getDb)();
            const accessCode = await db.collection('access_codes').findOne({
                code,
                role,
                status: 'active'
            });
            if (!accessCode) {
                throw new errors_1.AuthenticationError('Invalid or expired access code');
            }
            if (new Date() > new Date(accessCode.expires_at)) {
                await db.collection('access_codes').updateOne({ _id: accessCode._id }, { $set: { status: 'expired' } });
                throw new errors_1.AuthenticationError('Access code has expired');
            }
            await db.collection('access_codes').updateOne({ _id: accessCode._id }, {
                $set: {
                    status: 'used',
                    used_at: new Date(),
                    used_by: userEmail
                }
            });
            res.status(200).json({
                success: true,
                message: 'Access code validated and expired',
                data: { valid: true }
            });
        });
        this.getAccessCodeHistory = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const db = (0, db_1.getDb)();
            const history = await db.collection('access_codes')
                .find({})
                .sort({ created_at: -1 })
                .limit(50)
                .toArray();
            res.status(200).json({
                success: true,
                data: history
            });
        });
        this.expireAccessCode = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { code } = req.body;
            if (!code) {
                throw new errors_1.ValidationError('Code is required');
            }
            const db = (0, db_1.getDb)();
            const result = await db.collection('access_codes').updateOne({ code, status: 'active' }, {
                $set: {
                    status: 'expired',
                    expires_at: new Date()
                }
            });
            if (result.matchedCount === 0) {
                throw new errors_1.ValidationError('Code not found or already expired');
            }
            res.status(200).json({
                success: true,
                message: 'Access code expired successfully'
            });
        });
    }
}
exports.default = new AccessCodeController();
//# sourceMappingURL=accessCodeController.js.map