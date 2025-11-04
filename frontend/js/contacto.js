document.addEventListener('DOMContentLoaded', () => {
    // Inicializar appUtils si no existe
    window.appUtils = window.appUtils || {};
    window.appUtils.API_URL = "http://192.168.100.86:3000/api";

    setupContactForm();
});


// ========================================
// CONFIGURAR FORMULARIO DE CONTACTO
// ========================================
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

// ========================================
// MANEJAR ENVÍO DEL FORMULARIO
// ========================================
async function handleContactSubmit(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    // Validación básica
    if (!nombre || !email || !mensaje) {
        window.appUtils.showAlert('Por favor, completa todos los campos', 'error');
        return;
    }

    // Validar formato de email
    if (!validateEmail(email)) {
        window.appUtils.showAlert('Por favor, ingresa un correo electrónico válido', 'error');
        return;
    }

    // Deshabilitar botón durante el proceso
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '📧 Enviando...';

    try {
        const response = await fetch(`${window.appUtils.API_URL}/contact/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                email,
                mensaje
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Mostrar alerta de éxito
            window.appUtils.showAlert('Mensaje Enviado', 'success');

            // Limpiar formulario
            e.target.reset();
        } else {
            window.appUtils.showAlert(
                data.message || 'Error al enviar el mensaje', 
                'error'
            );
        }

    } catch (error) {
        console.error('Error en contacto:', error);
        window.appUtils.showAlert(
            'Error de conexión. Por favor, verifica que el servidor esté activo.', 
            'error'
        );
    } finally {
        // Rehabilitar botón
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// ========================================
// FUNCIONES AUXILIARES
// ========================================

// Validar formato de email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}