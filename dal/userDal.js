const logger = require("../services/logger");
const User = require("../models/user")

const UserDAL = {
  // Create a new user
  createUser: async (userData) => {
    try {
      const newUser = new User(userData);
      const result = await newUser.save()
      return result;
    } catch (error) {
      logger.error(error);
      throw new Error(`Error creating user: ${error.message}`);
    }
  },

  // Get all users
  getAllUsers: async () => {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
      logger.error(error);
      throw new Error(`Error getting users: ${error.message}`);
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      logger.error(error);
      throw new Error(`Error getting user: ${error.message}`);
    }
  },

  // Update user by ID
  updateUserById: async (userId, updatedUserData) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, { new: true });
      return updatedUser;
    } catch (error) {
      logger.error(error);
      throw new Error(`Error updating user: ${error.message}`);
    }
  },

  // Delete user by ID
  deleteUserById: async (userId) => {
    try {
      await User.findByIdAndDelete(userId);
      return { message: 'User deleted successfully' };
    } catch (error) {
      logger.error(error);
      throw new Error(`Error deleting user: ${error.message}`);
    }
  },
  getUserByEmail: async (email) => {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      logger.error(error);
      throw new Error(`Error getting user: ${error.message}`);
    }
  },
  
};

module.exports = UserDAL;
