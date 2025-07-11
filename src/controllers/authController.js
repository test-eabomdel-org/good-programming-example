const authService = require('../services/authService');
const { asyncHandler } = require('../middleware/errorMiddleware');
const logger = require('../utils/logger');

/**
 * Authentication controller
 */
class AuthController {
  /**
   * Register a new user
   * @route POST /api/v1/auth/register
   */
  register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);

    logger.info('User registration successful', { 
      userId: result.user.id, 
      email: result.user.email 
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  });

  /**
   * Login user
   * @route POST /api/v1/auth/login
   */
  login = asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);

    logger.info('User login successful', { 
      userId: result.user.id, 
      email: result.user.email 
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  });

  /**
   * Refresh access token
   * @route POST /api/v1/auth/refresh
   */
  refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);

    logger.info('Token refresh successful', { 
      userId: result.user.id 
    });

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: result,
    });
  });

  /**
   * Logout user
   * @route POST /api/v1/auth/logout
   */
  logout = asyncHandler(async (req, res) => {
    const result = await authService.logout(req.user.id);

    logger.info('User logout successful', { 
      userId: req.user.id 
    });

    res.status(200).json({
      success: true,
      message: 'Logout successful',
      data: result,
    });
  });
}

module.exports = new AuthController();
