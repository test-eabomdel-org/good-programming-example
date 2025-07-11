const BaseModel = require('./BaseModel');

/**
 * Product model class
 */
class Product extends BaseModel {
  constructor(data) {
    super(data);
    this.name = data.name;
    this.description = data.description || '';
    this.price = data.price;
    this.category = data.category;
    this.stock = data.stock || 0;
    this.sku = data.sku;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.tags = data.tags || [];
    this.images = data.images || [];
    this.rating = data.rating || 0;
    this.reviewCount = data.reviewCount || 0;
  }

  /**
   * Check if product is in stock
   */
  isInStock() {
    return this.stock > 0;
  }

  /**
   * Check if product is available (active and in stock)
   */
  isAvailable() {
    return this.isActive && this.isInStock();
  }

  /**
   * Reduce stock by quantity
   */
  reduceStock(quantity) {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    
    if (this.stock < quantity) {
      throw new Error('Insufficient stock');
    }
    
    this.stock -= quantity;
    this.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * Increase stock by quantity
   */
  increaseStock(quantity) {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    
    this.stock += quantity;
    this.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * Update product rating
   */
  updateRating(newRating, isNewReview = false) {
    if (newRating < 1 || newRating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    
    if (isNewReview) {
      this.rating = ((this.rating * this.reviewCount) + newRating) / (this.reviewCount + 1);
      this.reviewCount += 1;
    } else {
      this.rating = newRating;
    }
    
    this.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * Get formatted price
   */
  getFormattedPrice(currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(this.price);
  }

  /**
   * Get stock status
   */
  getStockStatus() {
    if (this.stock === 0) return 'out_of_stock';
    if (this.stock < 10) return 'low_stock';
    return 'in_stock';
  }

  /**
   * Add tag
   */
  addTag(tag) {
    if (tag && !this.tags.includes(tag)) {
      this.tags.push(tag);
      this.updatedAt = new Date().toISOString();
    }
    return this;
  }

  /**
   * Remove tag
   */
  removeTag(tag) {
    const index = this.tags.indexOf(tag);
    if (index > -1) {
      this.tags.splice(index, 1);
      this.updatedAt = new Date().toISOString();
    }
    return this;
  }

  /**
   * Convert to JSON with additional computed fields
   */
  toJSON() {
    return {
      ...super.toJSON(),
      formattedPrice: this.getFormattedPrice(),
      stockStatus: this.getStockStatus(),
      isAvailable: this.isAvailable(),
    };
  }
}

module.exports = Product;
