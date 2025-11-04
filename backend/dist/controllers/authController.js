"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const db_1 = require("../config/db");
class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email and password are required'
                });
            }
            const db = (0, db_1.getDb)();
            const user = await db.collection('users').findOne({ email });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }
            if (user.password_hash !== password) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }
            const { password_hash, ...userResponse } = user;
            res.json({
                success: true,
                message: 'Login successful',
                user: userResponse
            });
        }
        catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    async register(req, res) {
        try {
            const { name, email, password, role } = req.body;
            if (!name || !email || !password || !role) {
                return res.status(400).json({
                    success: false,
                    message: 'All fields are required'
                });
            }
            const validRoles = ['farmer', 'field_officer', 'finance', 'manager'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid role specified'
                });
            }
            const db = (0, db_1.getDb)();
            const existingUser = await db.collection('users').findOne({ email });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'User with this email already exists'
                });
            }
            const newUser = {
                name,
                email,
                role,
                password_hash: password,
                created_at: new Date()
            };
            const result = await db.collection('users').insertOne(newUser);
            res.status(201).json({
                success: true,
                message: 'User created successfully',
                userId: result.insertedId
            });
        }
        catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map