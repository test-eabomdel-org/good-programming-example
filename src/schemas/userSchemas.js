const Joi = require('joi');

const userSchemas = {
  getUsers: Joi.object({
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
    
    role: Joi.string()
      .valid('admin', 'user')
      .optional()
      .messages({
        'any.only': 'Role must be either admin or user',
      }),
    
    sortBy: Joi.string()
      .valid('createdAt', 'updatedAt', 'username', 'email')
      .default('createdAt')
      .messages({
        'any.only': 'Sort by must be one of: createdAt, updatedAt, username, email',
      }),
    
    sortOrder: Joi.string()
      .valid('asc', 'desc')
      .default('desc')
      .messages({
        'any.only': 'Sort order must be either asc or desc',
      }),
  }),

  getUserById: Joi.object({
    id: Joi.string()
      .uuid({ version: 'uuidv4' })
      .required()
      .messages({
        'string.guid': 'User ID must be a valid UUID',
        'any.required': 'User ID is required',
      }),
  }),

  updateProfile: Joi.object({
    firstName: Joi.string()
      .min(2)
      .max(50)
      .optional()
      .messages({
        'string.min': 'First name must be at least 2 characters long',
        'string.max': 'First name cannot exceed 50 characters',
      }),
    
    lastName: Joi.string()
      .min(2)
      .max(50)
      .optional()
      .messages({
        'string.min': 'Last name must be at least 2 characters long',
        'string.max': 'Last name cannot exceed 50 characters',
      }),
    
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .optional()
      .messages({
        'string.alphanum': 'Username must contain only alphanumeric characters',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username cannot exceed 30 characters',
      }),
  }),

  updateUser: Joi.object({
    firstName: Joi.string()
      .min(2)
      .max(50)
      .optional()
      .messages({
        'string.min': 'First name must be at least 2 characters long',
        'string.max': 'First name cannot exceed 50 characters',
      }),
    
    lastName: Joi.string()
      .min(2)
      .max(50)
      .optional()
      .messages({
        'string.min': 'Last name must be at least 2 characters long',
        'string.max': 'Last name cannot exceed 50 characters',
      }),
    
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .optional()
      .messages({
        'string.alphanum': 'Username must contain only alphanumeric characters',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username cannot exceed 30 characters',
      }),
    
    role: Joi.string()
      .valid('admin', 'user')
      .optional()
      .messages({
        'any.only': 'Role must be either admin or user',
      }),
    
    isActive: Joi.boolean()
      .optional()
      .messages({
        'boolean.base': 'isActive must be a boolean value',
      }),
  }),
};

module.exports = {
  userSchemas,
};
