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
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      throw new ValidationError('All fields are required');
    }

    // Allow farmer role only if request is authenticated (from field officer)
    const validRoles = ['field_officer', 'finance', 'manager', 'farmer'];
    if (!validRoles.includes(role)) {
      throw new ValidationError('Invalid role specified');
    }

    const db = getDb();

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
}
