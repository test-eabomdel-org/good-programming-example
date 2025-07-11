# Good Programming API

A Node.js REST API demonstrating best programming practices, clean architecture, and industry standards.

## 🚀 Features

- **Clean Architecture**: Separation of concerns with controllers, services, models, and middleware
- **Security**: JWT authentication, input validation, rate limiting, and security headers
- **Error Handling**: Centralized error handling with custom error classes
- **Validation**: Input validation using Joi with detailed error messages
- **Logging**: Structured logging with different levels
- **Testing**: Unit and integration tests with Jest and Supertest
- **Code Quality**: ESLint, Prettier, and comprehensive linting rules
- **Documentation**: Comprehensive API documentation
- **Environment Configuration**: Environment-specific configurations
- **CORS**: Cross-Origin Resource Sharing support
- **Pagination**: Efficient pagination for large datasets
- **Rate Limiting**: Request rate limiting for API protection

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Testing**: Jest + Supertest
- **Linting**: ESLint + Prettier
- **Security**: Helmet, bcrypt, CORS
- **Logging**: Custom logger utility

## 📁 Project Structure

```
src/
├── config/
│   └── config.js              # Environment configuration
├── controllers/
│   ├── authController.js      # Authentication logic
│   ├── userController.js      # User management
│   └── productController.js   # Product management
├── middleware/
│   ├── authMiddleware.js      # JWT authentication
│   ├── errorMiddleware.js     # Error handling
│   └── validationMiddleware.js # Input validation
├── models/
│   ├── BaseModel.js           # Base model class
│   ├── User.js                # User model
│   └── Product.js             # Product model
├── routes/
│   ├── index.js               # Main router
│   ├── authRoutes.js          # Authentication routes
│   ├── userRoutes.js          # User routes
│   └── productRoutes.js       # Product routes
├── schemas/
│   ├── authSchemas.js         # Auth validation schemas
│   ├── userSchemas.js         # User validation schemas
│   └── productSchemas.js      # Product validation schemas
├── services/
│   ├── authService.js         # Authentication business logic
│   ├── userService.js         # User business logic
│   └── productService.js      # Product business logic
├── utils/
│   ├── constants.js           # Application constants
│   ├── errors.js              # Custom error classes
│   ├── logger.js              # Logging utility
│   └── responseUtil.js        # Response formatting
├── app.js                     # Express app configuration
└── index.js                   # Application entry point
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd good-programming-example
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with nodemon
npm start           # Start production server

# Testing
npm test            # Run all tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Run tests with coverage report

# Code Quality
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint issues
npm run format      # Format code with Prettier
npm run validate    # Run linting and tests
```

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user

### Users
- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/profile` - Get current user profile
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/profile` - Update current user profile
- `PUT /api/v1/users/:id` - Update user by ID (Admin only)
- `DELETE /api/v1/users/:id` - Delete user by ID (Admin only)

### Products
- `GET /api/v1/products` - Get all products (with pagination and filtering)
- `GET /api/v1/products/:id` - Get product by ID
- `POST /api/v1/products` - Create new product (Admin only)
- `PUT /api/v1/products/:id` - Update product by ID (Admin only)
- `DELETE /api/v1/products/:id` - Delete product by ID (Admin only)

### Health Check
- `GET /health` - API health check

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Default Users

The application creates default users for testing:

**Admin User:**
- Email: `admin@example.com`
- Password: `Admin123!`
- Role: `admin`

**Regular User:**
- Email: `user@example.com`
- Password: `User123!`
- Role: `user`

## 📊 Request/Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "stack": "Error stack trace (development only)"
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "items": [...],
    "pagination": {
      "totalItems": 100,
      "totalPages": 10,
      "currentPage": 1,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Joi schema validation
- **Rate Limiting**: Request rate limiting
- **CORS**: Cross-Origin Resource Sharing
- **Security Headers**: Helmet.js security headers
- **Account Lockout**: Automatic account lockout after failed attempts

## 🧪 Testing

The project includes comprehensive test coverage:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

Test categories:
- **Unit Tests**: Test individual components (models, utilities)
- **Integration Tests**: Test API endpoints and workflows

## 📏 Code Quality

The project maintains high code quality through:

- **ESLint**: Airbnb configuration with custom rules
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit validation
- **Jest**: Testing framework with coverage reporting

## 🌍 Environment Variables

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
API_VERSION=v1
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
LOG_LEVEL=info
```

## 📈 Performance Considerations

- **Compression**: Gzip compression for responses
- **Caching**: Response caching strategies
- **Pagination**: Efficient data pagination
- **Rate Limiting**: Request throttling
- **Error Handling**: Graceful error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Best Practices Implemented

- **SOLID Principles**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **DRY**: Don't Repeat Yourself
- **KISS**: Keep It Simple, Stupid
- **Clean Code**: Meaningful names, small functions, clear comments
- **Error Handling**: Proper error handling and logging
- **Security**: Input validation, authentication, authorization
- **Testing**: Unit and integration tests
- **Documentation**: Comprehensive code and API documentation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Express.js team for the excellent framework
- Jest team for the testing framework
- Airbnb for the ESLint configuration
- All contributors and maintainers