const Joi = require('joi');
const { ErrorFactory } = require('../utils/errors');

/**
 * Validation middleware factory
 */
const validate = (schema) => (req, res, next) => {
  const validationOptions = {
    abortEarly: false, // Include all errors
    allowUnknown: true, // Ignore unknown fields
    stripUnknown: true, // Remove unknown fields
  };

  const { error, value } = schema.validate(req.body, validationOptions);

  if (error) {
    const errorMessage = error.details
      .map(detail => detail.message)
      .join(', ');
    
    throw ErrorFactory.validation(errorMessage);
  }

  // Replace req.body with validated and sanitized data
  req.body = value;
  next();
};

/**
 * Query parameter validation middleware
 */
const validateQuery = (schema) => (req, res, next) => {
  const validationOptions = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  };

  const { error, value } = schema.validate(req.query, validationOptions);

  if (error) {
    const errorMessage = error.details
      .map(detail => detail.message)
      .join(', ');
    
    throw ErrorFactory.validation(errorMessage);
  }

  req.query = value;
  next();
};

/**
 * Parameter validation middleware
 */
const validateParams = (schema) => (req, res, next) => {
  const validationOptions = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  };

  const { error, value } = schema.validate(req.params, validationOptions);

  if (error) {
    const errorMessage = error.details
      .map(detail => detail.message)
      .join(', ');
    
    throw ErrorFactory.validation(errorMessage);
  }

  req.params = value;
  next();
};

module.exports = {
  validate,
  validateQuery,
  validateParams,
};
