const certificaciones = require('../data/certificaciones');
const preguntasPorCertificacion = require('../data/preguntas');
const users = require('../data/users');
const { intentosExamen, pagos } = require('../data/storage');
const { generarExamen } = require('../utils/examGenerator');
const { calificarExamen } = require('../utils/examGrader');

// ========================================
// START EXAM - Iniciar examen ⭐
// ========================================
const startExam = (req, res) => {
    const { certificationId } = req.body;
    const userId = req.userId; // Viene del middleware de autenticación

    // Validar certificationId
    if (!certificationId) {
        return res.status(400).json({
            success: false,
            message: 'ID de certificación no proporcionado'
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

    // Verificar si la certificación está activa
    if (!certificacion.activa) {
        return res.status(403).json({
            success: false,
            message: `Esta certificación estará disponible a partir del ${certificacion.disponibleDesde}`
        });
    }

    // Verificar si ya pagó
    const pago = pagos.find(p => p.userId === userId && p.certificationId === parseInt(certificationId));

    if (!pago) {
        return res.status(403).json({
            success: false,
            message: 'Debes realizar el pago antes de iniciar el examen'
        });
    }

    // Verificar si ya presentó el examen
    const intentoExistente = intentosExamen.find(
        i => i.userId === userId && i.certificationId === parseInt(certificationId)
    );

    if (intentoExistente) {
        return res.status(403).json({
            success: false,
            message: 'Ya has presentado este examen. Solo se permite un intento'
        });
    }

    // Obtener banco de preguntas
    const bancoPreguntas = preguntasPorCertificacion[certificationId];

    if (!bancoPreguntas || bancoPreguntas.length === 0) {
        return res.status(500).json({
            success: false,
            message: 'No hay preguntas disponibles para esta certificación'
        });
    }

    // Generar examen (8 preguntas aleatorias con opciones mezcladas)
    const examen = generarExamen(bancoPreguntas, 8);

    // Crear intento (guardamos las preguntas originales para calificar después)
    const intento = {
        id: intentosExamen.length + 1,
        userId,
        certificationId: parseInt(certificationId),
        preguntas: examen.preguntas,
        preguntasOriginales: examen.preguntasOriginales, // Necesario para calificar
        fechaInicio: new Date(),
        completado: false
    };

    // Guardar intento en memoria
    intentosExamen.push(intento);

    // ⭐ Respuesta incluye el tiempo del examen
    res.json({
        success: true,
        message: 'Examen generado exitosamente',
        data: {
            preguntas: examen.preguntas, // Solo preguntas sin respuestas correctas
            nombreCertificacion: certificacion.nombre,
            tiempoExamen: certificacion.tiempoExamen, // ⭐ Tiempo en minutos
            puntuacionMinima: certificacion.puntuacionMinima,
            intentoId: intento.id
        }
    });

    console.log(`📝 Examen iniciado: Usuario ${userId}, Certificación ${certificationId}`);
};

// ========================================
// SUBMIT EXAM - Enviar respuestas
// ========================================
const submitExam = (req, res) => {
    const { certificationId, respuestas } = req.body;
    const userId = req.userId;

    // Validaciones
    if (!certificationId || !respuestas || !Array.isArray(respuestas)) {
        return res.status(400).json({
            success: false,
            message: 'Datos inválidos'
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

    // Buscar intento activo
    const intento = intentosExamen.find(
        i => i.userId === userId && 
             i.certificationId === parseInt(certificationId) && 
             !i.completado
    );

    if (!intento) {
        return res.status(404).json({
            success: false,
            message: 'No se encontró un intento activo de examen'
        });
    }

    // Calificar examen
    const resultado = calificarExamen(intento.preguntasOriginales, respuestas);

    // Determinar si aprobó
    const aprobo = resultado.calificacion >= certificacion.puntuacionMinima;

    // Actualizar intento
    intento.completado = true;
    intento.respuestas = respuestas;
    intento.calificacion = resultado.calificacion;
    intento.aprobo = aprobo;
    intento.fechaFin = new Date();

    // Respuesta
    res.json({
        success: true,
        message: aprobo ? '¡Felicidades! Has aprobado' : 'No has alcanzado la puntuación mínima',
        data: {
            calificacion: resultado.calificacion,
            puntuacionMinima: certificacion.puntuacionMinima,
            aprobo,
            respuestasCorrectas: resultado.correctas,
            respuestasIncorrectas: resultado.incorrectas
        }
    });

    console.log(`✅ Examen evaluado: Usuario ${userId}, Calificación: ${resultado.calificacion}, Aprobó: ${aprobo}`);
};

module.exports = {
    startExam,
    submitExam
};