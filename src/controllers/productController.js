const productService = require('../services/productService');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { ErrorFactory } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * Product controller
 */
class ProductController {
  /**
   * Get all products with pagination, filtering, and sorting
   * @route GET /api/v1/products
   */
  getProducts = asyncHandler(async (req, res) => {
    const result = productService.findAll(req.query);

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: {
        products: result.products.map(product => product.toJSON()),
        pagination: {
          totalProducts: result.totalProducts,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage,
        },
        filters: {
          categories: productService.getCategories(),
        },
      },
    });
  });

  /**
   * Get product by ID
   * @route GET /api/v1/products/:id
   */
  getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = productService.findById(id);

    if (!product) {
      throw ErrorFactory.notFound('Product not found');
    }

    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: {
        product: product.toJSON(),
      },
    });
  });

  /**
   * Create new product
   * @route POST /api/v1/products
   */
  createProduct = asyncHandler(async (req, res) => {
    const product = productService.create(req.body);

    logger.info('Product created', { 
      productId: product.id, 
      productName: product.name,
      createdBy: req.user.id 
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        product: product.toJSON(),
      },
    });
  });

  /**
   * Update product by ID
   * @route PUT /api/v1/products/:id
   */
  updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const updatedProduct = productService.update(id, updateData);

    logger.info('Product updated', { 
      productId: updatedProduct.id, 
      productName: updatedProduct.name,
      updatedBy: req.user.id 
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: {
        product: updatedProduct.toJSON(),
      },
    });
  });

  /**
   * Delete product by ID
   * @route DELETE /api/v1/products/:id
   */
  deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = productService.findById(id);
    if (!product) {
      throw ErrorFactory.notFound('Product not found');
    }

    productService.delete(id);

    logger.info('Product deleted', { 
      productId: id, 
      productName: product.name,
      deletedBy: req.user.id 
    });

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: null,
    });
  });

  /**
   * Get product categories
   * @route GET /api/v1/products/categories
   */
  getCategories = asyncHandler(async (req, res) => {
    const categories = productService.getCategories();

    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: {
        categories,
      },
    });
  });

  /**
   * Get low stock products
   * @route GET /api/v1/products/low-stock
   */
  getLowStockProducts = asyncHandler(async (req, res) => {
    const threshold = parseInt(req.query.threshold, 10) || 10;
    const products = productService.getLowStockProducts(threshold);

    res.status(200).json({
      success: true,
      message: 'Low stock products retrieved successfully',
      data: {
        products: products.map(product => product.toJSON()),
        threshold,
      },
    });
  });

  /**
   * Get out of stock products
   * @route GET /api/v1/products/out-of-stock
   */
  getOutOfStockProducts = asyncHandler(async (req, res) => {
    const products = productService.getOutOfStockProducts();

    res.status(200).json({
      success: true,
      message: 'Out of stock products retrieved successfully',
      data: {
        products: products.map(product => product.toJSON()),
      },
    });
  });
}

module.exports = new ProductController();
