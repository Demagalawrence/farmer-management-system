import request from 'supertest';
import express, { Application } from 'express';
import authRoutes from '../routes/authRoutes';
import { errorHandler } from '../middleware/errorHandler';

// Mock database connection
jest.mock('../config/db', () => ({
  getDb: jest.fn(() => ({
    collection: jest.fn(() => ({
      findOne: jest.fn(),
      insertOne: jest.fn(),
      updateOne: jest.fn(),
    })),
  })),
}));

// Mock logger
jest.mock('../utils/logger', () => ({
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    http: jest.fn(),
  },
}));

describe('Auth Controller Tests', () => {
  let app: Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
    app.use(errorHandler);
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const { getDb } = require('../config/db');
      const mockCollection = {
        findOne: jest.fn().mockResolvedValue(null),
        insertOne: jest.fn().mockResolvedValue({ insertedId: '123' }),
      };
      getDb.mockReturnValue({
        collection: jest.fn(() => mockCollection),
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Test@1234',
          role: 'farmer',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    });

    it('should return error for duplicate email', async () => {
      const { getDb } = require('../config/db');
      const mockCollection = {
        findOne: jest.fn().mockResolvedValue({ email: 'test@example.com' }),
      };
      getDb.mockReturnValue({
        collection: jest.fn(() => mockCollection),
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Test@1234',
          role: 'farmer',
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });

    it('should return validation error for weak password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'weak',
          role: 'farmer',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return validation error for invalid role', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Test@1234',
          role: 'invalid_role',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return validation error for missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return error for invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
