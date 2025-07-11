const jwt = require('jsonwebtoken');
const userService = require('./userService');
const { ErrorFactory } = require('../utils/errors');
const config = require('../config/config');
const logger = require('../utils/logger');

/**
 * Authentication service
 */
class AuthService {
  /**
   * Register a new user
   */
  async register(userData) {
    const { username, email, password, firstName, lastName } = userData;

    // Check if user already exists
    if (userService.emailExists(email)) {
      throw ErrorFactory.conflict('Email already registered');
    }

    if (userService.usernameExists(username)) {
      throw ErrorFactory.conflict('Username already taken');
    }

    // Create user
    const user = await userService.create({
      username,
      email,
      password,
      firstName,
      lastName,
    });

    logger.info('User registered successfully', { userId: user.id, email: user.email });

    // Generate tokens
    const tokens = this.generateTokens(user);

    return {
      user: user.toSafeJSON(),
      tokens,
    };
  }

  /**
   * Login user
   */
  async login(credentials) {
    const { email, password } = credentials;

    // Find user by email
    const user = userService.findByEmail(email);
    if (!user) {
      throw ErrorFactory.unauthorized('Invalid credentials');
    }

    // Check if user is locked
    if (user.isLocked()) {
      throw ErrorFactory.unauthorized('Account temporarily locked due to failed login attempts');
    }

    // Check if user is active
    if (!user.isActive) {
      throw ErrorFactory.unauthorized('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      user.incLoginAttempts();
      userService.update(user.id, user);
      throw ErrorFactory.unauthorized('Invalid credentials');
    }

    // Reset login attempts on successful login
    user.resetLoginAttempts();
    userService.update(user.id, user);

    logger.info('User logged in successfully', { userId: user.id, email: user.email });

    // Generate tokens
    const tokens = this.generateTokens(user);

    return {
      user: user.toSafeJSON(),
      tokens,
    };
  }

  /**
   * Generate JWT tokens
   */
  generateTokens(user) {
    const payload = user.toJWTPayload();

    const accessToken = jwt.sign(
      payload,
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      config.jwt.secret,
      { expiresIn: '7d' }
    );

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: config.jwt.expiresIn,
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.secret);
      const user = userService.findById(decoded.userId);

      if (!user) {
        throw ErrorFactory.unauthorized('Invalid refresh token');
      }

      if (!user.isActive) {
        throw ErrorFactory.unauthorized('Account is deactivated');
      }

      // Generate new tokens
      const tokens = this.generateTokens(user);

      return {
        user: user.toSafeJSON(),
        tokens,
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw ErrorFactory.unauthorized('Refresh token expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw ErrorFactory.unauthorized('Invalid refresh token');
      }
      throw error;
    }
  }

  /**
   * Logout user (in a real app, you'd blacklist the token)
   */
  async logout(userId) {
    const user = userService.findById(userId);
    if (!user) {
      throw ErrorFactory.notFound('User not found');
    }

    logger.info('User logged out successfully', { userId: user.id, email: user.email });

    return {
      message: 'Logged out successfully',
    };
  }

  /**
   * Verify token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw ErrorFactory.unauthorized('Token expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw ErrorFactory.unauthorized('Invalid token');
      }
      throw error;
    }
  }

  /**
   * Get current user from token
   */
  getCurrentUser(token) {
    const decoded = this.verifyToken(token);
    const user = userService.findById(decoded.id);
    
    if (!user) {
      throw ErrorFactory.unauthorized('User not found');
    }

    if (!user.isActive) {
      throw ErrorFactory.unauthorized('Account is deactivated');
    }

    return user;
  }
}

module.exports = new AuthService();
