const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Genera un certificado PDF para un usuario que aprobó el examen
 * 
 * Según el proyecto, el PDF debe incluir:
 * 1. Nombre completo del usuario (nombre y apellidos, NO cuenta ni email)
 * 2. Nombre de la certificación
 * 3. Fecha del día del examen
 * 4. Ciudad
 * 5. Nombre de la compañía que aplica el examen y logotipo (imagen)
 * 6. Nombre del instructor y firma (imagen)
 * 7. Nombre y firma (imagen) del CEO de la empresa
 * 
 * @param {Object} userData - Datos del usuario
 * @param {Object} certificacionData - Datos de la certificación
 * @param {Object} intentoData - Datos del intento de examen
 * @returns {PDFDocument} - Documento PDF generado
 */
function generarCertificadoPDF(userData, certificacionData, intentoData) {
    // Crear nuevo documento PDF
    const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape', // Orientación horizontal para certificado
        margins: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
        }
    });

    // Rutas de imágenes (ajustar según tu estructura)
    const assetsPath = path.join(__dirname, '../assets');
    const logoPath = path.join(assetsPath, 'logo.png');
    const firmaInstructorPath = path.join(assetsPath, 'firma-instructor.png');
    const firmaCEOPath = path.join(assetsPath, 'firma-ceo.png');

    // ========================================
    // DISEÑO DEL CERTIFICADO
    // ========================================

    // Borde decorativo
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
       .lineWidth(3)
       .stroke('#2563eb');

    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
       .lineWidth(1)
       .stroke('#7c3aed');

    // Logo de la empresa (si existe)
    try {
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, doc.page.width / 2 - 50, 50, { width: 100 });
        }
    } catch (error) {
        console.log('Logo no encontrado, continuando sin logo...');
    }

    // Título: "CERTIFICADO"
    doc.fontSize(36)
       .font('Helvetica-Bold')
       .fillColor('#2563eb')
       .text('CERTIFICADO DE APROBACIÓN', 50, 140, {
           width: doc.page.width - 100,
           align: 'center'
       });

    // Subtítulo: "Se otorga a"
    doc.fontSize(16)
       .font('Helvetica')
       .fillColor('#6b7280')
       .text('Se otorga a', 50, 200, {
           width: doc.page.width - 100,
           align: 'center'
       });
    doc.fontSize(28)
       .font('Helvetica-Bold')
       .fillColor('#111827')
       .text(userData.nombreCompleto, 50, 230, {
           width: doc.page.width - 100,
           align: 'center'
       });

    // Texto: "Por haber completado exitosamente"
    doc.fontSize(14)
       .font('Helvetica')
       .fillColor('#6b7280')
       .text('Por haber completado exitosamente el examen de', 50, 280, {
           width: doc.page.width - 100,
           align: 'center'
       });
    doc.fontSize(20)
       .font('Helvetica-Bold')
       .fillColor('#2563eb')
       .text(certificacionData.nombre, 50, 310, {
           width: doc.page.width - 100,
           align: 'center'
       });

    // Calificación obtenida
    doc.fontSize(14)
       .font('Helvetica')
       .fillColor('#10b981')
       .text(`Con una calificación de ${intentoData.calificacion}/100`, 50, 350, {
           width: doc.page.width - 100,
           align: 'center'
       });

    const fechaExamen = new Date(intentoData.fechaFin);
    const fechaFormateada = fechaExamen.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#6b7280')
       .text(`Emitido el ${fechaFormateada} en ${userData.ciudad}, ${userData.pais}`, 50, 390, {
           width: doc.page.width - 100,
           align: 'center'
       });

    // ========================================
    // FIRMAS
    // ========================================

    const firmaY = 450;
    const firmaInstructorX = 150;
    const firmaCEOX = doc.page.width - 250;

    try {
        if (fs.existsSync(firmaInstructorPath)) {
            doc.image(firmaInstructorPath, firmaInstructorX, firmaY, { width: 120, height: 50 });
        }
    } catch (error) {
        console.log('Firma instructor no encontrada...');
    }

    doc.fontSize(12)
       .font('Helvetica-Bold')
       .fillColor('#111827')
       .text('Ana García', firmaInstructorX - 20, firmaY + 60, { width: 160, align: 'center' });

    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#6b7280')
       .text('Directora de Certificaciones', firmaInstructorX - 20, firmaY + 78, { width: 160, align: 'center' });

    try {
        if (fs.existsSync(firmaCEOPath)) {
            doc.image(firmaCEOPath, firmaCEOX, firmaY, { width: 120, height: 50 });
        }
    } catch (error) {
        console.log('Firma CEO no encontrada...');
    }

    doc.fontSize(12)
       .font('Helvetica-Bold')
       .fillColor('#111827')
       .text('Carlos Mendoza', firmaCEOX - 20, firmaY + 60, { width: 160, align: 'center' });

    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#6b7280')
       .text('CEO & Fundador', firmaCEOX - 20, firmaY + 78, { width: 160, align: 'center' });

    doc.fontSize(10)
       .font('Helvetica-Bold')
       .fillColor('#2563eb')
       .text('Credentia - Certifica tu Talento', 50, doc.page.height - 50, {
           width: doc.page.width - 100,
           align: 'center'
       });

    doc.fontSize(8)
       .font('Helvetica')
       .fillColor('#6b7280')
       .text('www.credentia.com | info@credentia.com | +52 449 123 4567', 50, doc.page.height - 35, {
           width: doc.page.width - 100,
           align: 'center'
       });

    // Finalizar documento
    doc.end();

    return doc;
}

module.exports = {
    generarCertificadoPDF
};