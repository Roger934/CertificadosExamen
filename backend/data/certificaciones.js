// Array de 4 certificaciones (estará activa/funcionando)
const certificaciones = [
    {
        id: 1,
        nombre: 'Certificación JavaScript Advanced',
        descripcion: 'Valida tu dominio profundo del lenguaje de programación más versátil de la web.',
        puntuacionMinima: 75,
        tiempoExamen: 20,
        costo: 1500,
        activa: true, // Solo esta certificación funcionará
        disponibleDesde: '2025-01-01',
        tecnologia: 'JavaScript',
        nivel: 'Avanzado'
    },
    {
        id: 2,
        nombre: 'Certificación Java Professional',
        descripcion: 'Certifica tu experiencia en desarrollo con uno de los lenguajes más demandados.',
        puntuacionMinima: 80,
        tiempoExamen: 25,
        costo: 2000,
        activa: false, // Deshabilitada
        disponibleDesde: '2025-06-01',
        tecnologia: 'Java',
        nivel: 'Profesional'
    },
    {
        id: 3,
        nombre: 'Certificación HTML5 Specialist',
        descripcion: 'Valida tu dominio del lenguaje fundamental de la web moderna.',
        puntuacionMinima: 70,
        tiempoExamen: 15,
        costo: 1200,
        activa: false, // Deshabilitada
        disponibleDesde: '2025-08-15',
        tecnologia: 'HTML5',
        nivel: 'Especialista'
    },
    {
        id: 4,
        nombre: 'Certificación CSS Master Designer',
        descripcion: 'Acredita tu experiencia en diseño y estilización avanzada de interfaces web.',
        puntuacionMinima: 75,
        tiempoExamen: 18,
        costo: 1400,
        activa: false, // Deshabilitada
        disponibleDesde: '2025-09-20',
        tecnologia: 'CSS',
        nivel: 'Master'
    }
];

module.exports = certificaciones;