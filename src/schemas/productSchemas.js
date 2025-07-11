const Joi = require('joi');

const productSchemas = {
  getProducts: Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .default(1)
      .messages({
        'number.integer': 'Page must be an integer',
        'number.min': 'Page must be greater than 0',
      }),
    
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(10)
      .messages({
        'number.integer': 'Limit must be an integer',
        'number.min': 'Limit must be greater than 0',
        'number.max': 'Limit cannot exceed 100',
      }),
    
    search: Joi.string()
      .max(100)
      .optional()
      .messages({
        'string.max': 'Search term cannot exceed 100 characters',
      }),
    
    category: Joi.string()
      .max(50)
      .optional()
      .messages({
        'string.max': 'Category cannot exceed 50 characters',
      }),
    
    minPrice: Joi.number()
      .min(0)
      .optional()
      .messages({
        'number.min': 'Minimum price cannot be negative',
      }),
    
    maxPrice: Joi.number()
      .min(0)
      .optional()
      .messages({
        'number.min': 'Maximum price cannot be negative',
      }),
    
    sortBy: Joi.string()
      .valid('createdAt', 'updatedAt', 'name', 'price')
      .default('createdAt')
      .messages({
        'any.only': 'Sort by must be one of: createdAt, updatedAt, name, price',
      }),
    
    sortOrder: Joi.string()
      .valid('asc', 'desc')
      .default('desc')
      .messages({
        'any.only': 'Sort order must be either asc or desc',
      }),
  }).custom((value, helpers) => {
    if (value.minPrice && value.maxPrice && value.minPrice > value.maxPrice) {
      return helpers.error('custom.minMaxPrice');
    }
    return value;
  }).messages({
    'custom.minMaxPrice': 'Minimum price cannot be greater than maximum price',
  }),

  getProductById: Joi.object({
    id: Joi.string()
      .uuid({ version: 'uuidv4' })
      .required()
      .messages({
        'string.guid': 'Product ID must be a valid UUID',
        'any.required': 'Product ID is required',
      }),
  }),

  createProduct: Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': 'Product name must be at least 2 characters long',
        'string.max': 'Product name cannot exceed 100 characters',
        'any.required': 'Product name is required',
      }),
    
    description: Joi.string()
      .max(1000)
      .optional()
      .messages({
        'string.max': 'Product description cannot exceed 1000 characters',
      }),
    
    price: Joi.number()
      .positive()
      .precision(2)
      .required()
      .messages({
        'number.positive': 'Price must be a positive number',
        'number.precision': 'Price cannot have more than 2 decimal places',
        'any.required': 'Price is required',
      }),
    
    category: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.min': 'Category must be at least 2 characters long',
        'string.max': 'Category cannot exceed 50 characters',
        'any.required': 'Category is required',
      }),
    
    stock: Joi.number()
      .integer()
      .min(0)
      .default(0)
      .messages({
        'number.integer': 'Stock must be an integer',
        'number.min': 'Stock cannot be negative',
      }),
    
    sku: Joi.string()
      .alphanum()
      .min(3)
      .max(50)
      .required()
      .messages({
        'string.alphanum': 'SKU must contain only alphanumeric characters',
        'string.min': 'SKU must be at least 3 characters long',
        'string.max': 'SKU cannot exceed 50 characters',
        'any.required': 'SKU is required',
      }),
    
    isActive: Joi.boolean()
      .default(true)
      .messages({
        'boolean.base': 'isActive must be a boolean value',
      }),
  }),

  updateProduct: Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .optional()
      .messages({
        'string.min': 'Product name must be at least 2 characters long',
        'string.max': 'Product name cannot exceed 100 characters',
      }),
    
    description: Joi.string()
      .max(1000)
      .optional()
      .messages({
        'string.max': 'Product description cannot exceed 1000 characters',
      }),
    
    price: Joi.number()
      .positive()
      .precision(2)
      .optional()
      .messages({
        'number.positive': 'Price must be a positive number',
        'number.precision': 'Price cannot have more than 2 decimal places',
      }),
    
    category: Joi.string()
      .min(2)
      .max(50)
      .optional()
      .messages({
        'string.min': 'Category must be at least 2 characters long',
        'string.max': 'Category cannot exceed 50 characters',
      }),
    
    stock: Joi.number()
      .integer()
      .min(0)
      .optional()
      .messages({
        'number.integer': 'Stock must be an integer',
        'number.min': 'Stock cannot be negative',
      }),
    
    sku: Joi.string()
      .alphanum()
      .min(3)
      .max(50)
      .optional()
      .messages({
        'string.alphanum': 'SKU must contain only alphanumeric characters',
        'string.min': 'SKU must be at least 3 characters long',
        'string.max': 'SKU cannot exceed 50 characters',
      }),
    
    isActive: Joi.boolean()
      .optional()
      .messages({
        'boolean.base': 'isActive must be a boolean value',
      }),
  }),
};

module.exports = {
  productSchemas,
};
