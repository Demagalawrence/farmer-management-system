import { Request, Response } from 'express';
import { getDb } from '../config/db';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticationError, ValidationError } from '../utils/errors';
import { AccessCode } from '../models/AccessCode';
import crypto from 'crypto';

class AccessCodeController {
  // Generate a new access code for a role
  generateAccessCode = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { role } = req.body;
    const userId = (req as any).user?.userId;
    const userEmail = (req as any).user?.email;

    if (!role) {
      throw new ValidationError('Role is required');
    }

    const validRoles = ['field_officer', 'finance', 'manager'];
    if (!validRoles.includes(role)) {
      throw new ValidationError('Invalid role specified');
    }

    const db = getDb();
    
    // Expire all previous active codes for this role
    await db.collection('access_codes').updateMany(
      { role, status: 'active' },
      { 
        $set: { 
          status: 'expired',
          expires_at: new Date()
        } 
      }
    );

    // Generate new secure code (8 characters, alphanumeric)
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    
    // Set expiration time (24 hours for now, but will expire on first use)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const newAccessCode: AccessCode = {
      role: role as 'field_officer' | 'finance' | 'manager',
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

  // Get all active access codes (for manager dashboard)
  getActiveAccessCodes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const db = getDb();
    
    const accessCodes = await db.collection('access_codes')
      .find({ status: 'active' })
      .sort({ created_at: -1 })
      .toArray();

    // Group by role, get the latest for each
    const codesByRole: { [key: string]: any } = {};
    
    accessCodes.forEach((code: any) => {
      if (!codesByRole[code.role] || new Date(code.created_at) > new Date(codesByRole[code.role].created_at)) {
        codesByRole[code.role] = code;
      }
    });

    const formattedCodes = Object.values(codesByRole).map((code: any) => ({
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

  // Validate and mark code as used
  validateAndUseCode = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { code, role, userEmail } = req.body;

    if (!code || !role) {
      throw new ValidationError('Code and role are required');
    }

    const db = getDb();
    
    // Find active code
    const accessCode = await db.collection('access_codes').findOne({
      code,
      role,
      status: 'active'
    }) as AccessCode | null;

    if (!accessCode) {
      throw new AuthenticationError('Invalid or expired access code');
    }

    // Check if expired by time
    if (new Date() > new Date(accessCode.expires_at)) {
      await db.collection('access_codes').updateOne(
        { _id: accessCode._id },
        { $set: { status: 'expired' } }
      );
      throw new AuthenticationError('Access code has expired');
    }

    // Mark code as used (expires immediately after use)
    await db.collection('access_codes').updateOne(
      { _id: accessCode._id },
      { 
        $set: { 
          status: 'used',
          used_at: new Date(),
          used_by: userEmail
        } 
      }
    );

    res.status(200).json({
      success: true,
      message: 'Access code validated and expired',
      data: { valid: true }
    });
  });

  // Get access code usage history
  getAccessCodeHistory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const db = getDb();
    
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

  // Manually expire a code
  expireAccessCode = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { code } = req.body;

    if (!code) {
      throw new ValidationError('Code is required');
    }

    const db = getDb();
    
    const result = await db.collection('access_codes').updateOne(
      { code, status: 'active' },
      { 
        $set: { 
          status: 'expired',
          expires_at: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      throw new ValidationError('Code not found or already expired');
    }

    res.status(200).json({
      success: true,
      message: 'Access code expired successfully'
    });
  });
}

export default new AccessCodeController();
