const User = require('../models/User');
const { ErrorFactory } = require('../utils/errors');

/**
 * In-memory storage for users (replace with database in production)
 */
class UserRepository {
  constructor() {
    this.users = new Map();
    this.initializeDefaultUsers();
  }

  /**
   * Initialize default users for testing
   */
  async initializeDefaultUsers() {
    const adminUser = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: 'Admin123!',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
    });
    
    const regularUser = new User({
      username: 'user',
      email: 'user@example.com',
      password: 'User123!',
      firstName: 'Regular',
      lastName: 'User',
      role: 'user',
    });

    await adminUser.hashPassword();
    await regularUser.hashPassword();

    this.users.set(adminUser.id, adminUser);
    this.users.set(regularUser.id, regularUser);
  }

  /**
   * Create a new user
   */
  async create(userData) {
    const user = new User(userData);
    await user.hashPassword();
    this.users.set(user.id, user);
    return user;
  }

  /**
   * Find user by ID
   */
  findById(id) {
    return this.users.get(id) || null;
  }

  /**
   * Find user by email
   */
  findByEmail(email) {
    return Array.from(this.users.values())
      .find(user => user.email === email) || null;
  }

  /**
   * Find user by username
   */
  findByUsername(username) {
    return Array.from(this.users.values())
      .find(user => user.username === username) || null;
  }

  /**
   * Update user
   */
  update(id, updateData) {
    const user = this.users.get(id);
    if (!user) {
      throw ErrorFactory.notFound('User not found');
    }

    user.update(updateData);
    this.users.set(id, user);
    return user;
  }

  /**
   * Delete user
   */
  delete(id) {
    const user = this.users.get(id);
    if (!user) {
      throw ErrorFactory.notFound('User not found');
    }

    this.users.delete(id);
    return true;
  }

  /**
   * Get all users with pagination and filtering
   */
  findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      role = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    let users = Array.from(this.users.values());

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(user => 
        user.username.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower)
      );
    }

    // Apply role filter
    if (role) {
      users = users.filter(user => user.role === role);
    }

    // Apply sorting
    users.sort((a, b) => {
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
    const paginatedUsers = users.slice(startIndex, endIndex);

    return {
      users: paginatedUsers,
      totalUsers: users.length,
      totalPages: Math.ceil(users.length / limit),
      currentPage: page,
      hasNextPage: endIndex < users.length,
      hasPrevPage: startIndex > 0,
    };
  }

  /**
   * Check if email exists
   */
  emailExists(email) {
    return Array.from(this.users.values())
      .some(user => user.email === email);
  }

  /**
   * Check if username exists
   */
  usernameExists(username) {
    return Array.from(this.users.values())
      .some(user => user.username === username);
  }
}

module.exports = new UserRepository();
