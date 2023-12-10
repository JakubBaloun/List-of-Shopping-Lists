const express = require('express');
const Joi = require('joi');
const UserService = require('../services/userService');
const jwt = require('jsonwebtoken');

const authController = express.Router();

const registrationSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

authController.post('/register', async (req, res) => {
  try {
    const validatedData = registrationSchema.validate(req.body);
    if (validatedData.error) {
      throw new Error(validatedData.error.details[0].message);
    }

    const user = await UserService.register(req.body);
    res.status(201).json({ status: 'success', data: user });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

authController.post('/login', async (req, res) => {
  try {
    const validatedData = loginSchema.validate(req.body);
    if (validatedData.error) {
      throw new Error(validatedData.error.details[0].message);
    }

    const { email, password } = req.body;
    const user = await UserService.login(email, password);

    //req.session.userId = user._id;

    const token = jwt.sign({ userId: user._id }, 'tajnyKlicProPodpisJWT', { expiresIn: '1h' });
    res.json({ status: 'success', data: { user, token } });
  } catch (error) {
    res.status(401).json({ status: 'error', message: error.message });
  }
});

authController.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ status: 'error', message: 'Could not log out' });
    }

    res.json({ status: 'success', message: 'Logged out successfully' });
  });
});

authController.get('/users', async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    res.json({ status: 'success', data: users });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

authController.get('/profile', async (req, res) => {
  try {
    // Získání tokenu z hlavičky Authorization
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ status: 'error', message: 'Not authenticated' });
    }

    // Ověření tokenu a získání ID uživatele
    const userId = verifyTokenAndGetUserId(token);

    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Invalid token' });
    }

    // Získání informací o uživateli pomocí UserService
    const user = await UserService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // Vrácení informací o uživateli
    res.json({ status: 'success', data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});
module.exports = authController;