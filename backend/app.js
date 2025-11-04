const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const contactRoutes = require('./routes/contactRoutes');
const certificationRoutes = require('./routes/certificationRoutes');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir assets
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

// ✅ Servir el frontend completo
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/certifications', certificationRoutes);

// Errores
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta no encontrada: ${req.method} ${req.path}`
    });
});

app.use(errorHandler);

module.exports = app;