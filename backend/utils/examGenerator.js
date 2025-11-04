/**
 * Genera un examen con preguntas aleatorias y opciones mezcladas
 * @param {Array} bancoPreguntas - Array de 16 preguntas del banco
 * @param {Number} cantidad - Cantidad de preguntas a seleccionar (por defecto 8)
 * @returns {Object} - Objeto con preguntas para frontend y originales para calificar
 */
function generarExamen(bancoPreguntas, cantidad = 8) {
    // Validar que haya suficientes preguntas
    if (!bancoPreguntas || bancoPreguntas.length < cantidad) {
        throw new Error(`Se necesitan al menos ${cantidad} preguntas en el banco`);
    }

    // Clonar banco de preguntas para no modificar el original
    const preguntasDisponibles = [...bancoPreguntas];
    
    // Seleccionar preguntas aleatorias NO repetidas
    const preguntasSeleccionadas = [];
    
    for (let i = 0; i < cantidad && preguntasDisponibles.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * preguntasDisponibles.length);
        preguntasSeleccionadas.push(preguntasDisponibles.splice(randomIndex, 1)[0]);
    }

    // Guardar preguntas originales (necesarias para calificar después)
    const preguntasOriginales = preguntasSeleccionadas.map(p => ({ ...p }));

    // Preparar preguntas para enviar al frontend (con opciones mezcladas)
    const preguntasParaEnviar = preguntasSeleccionadas.map(pregunta => {
        // Mezclar opciones aleatoriamente usando el algoritmo de Fisher-Yates
        const opcionesMezcladas = [...pregunta.opciones].sort(() => Math.random() - 0.5);
        
        return {
            id: pregunta.id,
            pregunta: pregunta.pregunta,
            opciones: opcionesMezcladas
        };
    });

    return {
        preguntas: preguntasParaEnviar,     
        preguntasOriginales: preguntasOriginales
    };
}

module.exports = {
    generarExamen
};