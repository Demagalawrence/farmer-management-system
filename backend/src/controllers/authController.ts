import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { getDb } from '../config/db';
import { User } from '../models/User';
import { generateToken } from '../middleware/auth';
import { AuthenticationError, ConflictError, ValidationError } from '../utils/errors';
import { asyncHandler } from '../middleware/errorHandler';
import logger from '../utils/logger';

export class AuthController {
  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    const db = getDb();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Compare password with hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // Remove password from response
    const { password_hash, ...userResponse } = user;

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse,
    });
  });

  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, role, accessCode } = req.body;

    if (!name || !email || !password || !role) {
      throw new ValidationError('All fields are required');
    }

    // Only allow privileged roles through public registration
    // Farmers can only be registered by authenticated Field Officers
    const validRoles = ['field_officer', 'finance', 'manager'];
    if (role === 'farmer') {
      throw new ValidationError('Farmer accounts can only be created by Field Officers. Please contact a Field Officer to register.');
    }
    
    if (!validRoles.includes(role)) {
      throw new ValidationError('Invalid role specified');
    }

    const db = getDb();

    // Validate access code
    if (!accessCode) {
      throw new ValidationError('Access code is required for this role');
    }

    // For manager role, use admin secret instead of dynamic codes
    if (role === 'manager') {
      const adminSecret = process.env.ADMIN_SECRET || 'admin123';
      if (accessCode !== adminSecret) {
        throw new AuthenticationError('Invalid admin secret. Manager accounts require the admin secret to create.');
      }
    } else {
      // For field_officer and finance, use dynamic access codes from database
      const activeCode = await db.collection('access_codes').findOne({
        code: accessCode,
        role: role,
        status: 'active'
      });

      if (!activeCode) {
        throw new AuthenticationError('Invalid or expired access code. Please request a new code from your administrator.');
      }

      // Check if code has expired by time
      if (new Date() > new Date(activeCode.expires_at)) {
        await db.collection('access_codes').updateOne(
          { _id: activeCode._id },
          { $set: { status: 'expired' } }
        );
        throw new AuthenticationError('Access code has expired. Please request a new code from your administrator.');
      }

      // Mark code as used immediately (single-use code)
      await db.collection('access_codes').updateOne(
        { _id: activeCode._id },
        { 
          $set: { 
            status: 'used',
            used_at: new Date(),
            used_by: email
          } 
        }
      );

      // Auto-generate a new code to replace the used one
      const newCode = this.generateAccessCode();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours expiry

      await db.collection('access_codes').insertOne({
        code: newCode,
        role: role,
        status: 'active',
        created_at: new Date(),
        expires_at: expiresAt,
        created_by: 'system_auto',
        used_count: 0
      });

      logger.info(`Auto-generated new ${role} access code: ${newCode} after use by ${email}`);
    }

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser: Omit<User, '_id'> = {
      name,
      email,
      role,
      password_hash: hashedPassword,
      created_at: new Date(),
    };

    const result = await db.collection('users').insertOne(newUser);

    // Generate JWT token for auto-login
    const token = generateToken({
      id: result.insertedId.toString(),
      email: email,
      role: role,
      name: name,
    });

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      token,
      userId: result.insertedId,
    });
  });

  // Get current user profile
  getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AuthenticationError('Not authenticated');
    }

    const db = getDb();
    const user = await db.collection('users').findOne(
      { email: req.user.email },
      { projection: { password_hash: 0 } }
    );

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    res.json({
      success: true,
      user,
    });
  });

  // Change password
  changePassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AuthenticationError('Not authenticated');
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new ValidationError('Current password and new password are required');
    }

    if (newPassword.length < 8) {
      throw new ValidationError('New password must be at least 8 characters long');
    }

    const db = getDb();
    const user = await db.collection('users').findOne({ email: req.user.email });

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);

    if (!isPasswordValid) {
      throw new AuthenticationError('Current password is incorrect');
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await db.collection('users').updateOne(
      { email: req.user.email },
      { $set: { password_hash: hashedPassword } }
    );

    logger.info(`Password changed for user: ${req.user.email}`);

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  });

  // Helper method to generate random access code
  private generateAccessCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }
}
