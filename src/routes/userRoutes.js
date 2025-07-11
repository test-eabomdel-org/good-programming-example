const express = require('express');
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { validate, validateQuery, validateParams } = require('../middleware/validationMiddleware');
const { userSchemas } = require('../schemas/userSchemas');

const router = express.Router();

/**
 * @route   GET /api/v1/users
 * @desc    Get all users (with pagination and filtering)
 * @access  Private (Admin only)
 */
router.get('/', 
  authenticate,
  authorize('admin'),
  validateQuery(userSchemas.getUsers),
  userController.getUsers
);

/**
 * @route   GET /api/v1/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticate, userController.getCurrentUser);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user by ID
 * @access  Private (Admin or own profile)
 */
router.get('/:id', 
  authenticate,
  validateParams(userSchemas.getUserById),
  userController.getUserById
);

/**
 * @route   PUT /api/v1/users/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/profile', 
  authenticate,
  validate(userSchemas.updateProfile),
  userController.updateCurrentUser
);

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Update user by ID
 * @access  Private (Admin only)
 */
router.put('/:id', 
  authenticate,
  authorize('admin'),
  validateParams(userSchemas.getUserById),
  validate(userSchemas.updateUser),
  userController.updateUser
);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete user by ID
 * @access  Private (Admin only)
 */
router.delete('/:id', 
  authenticate,
  authorize('admin'),
  validateParams(userSchemas.getUserById),
  userController.deleteUser
);

module.exports = router;
