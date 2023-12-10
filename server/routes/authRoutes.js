const express = require('express');
const authController = require('../controllers/authController');

const authRoutes = express.Router();

authRoutes.use('/auth', authController);

module.exports = authRoutes;
