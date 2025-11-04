const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const pdfController = require('../controllers/pdfController');
const authRequired = require('../middlewares/authMiddleware');

// ========================================
// RUTAS DEL EXAMEN (TODAS PROTEGIDAS) ⭐
// ========================================

// POST /api/exam/start - Iniciar examen
// Requiere: token válido, pago realizado
// Devuelve: 8 preguntas aleatorias + tiempo del examen
router.post('/start', authRequired, examController.startExam);

// POST /api/exam/submit - Enviar respuestas del examen
// Requiere: token válido, intento activo
// Devuelve: calificación y resultado (aprobó/no aprobó)
router.post('/submit', authRequired, examController.submitExam);

// POST /api/exam/pdf - Generar certificado PDF ⭐
// Requiere: token válido, haber aprobado el examen
// Devuelve: archivo PDF con el certificado
router.post('/pdf', authRequired, pdfController.generateCertificate);

module.exports = router;