const userService = require('../services/userService');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { ErrorFactory } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * User controller
 */
class UserController {
  /**
   * Get all users with pagination and filtering
   * @route GET /api/v1/users
   */
  getUsers = asyncHandler(async (req, res) => {
    const result = userService.findAll(req.query);

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users: result.users.map(user => user.toSafeJSON()),
        pagination: {
          totalUsers: result.totalUsers,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage,
        },
      },
    });
  });

  /**
   * Get current user profile
   * @route GET /api/v1/users/profile
   */
  getCurrentUser = asyncHandler(async (req, res) => {
    const user = userService.findById(req.user.id);
    
    if (!user) {
      throw ErrorFactory.notFound('User not found');
    }

    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: {
        user: user.toSafeJSON(),
      },
    });
  });

  /**
   * Get user by ID
   * @route GET /api/v1/users/:id
   */
  getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = userService.findById(id);

    if (!user) {
      throw ErrorFactory.notFound('User not found');
    }

    // Check if user is admin or accessing their own profile
    if (req.user.role !== 'admin' && req.user.id !== id) {
      throw ErrorFactory.forbidden('Access denied');
    }

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: {
        user: user.toSafeJSON(),
      },
    });
  });

  /**
   * Update current user profile
   * @route PUT /api/v1/users/profile
   */
  updateCurrentUser = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const updateData = req.body;

    // Check if username is being changed and if it's already taken
    if (updateData.username) {
      const existingUser = userService.findByUsername(updateData.username);
      if (existingUser && existingUser.id !== userId) {
        throw ErrorFactory.conflict('Username already taken');
      }
    }

    const updatedUser = userService.update(userId, updateData);

    logger.info('User profile updated', { 
      userId: updatedUser.id, 
      email: updatedUser.email 
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser.toSafeJSON(),
      },
    });
  });

  /**
   * Update user by ID (Admin only)
   * @route PUT /api/v1/users/:id
   */
  updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    // Check if username is being changed and if it's already taken
    if (updateData.username) {
      const existingUser = userService.findByUsername(updateData.username);
      if (existingUser && existingUser.id !== id) {
        throw ErrorFactory.conflict('Username already taken');
      }
    }

    const updatedUser = userService.update(id, updateData);

    logger.info('User updated by admin', { 
      userId: updatedUser.id, 
      adminId: req.user.id 
    });

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: updatedUser.toSafeJSON(),
      },
    });
  });

  /**
   * Delete user by ID (Admin only)
   * @route DELETE /api/v1/users/:id
   */
  deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.user.id === id) {
      throw ErrorFactory.badRequest('Cannot delete your own account');
    }

    const user = userService.findById(id);
    if (!user) {
      throw ErrorFactory.notFound('User not found');
    }

    userService.delete(id);

    logger.info('User deleted by admin', { 
      deletedUserId: id, 
      adminId: req.user.id 
    });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: null,
    });
  });
}

module.exports = new UserController();
