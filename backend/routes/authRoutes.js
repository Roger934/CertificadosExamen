const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ========================================
// RUTAS DE AUTENTICACIÓN
// ========================================

// POST /api/auth/login - Iniciar sesión
router.post('/login', authController.login);

// POST /api/auth/logout - Cerrar sesión
router.post('/logout', authController.logout);

// GET /api/auth/verify - Verificar token (opcional, para debugging)
router.get('/verify', authController.verifyToken);

module.exports = router;