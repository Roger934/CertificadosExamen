const express = require('express');
const cors = require('cors');
const path = require('path');

// Importar rutas (ahora separadas en archivos individuales)
const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const contactRoutes = require('./routes/contactRoutes');
const certificationRoutes = require('./routes/certificationRoutes');

// Importar middleware de errores
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// ========================================
// MIDDLEWARES GLOBALES
// ========================================

// CORS - permitir peticiones del frontend
app.use(cors({
    origin: '*', // En producción, especifica el dominio exacto
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (assets para PDFs)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// ========================================
// RUTAS
// ========================================

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({
        message: '🎓 Bienvenido a la API de Credentia',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            exam: '/api/exam',
            contact: '/api/contact',
            certifications: '/api/certifications'
        }
    });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/certifications', certificationRoutes);

// ========================================
// MANEJO DE ERRORES
// ========================================

// Ruta no encontrada (404)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta no encontrada: ${req.method} ${req.path}`
    });
});

// Error handler global
app.use(errorHandler);

module.exports = app;