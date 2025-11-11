"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../config/db");
const auth_1 = require("../middleware/auth");
const errors_1 = require("../utils/errors");
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = __importDefault(require("../utils/logger"));
class AuthController {
    constructor() {
        this.login = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new errors_1.ValidationError('Email and password are required');
            }
            const db = (0, db_1.getDb)();
            const user = await db.collection('users').findOne({ email });
            if (!user) {
                throw new errors_1.AuthenticationError('Invalid email or password');
            }
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password_hash);
            if (!isPasswordValid) {
                throw new errors_1.AuthenticationError('Invalid email or password');
            }
            const token = (0, auth_1.generateToken)({
                id: user._id.toString(),
                email: user.email,
                role: user.role,
                name: user.name,
            });
            const { password_hash, ...userResponse } = user;
            logger_1.default.info(`User logged in: ${email}`);
            res.json({
                success: true,
                message: 'Login successful',
                token,
                user: userResponse,
            });
        });
        this.register = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { name, email, password, role, accessCode } = req.body;
            if (!name || !email || !password || !role) {
                throw new errors_1.ValidationError('All fields are required');
            }
            const validRoles = ['field_officer', 'finance', 'manager'];
            if (role === 'farmer') {
                throw new errors_1.ValidationError('Farmer accounts can only be created by Field Officers. Please contact a Field Officer to register.');
            }
            if (!validRoles.includes(role)) {
                throw new errors_1.ValidationError('Invalid role specified');
            }
            const db = (0, db_1.getDb)();
            if (!accessCode) {
                throw new errors_1.ValidationError('Access code is required for this role');
            }
            if (role === 'manager') {
                const adminSecret = process.env.ADMIN_SECRET || 'admin123';
                if (accessCode !== adminSecret) {
                    throw new errors_1.AuthenticationError('Invalid admin secret. Manager accounts require the admin secret to create.');
                }
            }
            else {
                const activeCode = await db.collection('access_codes').findOne({
                    code: accessCode,
                    role: role,
                    status: 'active'
                });
                if (!activeCode) {
                    throw new errors_1.AuthenticationError('Invalid or expired access code. Please request a new code from your administrator.');
                }
                if (new Date() > new Date(activeCode.expires_at)) {
                    await db.collection('access_codes').updateOne({ _id: activeCode._id }, { $set: { status: 'expired' } });
                    throw new errors_1.AuthenticationError('Access code has expired. Please request a new code from your administrator.');
                }
                await db.collection('access_codes').updateOne({ _id: activeCode._id }, {
                    $set: {
                        status: 'used',
                        used_at: new Date(),
                        used_by: email
                    }
                });
                const newCode = this.generateAccessCode();
                const expiresAt = new Date();
                expiresAt.setHours(expiresAt.getHours() + 24);
                await db.collection('access_codes').insertOne({
                    code: newCode,
                    role: role,
                    status: 'active',
                    created_at: new Date(),
                    expires_at: expiresAt,
                    created_by: 'system_auto',
                    used_count: 0
                });
                logger_1.default.info(`Auto-generated new ${role} access code: ${newCode} after use by ${email}`);
            }
            const existingUser = await db.collection('users').findOne({ email });
            if (existingUser) {
                throw new errors_1.ConflictError('User with this email already exists');
            }
            const saltRounds = 10;
            const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
            const newUser = {
                name,
                email,
                role,
                password_hash: hashedPassword,
                created_at: new Date(),
            };
            const result = await db.collection('users').insertOne(newUser);
            const token = (0, auth_1.generateToken)({
                id: result.insertedId.toString(),
                email: email,
                role: role,
                name: name,
            });
            logger_1.default.info(`New user registered: ${email}`);
            res.status(201).json({
                success: true,
                message: 'User created successfully',
                token,
                userId: result.insertedId,
            });
        });
        this.getProfile = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            if (!req.user) {
                throw new errors_1.AuthenticationError('Not authenticated');
            }
            const db = (0, db_1.getDb)();
            const user = await db.collection('users').findOne({ email: req.user.email }, { projection: { password_hash: 0 } });
            if (!user) {
                throw new errors_1.AuthenticationError('User not found');
            }
            res.json({
                success: true,
                user,
            });
        });
        this.changePassword = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            if (!req.user) {
                throw new errors_1.AuthenticationError('Not authenticated');
            }
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                throw new errors_1.ValidationError('Current password and new password are required');
            }
            if (newPassword.length < 8) {
                throw new errors_1.ValidationError('New password must be at least 8 characters long');
            }
            const db = (0, db_1.getDb)();
            const user = await db.collection('users').findOne({ email: req.user.email });
            if (!user) {
                throw new errors_1.AuthenticationError('User not found');
            }
            const isPasswordValid = await bcrypt_1.default.compare(currentPassword, user.password_hash);
            if (!isPasswordValid) {
                throw new errors_1.AuthenticationError('Current password is incorrect');
            }
            const saltRounds = 10;
            const hashedPassword = await bcrypt_1.default.hash(newPassword, saltRounds);
            await db.collection('users').updateOne({ email: req.user.email }, { $set: { password_hash: hashedPassword } });
            logger_1.default.info(`Password changed for user: ${req.user.email}`);
            res.json({
                success: true,
                message: 'Password changed successfully',
            });
        });
    }
    generateAccessCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return code;
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map