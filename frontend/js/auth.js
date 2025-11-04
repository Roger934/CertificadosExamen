document.addEventListener('DOMContentLoaded', () => {
    // Verificar si ya está logueado
    if (window.appUtils.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    setupLoginForm();
});

// ========================================
// CONFIGURAR FORMULARIO DE LOGIN
// ========================================
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

// ========================================
// MANEJAR LOGIN
// ========================================
async function handleLogin(e) {
    e.preventDefault();

    const cuenta = document.getElementById('cuenta').value.trim();
    const password = document.getElementById('password').value;

    // Validación básica
    if (!cuenta || !password) {
        window.appUtils.showAlert('Por favor, completa todos los campos', 'error');
        return;
    }

    // Deshabilitar botón durante el proceso
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Iniciando sesión...';

    try {
        const response = await fetch(`${window.appUtils.API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cuenta,
                password
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Guardar token y datos del usuario en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));

            // Mostrar alerta de éxito
            window.appUtils.showAlert('Acceso permitido', 'success');

            // Redirigir a la página principal
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);

        } else {
            // Error en credenciales
            window.appUtils.showAlert(
                data.message || 'Error en las credenciales', 
                'error'
            );
            
            // Limpiar campos
            document.getElementById('password').value = '';
        }

    } catch (error) {
        console.error('Error en login:', error);
        window.appUtils.showAlert(
            'Error de conexión. Por favor, verifica que el servidor esté activo.', 
            'error'
        );
    } finally {
        // Rehabilitar botón
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// ========================================
// FUNCIONES AUXILIARES
// ========================================

// Validar formato de cuenta (opcional)
function validateCuenta(cuenta) {
    // Puedes agregar validaciones específicas aquí
    return cuenta.length >= 3;
}

// Validar contraseña (opcional)
function validatePassword(password) {
    // Puedes agregar validaciones específicas aquí
    return password.length >= 4;
}