const express = require('express');
const productController = require('../controllers/productController');
const { authenticate, authorize, optionalAuth } = require('../middleware/authMiddleware');
const { validate, validateQuery, validateParams } = require('../middleware/validationMiddleware');
const { productSchemas } = require('../schemas/productSchemas');

const router = express.Router();

/**
 * @route   GET /api/v1/products
 * @desc    Get all products (with pagination, filtering, and sorting)
 * @access  Public
 */
router.get('/', 
  optionalAuth,
  validateQuery(productSchemas.getProducts),
  productController.getProducts
);

/**
 * @route   GET /api/v1/products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get('/:id', 
  optionalAuth,
  validateParams(productSchemas.getProductById),
  productController.getProductById
);

/**
 * @route   POST /api/v1/products
 * @desc    Create new product
 * @access  Private (Admin only)
 */
router.post('/', 
  authenticate,
  authorize('admin'),
  validate(productSchemas.createProduct),
  productController.createProduct
);

/**
 * @route   PUT /api/v1/products/:id
 * @desc    Update product by ID
 * @access  Private (Admin only)
 */
router.put('/:id', 
  authenticate,
  authorize('admin'),
  validateParams(productSchemas.getProductById),
  validate(productSchemas.updateProduct),
  productController.updateProduct
);

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Delete product by ID
 * @access  Private (Admin only)
 */
router.delete('/:id', 
  authenticate,
  authorize('admin'),
  validateParams(productSchemas.getProductById),
  productController.deleteProduct
);

module.exports = router;
