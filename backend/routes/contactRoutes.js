const express = require('express');
const router = express.Router();
const { contactos } = require('../data/storage');

// ========================================
// RUTAS DE CONTACTO
// ========================================

// POST /api/contact/send - Enviar mensaje de contacto
router.post('/send', (req, res) => {
    const { nombre, email, mensaje } = req.body;

    // Validación de campos
    if (!nombre || !email || !mensaje) {
        return res.status(400).json({
            success: false,
            message: 'Todos los campos son requeridos'
        });
    }

    // Crear nuevo contacto
    const nuevoContacto = {
        id: contactos.length + 1,
        nombre,
        email,
        mensaje,
        fecha: new Date().toISOString()
    };

    // Guardar en el array de contactos
    contactos.push(nuevoContacto);

    // ⭐ IMPRIMIR EN CONSOLA DEL SERVIDOR (Requisito del proyecto)
    console.log('\n========================================');
    console.log('📩 NUEVO MENSAJE DE CONTACTO');
    console.log('========================================');
    console.log('Nombre:', nombre);
    console.log('Email:', email);
    console.log('Mensaje:', mensaje);
    console.log('Fecha:', new Date().toLocaleString('es-MX'));
    console.log('========================================\n');
    console.log('📋 Todos los mensajes de contacto:');
    console.log(contactos);
    console.log('========================================\n');

    // Responder con éxito
    res.json({
        success: true,
        message: 'Mensaje enviado exitosamente'
    });
});

module.exports = router;