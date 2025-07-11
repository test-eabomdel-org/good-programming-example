const Product = require('../models/Product');
const { ErrorFactory } = require('../utils/errors');

/**
 * In-memory storage for products (replace with database in production)
 */
class ProductRepository {
  constructor() {
    this.products = new Map();
    this.initializeDefaultProducts();
  }

  /**
   * Initialize default products for testing
   */
  initializeDefaultProducts() {
    const products = [
      {
        name: 'Laptop Dell XPS 13',
        description: 'High-performance ultrabook with 11th Gen Intel Core processors',
        price: 1299.99,
        category: 'Electronics',
        stock: 25,
        sku: 'DELLXPS13',
        tags: ['laptop', 'computer', 'dell', 'ultrabook'],
      },
      {
        name: 'iPhone 14 Pro',
        description: 'Latest iPhone with A16 Bionic chip and Pro camera system',
        price: 999.99,
        category: 'Electronics',
        stock: 50,
        sku: 'IPHONE14PRO',
        tags: ['smartphone', 'apple', 'iphone', 'mobile'],
      },
      {
        name: 'Nike Air Max 270',
        description: 'Comfortable running shoes with Max Air unit',
        price: 149.99,
        category: 'Footwear',
        stock: 100,
        sku: 'NIKEAM270',
        tags: ['shoes', 'nike', 'running', 'sports'],
      },
      {
        name: 'Mechanical Gaming Keyboard',
        description: 'RGB backlit mechanical keyboard with Cherry MX switches',
        price: 89.99,
        category: 'Electronics',
        stock: 75,
        sku: 'MECHKB01',
        tags: ['keyboard', 'gaming', 'mechanical', 'rgb'],
      },
      {
        name: 'Wireless Bluetooth Headphones',
        description: 'Noise-cancelling over-ear headphones with 30-hour battery',
        price: 199.99,
        category: 'Electronics',
        stock: 30,
        sku: 'BTHEADP01',
        tags: ['headphones', 'bluetooth', 'wireless', 'noise-cancelling'],
      },
    ];

    products.forEach(productData => {
      const product = new Product(productData);
      this.products.set(product.id, product);
    });
  }

  /**
   * Create a new product
   */
  create(productData) {
    // Check if SKU already exists
    if (this.findBySku(productData.sku)) {
      throw ErrorFactory.conflict('SKU already exists');
    }

    const product = new Product(productData);
    this.products.set(product.id, product);
    return product;
  }

  /**
   * Find product by ID
   */
  findById(id) {
    return this.products.get(id) || null;
  }

  /**
   * Find product by SKU
   */
  findBySku(sku) {
    return Array.from(this.products.values())
      .find(product => product.sku === sku) || null;
  }

  /**
   * Update product
   */
  update(id, updateData) {
    const product = this.products.get(id);
    if (!product) {
      throw ErrorFactory.notFound('Product not found');
    }

    // Check if SKU already exists (excluding current product)
    if (updateData.sku && updateData.sku !== product.sku) {
      const existingProduct = this.findBySku(updateData.sku);
      if (existingProduct && existingProduct.id !== id) {
        throw ErrorFactory.conflict('SKU already exists');
      }
    }

    product.update(updateData);
    this.products.set(id, product);
    return product;
  }

  /**
   * Delete product
   */
  delete(id) {
    const product = this.products.get(id);
    if (!product) {
      throw ErrorFactory.notFound('Product not found');
    }

    this.products.delete(id);
    return true;
  }

  /**
   * Get all products with pagination and filtering
   */
  findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      category = '',
      minPrice = null,
      maxPrice = null,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    let products = Array.from(this.products.values());

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (category) {
      products = products.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Apply price filters
    if (minPrice !== null) {
      products = products.filter(product => product.price >= minPrice);
    }

    if (maxPrice !== null) {
      products = products.filter(product => product.price <= maxPrice);
    }

    // Apply sorting
    products.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      totalProducts: products.length,
      totalPages: Math.ceil(products.length / limit),
      currentPage: page,
      hasNextPage: endIndex < products.length,
      hasPrevPage: startIndex > 0,
    };
  }

  /**
   * Get unique categories
   */
  getCategories() {
    const categories = Array.from(this.products.values())
      .map(product => product.category)
      .filter((category, index, self) => self.indexOf(category) === index)
      .sort();

    return categories;
  }

  /**
   * Get products by category
   */
  findByCategory(category) {
    return Array.from(this.products.values())
      .filter(product => product.category.toLowerCase() === category.toLowerCase());
  }

  /**
   * Get low stock products
   */
  getLowStockProducts(threshold = 10) {
    return Array.from(this.products.values())
      .filter(product => product.stock <= threshold && product.stock > 0)
      .sort((a, b) => a.stock - b.stock);
  }

  /**
   * Get out of stock products
   */
  getOutOfStockProducts() {
    return Array.from(this.products.values())
      .filter(product => product.stock === 0);
  }
}

module.exports = new ProductRepository();
