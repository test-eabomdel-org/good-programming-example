const { v4: uuidv4 } = require('uuid');

/**
 * Base Model class with common functionality
 */
class BaseModel {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  /**
   * Update the model with new data
   */
  update(data) {
    Object.keys(data).forEach(key => {
      if (key !== 'id' && key !== 'createdAt') {
        this[key] = data[key];
      }
    });
    this.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * Convert model to plain object
   */
  toJSON() {
    return { ...this };
  }

  /**
   * Convert model to plain object excluding sensitive fields
   */
  toSafeJSON(excludeFields = []) {
    const obj = { ...this };
    excludeFields.forEach(field => delete obj[field]);
    return obj;
  }
}

module.exports = BaseModel;
