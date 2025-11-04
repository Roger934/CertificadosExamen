// Banco de 16 preguntas para cada certificación
// Solo JavaScript (id: 1) estará activa

const preguntasPorCertificacion = {
    // ========================================
    // CERTIFICACIÓN JAVASCRIPT (ACTIVA) ⭐
    // ========================================
    1: [
        {
            id: 1,
            pregunta: '¿Cuál es la diferencia principal entre let y var en JavaScript?',
            opciones: [
                'let tiene alcance de bloque, var tiene alcance de función',
                'var es más rápido que let',
                'let no puede ser reasignado',
                'No hay diferencia, son sinónimos'
            ],
            respuestaCorrecta: 'let tiene alcance de bloque, var tiene alcance de función'
        },
        {
            id: 2,
            pregunta: '¿Qué devuelve typeof null en JavaScript?',
            opciones: [
                'object',
                'null',
                'undefined',
                'NaN'
            ],
            respuestaCorrecta: 'object'
        },
        {
            id: 3,
            pregunta: '¿Cuál es la forma correcta de crear una promesa en JavaScript?',
            opciones: [
                'new Promise((resolve, reject) => {})',
                'Promise.create((resolve, reject) => {})',
                'createPromise((resolve, reject) => {})',
                'new AsyncPromise((resolve, reject) => {})'
            ],
            respuestaCorrecta: 'new Promise((resolve, reject) => {})'
        },
        {
            id: 4,
            pregunta: '¿Qué es un closure en JavaScript?',
            opciones: [
                'Una función que tiene acceso a variables de su contexto léxico externo',
                'Una función que cierra la aplicación',
                'Un tipo especial de objeto',
                'Una forma de declarar constantes'
            ],
            respuestaCorrecta: 'Una función que tiene acceso a variables de su contexto léxico externo'
        },
        {
            id: 5,
            pregunta: '¿Cuál de estos métodos NO muta el array original?',
            opciones: [
                'map()',
                'push()',
                'splice()',
                'sort()'
            ],
            respuestaCorrecta: 'map()'
        },
        {
            id: 6,
            pregunta: '¿Qué hace el operador spread (...) en JavaScript?',
            opciones: [
                'Expande elementos de un iterable',
                'Multiplica números',
                'Concatena strings',
                'Divide arrays'
            ],
            respuestaCorrecta: 'Expande elementos de un iterable'
        },
        {
            id: 7,
            pregunta: '¿Cuál es el resultado de: 0.1 + 0.2 === 0.3?',
            opciones: [
                'false',
                'true',
                'undefined',
                'NaN'
            ],
            respuestaCorrecta: 'false'
        },
        {
            id: 8,
            pregunta: '¿Qué es el Event Loop en JavaScript?',
            opciones: [
                'Mecanismo que gestiona la ejecución de código asíncrono',
                'Una estructura de datos circular',
                'Un tipo de bucle for especial',
                'Una función recursiva'
            ],
            respuestaCorrecta: 'Mecanismo que gestiona la ejecución de código asíncrono'
        },
        {
            id: 9,
            pregunta: '¿Cuál es la diferencia entre == y === en JavaScript?',
            opciones: [
                '=== compara valor y tipo, == solo valor',
                '== es más rápido que ===',
                'No hay diferencia',
                '=== solo funciona con números'
            ],
            respuestaCorrecta: '=== compara valor y tipo, == solo valor'
        },
        {
            id: 10,
            pregunta: '¿Qué método se usa para convertir un JSON string a objeto JavaScript?',
            opciones: [
                'JSON.parse()',
                'JSON.stringify()',
                'JSON.toObject()',
                'JSON.convert()'
            ],
            respuestaCorrecta: 'JSON.parse()'
        },
        {
            id: 11,
            pregunta: '¿Qué es el hoisting en JavaScript?',
            opciones: [
                'Proceso donde declaraciones son movidas al inicio del scope',
                'Una forma de optimizar código',
                'Un método para comprimir archivos',
                'Una técnica de debugging'
            ],
            respuestaCorrecta: 'Proceso donde declaraciones son movidas al inicio del scope'
        },
        {
            id: 12,
            pregunta: '¿Cuál es la forma correcta de declarar una función flecha (arrow function)?',
            opciones: [
                'const myFunc = () => {}',
                'function => myFunc() {}',
                'arrow myFunc() {}',
                'const myFunc -> {}'
            ],
            respuestaCorrecta: 'const myFunc = () => {}'
        },
        {
            id: 13,
            pregunta: '¿Qué hace el método Array.prototype.reduce()?',
            opciones: [
                'Reduce un array a un único valor',
                'Elimina elementos duplicados',
                'Ordena el array',
                'Filtra elementos'
            ],
            respuestaCorrecta: 'Reduce un array a un único valor'
        },
        {
            id: 14,
            pregunta: '¿Cuál es el valor de this en una arrow function?',
            opciones: [
                'Se hereda del contexto léxico donde fue definida',
                'Siempre es window',
                'Es undefined',
                'Se puede cambiar con bind()'
            ],
            respuestaCorrecta: 'Se hereda del contexto léxico donde fue definida'
        },
        {
            id: 15,
            pregunta: '¿Qué es destructuring en JavaScript?',
            opciones: [
                'Una forma de extraer valores de arrays u objetos',
                'Una forma de eliminar propiedades',
                'Un método para copiar objetos',
                'Una técnica de compresión'
            ],
            respuestaCorrecta: 'Una forma de extraer valores de arrays u objetos'
        },
        {
            id: 16,
            pregunta: '¿Cuál es la diferencia entre null y undefined?',
            opciones: [
                'null es asignado intencionalmente, undefined es ausencia de valor',
                'No hay diferencia',
                'null es un string, undefined es un número',
                'undefined es más antiguo que null'
            ],
            respuestaCorrecta: 'null es asignado intencionalmente, undefined es ausencia de valor'
        }
    ],

    // Preguntas para las otras certificaciones (deshabilitadas pero incluidas)
    2: [], // Java (no implementadas aún)
    3: [], // HTML (no implementadas aún)
    4: []  // CSS (no implementadas aún)
};

module.exports = preguntasPorCertificacion;