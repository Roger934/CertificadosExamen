const users = require('../data/users');
const certificaciones = require('../data/certificaciones');
const { intentosExamen } = require('../data/storage');
const { generarCertificadoPDF } = require('../utils/pdfGenerator');

/**
 * Genera y descarga el certificado PDF
 * Solo si el usuario aprobó el examen
 */
const generateCertificate = (req, res) => {
    const { certificationId } = req.body;
    const userId = req.userId; // Viene del middleware authRequired

    // Validar certificationId
    if (!certificationId) {
        return res.status(400).json({
            success: false,
            message: 'ID de certificación no proporcionado'
        });
    }

    // Buscar usuario
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Usuario no encontrado'
        });
    }

    // Buscar certificación
    const certificacion = certificaciones.find(c => c.id === parseInt(certificationId));
    if (!certificacion) {
        return res.status(404).json({
            success: false,
            message: 'Certificación no encontrada'
        });
    }

    // Buscar intento completado del usuario
    const intento = intentosExamen.find(
        i => i.userId === userId && 
             i.certificationId === parseInt(certificationId) && 
             i.completado === true
    );

    if (!intento) {
        return res.status(404).json({
            success: false,
            message: 'No se encontró un examen completado para esta certificación'
        });
    }

    // Verificar que haya aprobado
    if (!intento.aprobo) {
        return res.status(403).json({
            success: false,
            message: 'No puedes obtener el certificado porque no aprobaste el examen'
        });
    }

    try {
        // Generar PDF
        const pdfDoc = generarCertificadoPDF(user, certificacion, intento);

        // Configurar headers para descarga
        const filename = `Certificado_${certificacion.nombre.replace(/ /g, '_')}_${user.nombreCompleto.replace(/ /g, '_')}.pdf`;
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        // Enviar PDF al cliente
        pdfDoc.pipe(res);

        console.log(`📜 Certificado generado: Usuario ${userId}, Certificación ${certificationId}`);

    } catch (error) {
        console.error('Error al generar PDF:', error);
        res.status(500).json({
            success: false,
            message: 'Error al generar el certificado PDF',
            error: error.message
        });
    }
};

module.exports = {
    generateCertificate
};