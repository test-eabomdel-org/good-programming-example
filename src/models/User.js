const bcrypt = require('bcrypt');
const BaseModel = require('./BaseModel');

/**
 * User model class
 */
class User extends BaseModel {
  constructor(data) {
    super(data);
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.role = data.role || 'user';
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.lastLogin = data.lastLogin || null;
    this.loginAttempts = data.loginAttempts || 0;
    this.lockedUntil = data.lockedUntil || null;
  }

  /**
   * Hash password before saving
   */
  async hashPassword() {
    if (this.password) {
      const saltRounds = 12;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
    return this;
  }

  /**
   * Compare password with hashed password
   */
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }

  /**
   * Check if user is locked
   */
  isLocked() {
    return this.lockedUntil && this.lockedUntil > Date.now();
  }

  /**
   * Increment login attempts
   */
  incLoginAttempts() {
    this.loginAttempts += 1;
    
    // Lock account after 5 failed attempts for 30 minutes
    if (this.loginAttempts >= 5) {
      this.lockedUntil = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    }
    
    this.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * Reset login attempts
   */
  resetLoginAttempts() {
    this.loginAttempts = 0;
    this.lockedUntil = null;
    this.lastLogin = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * Get full name
   */
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Check if user is admin
   */
  isAdmin() {
    return this.role === 'admin';
  }

  /**
   * Convert to JSON excluding password
   */
  toSafeJSON() {
    return super.toSafeJSON(['password', 'loginAttempts', 'lockedUntil']);
  }

  /**
   * Convert to JWT payload
   */
  toJWTPayload() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      role: this.role,
      isActive: this.isActive,
    };
  }
}

module.exports = User;
