const User = require('../../src/models/User');

describe('User Model', () => {
  describe('User creation', () => {
    test('should create a user with valid data', () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User',
      };

      const user = new User(userData);

      expect(user.username).toBe(userData.username);
      expect(user.email).toBe(userData.email);
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
      expect(user.role).toBe('user'); // default role
      expect(user.isActive).toBe(true); // default active
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    test('should set default values correctly', () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User',
      };

      const user = new User(userData);

      expect(user.role).toBe('user');
      expect(user.isActive).toBe(true);
      expect(user.loginAttempts).toBe(0);
      expect(user.lastLogin).toBeNull();
      expect(user.lockedUntil).toBeNull();
    });
  });

  describe('User methods', () => {
    let user;

    beforeEach(() => {
      user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User',
      });
    });

    test('getFullName should return full name', () => {
      expect(user.getFullName()).toBe('Test User');
    });

    test('isAdmin should return false for regular user', () => {
      expect(user.isAdmin()).toBe(false);
    });

    test('isAdmin should return true for admin user', () => {
      user.role = 'admin';
      expect(user.isAdmin()).toBe(true);
    });

    test('isLocked should return false for unlocked user', () => {
      expect(user.isLocked()).toBe(false);
    });

    test('isLocked should return true for locked user', () => {
      user.lockedUntil = new Date(Date.now() + 1000 * 60 * 30).toISOString(); // 30 minutes from now
      expect(user.isLocked()).toBe(true);
    });

    test('incLoginAttempts should increment login attempts', () => {
      const initialAttempts = user.loginAttempts;
      user.incLoginAttempts();
      expect(user.loginAttempts).toBe(initialAttempts + 1);
    });

    test('incLoginAttempts should lock user after 5 attempts', () => {
      user.loginAttempts = 4;
      user.incLoginAttempts();
      expect(user.loginAttempts).toBe(5);
      expect(user.lockedUntil).not.toBeNull();
    });

    test('resetLoginAttempts should reset attempts and unlock user', () => {
      user.loginAttempts = 5;
      user.lockedUntil = new Date().toISOString();
      user.resetLoginAttempts();
      
      expect(user.loginAttempts).toBe(0);
      expect(user.lockedUntil).toBeNull();
      expect(user.lastLogin).toBeDefined();
    });

    test('toSafeJSON should exclude sensitive fields', () => {
      const safeUser = user.toSafeJSON();
      
      expect(safeUser).not.toHaveProperty('password');
      expect(safeUser).not.toHaveProperty('loginAttempts');
      expect(safeUser).not.toHaveProperty('lockedUntil');
      expect(safeUser).toHaveProperty('id');
      expect(safeUser).toHaveProperty('email');
      expect(safeUser).toHaveProperty('username');
    });

    test('toJWTPayload should return JWT payload', () => {
      const payload = user.toJWTPayload();
      
      expect(payload).toHaveProperty('id');
      expect(payload).toHaveProperty('username');
      expect(payload).toHaveProperty('email');
      expect(payload).toHaveProperty('role');
      expect(payload).toHaveProperty('isActive');
      expect(payload).not.toHaveProperty('password');
    });

    test('update should update user fields', () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      user.update(updateData);

      expect(user.firstName).toBe('Updated');
      expect(user.lastName).toBe('Name');
      expect(user.updatedAt).toBeDefined();
    });

    test('update should not update id or createdAt', () => {
      const originalId = user.id;
      const originalCreatedAt = user.createdAt;

      user.update({
        id: 'new-id',
        createdAt: 'new-date',
        firstName: 'Updated',
      });

      expect(user.id).toBe(originalId);
      expect(user.createdAt).toBe(originalCreatedAt);
      expect(user.firstName).toBe('Updated');
    });
  });
});
