const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Genera un certificado PDF para un usuario que aprobó el examen
 * 
 * Incluye:
 * - Nombre del usuario
 * - Nombre de la certificación
 * - Fecha, ciudad y país
 * - Compañía Credentia (nombre y logotipo)
 * - Firmas del instructor y del CEO
 */
function generarCertificadoPDF(userData, certificacionData, intentoData) {
    const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    // Rutas de imágenes
    const assetsPath = path.join(__dirname, '../assets');
    const logoPath = path.join(assetsPath, 'logo.png.png'); // tu archivo real
    const firmaInstructorPath = path.join(assetsPath, 'firma-instructor.png');
    const firmaCEOPath = path.join(assetsPath, 'firma-ceo.png');

    // ========================================
    // MARCO Y LOGO
    // ========================================
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
       .lineWidth(3)
       .stroke('#2563eb');

    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
       .lineWidth(1)
       .stroke('#7c3aed');

    // Logo de Credentia (más pequeño)
    try {
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, 60, 50, { width: 80 });
        }
    } catch {
        console.log('⚠ Logo de Credentia no encontrado');
    }

    // ========================================
    // TÍTULO PRINCIPAL
    // ========================================
    doc.fontSize(36)
       .font('Helvetica-Bold')
       .fillColor('#2563eb')
       .text('CERTIFICADO DE APROBACIÓN', 50, 110, {
           width: doc.page.width - 100,
           align: 'center'
       });

    doc.fontSize(18)
       .font('Helvetica-Bold')
       .fillColor('#2563eb')
       .text('Credentia', 50, 155, {
           width: doc.page.width - 100,
           align: 'center'
       });

    doc.fontSize(16)
       .font('Helvetica')
       .fillColor('#6b7280')
       .text('Se otorga a', 50, 200, { width: doc.page.width - 100, align: 'center' });

    doc.fontSize(28)
       .font('Helvetica-Bold')
       .fillColor('#111827')
       .text(userData.nombreCompleto, 50, 230, { width: doc.page.width - 100, align: 'center' });

    doc.fontSize(14)
       .font('Helvetica')
       .fillColor('#6b7280')
       .text('Por haber completado exitosamente el examen de', 50, 280, { width: doc.page.width - 100, align: 'center' });

    doc.fontSize(20)
       .font('Helvetica-Bold')
       .fillColor('#2563eb')
       .text(certificacionData.nombre, 50, 310, { width: doc.page.width - 100, align: 'center' });

    // Calificación
    doc.fontSize(14)
       .font('Helvetica')
       .fillColor('#10b981')
       .text(`Con una calificación de ${intentoData.calificacion}/100`, 50, 350, { width: doc.page.width - 100, align: 'center' });

    // Fecha y ciudad
    const fechaExamen = new Date(intentoData.fechaFin);
    const fechaFormateada = fechaExamen.toLocaleDateString('es-MX', {
        year: 'numeric', month: 'long', day: 'numeric'
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
    } catch {
        console.log('Firma del instructor no encontrada');
    }

    doc.fontSize(12).font('Helvetica-Bold').fillColor('#111827')
       .text('Rogelio Gutiérrez', firmaInstructorX - 20, firmaY + 60, { width: 160, align: 'center' });
    doc.fontSize(10).font('Helvetica').fillColor('#6b7280')
       .text('Director de Certificaciones', firmaInstructorX - 20, firmaY + 78, { width: 160, align: 'center' });

    try {
        if (fs.existsSync(firmaCEOPath)) {
            doc.image(firmaCEOPath, firmaCEOX, firmaY, { width: 120, height: 50 });
        }
    } catch {
        console.log('Firma del CEO no encontrada');
    }

    doc.fontSize(12).font('Helvetica-Bold').fillColor('#111827')
       .text('Diego Ramos', firmaCEOX - 20, firmaY + 60, { width: 160, align: 'center' });
    doc.fontSize(10).font('Helvetica').fillColor('#6b7280')
       .text('CEO & Fundador', firmaCEOX - 20, firmaY + 78, { width: 160, align: 'center' });

    // ========================================
    // PIE DE PÁGINA
    // ========================================
    doc.fontSize(10)
       .font('Helvetica-Bold')
       .fillColor('#2563eb')
       .text('Credentia - Certifica tu Talento', 50, doc.page.height - 50, {
           width: doc.page.width - 100, align: 'center'
       });

    doc.fontSize(8)
       .font('Helvetica')
       .fillColor('#6b7280')
       .text('www.credentia.com | info@credentia.com | +52 449 123 4567', 50, doc.page.height - 35, {
           width: doc.page.width - 100, align: 'center'
       });

    doc.end();
    return doc;
}

module.exports = { generarCertificadoPDF };