const User = require('../models/User');

const UserService = {
  register: async (userData) => {
    try {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('Email is already registered');
      }

      const user = new User(userData);
      await user.save();
      return user;
    } catch (error) {
      throw new Error('Error registering user: ' + error.message);
    }
  },

  login: async (email, password) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      return user;
    } catch (error) {
      throw new Error('Error logging in: ' + error.message);
    }
  },

  getUserById: async (userId) => {
    try {
      return await User.findById(userId);
    } catch (error) {
      throw new Error('Error fetching user by ID: ' + error.message);
    }
  },

  getAllUsers: async () => {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
      throw new Error('Error fetching users: ' + error.message);
    }
  },
};

module.exports = UserService;
