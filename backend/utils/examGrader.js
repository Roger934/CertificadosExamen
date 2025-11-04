/**
 * Califica un examen comparando respuestas del usuario con las correctas
 * @param {Array} preguntasOriginales - Preguntas con respuestas correctas
 * @param {Array} respuestasUsuario - Respuestas enviadas por el usuario
 * @returns {Object} - Resultado con calificación, correctas e incorrectas
 */
function calificarExamen(preguntasOriginales, respuestasUsuario) {
    // Validar que se recibieron las respuestas
    if (!respuestasUsuario || !Array.isArray(respuestasUsuario)) {
        throw new Error('Respuestas del usuario inválidas');
    }

    // Validar que se recibieron las preguntas originales
    if (!preguntasOriginales || !Array.isArray(preguntasOriginales)) {
        throw new Error('Preguntas originales inválidas');
    }

    let correctas = 0;
    let incorrectas = 0;

    // Comparar cada respuesta con la respuesta correcta
    preguntasOriginales.forEach((pregunta, index) => {
        const respuestaUsuario = respuestasUsuario[index];
        
        if (respuestaUsuario === pregunta.respuestaCorrecta) {
            correctas++;
        } else {
            incorrectas++;
        }
    });

    // Calcular calificación sobre 100
    const totalPreguntas = preguntasOriginales.length;
    const calificacion = Math.round((correctas / totalPreguntas) * 100);

    return {
        calificacion,          
        correctas,             
        incorrectas,            
        totalPreguntas,         
        porcentajeAciertos: Math.round((correctas / totalPreguntas) * 100) // % de aciertos
    };
}

module.exports = {
    calificarExamen
};