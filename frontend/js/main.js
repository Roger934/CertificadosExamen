const API_URL = "http://localhost:3000/api";

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  initAuth();
  setupEventListeners();
});

// ========================================
// GESTIÓN DE AUTENTICACIÓN
// ========================================
function initAuth() {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("userData");

  if (token && userData) {
    const user = JSON.parse(userData);
    updateUIForLoggedInUser(user);
  } else {
    updateUIForLoggedOutUser();
  }
}

function updateUIForLoggedInUser(user) {
  const userDisplay = document.getElementById("user-display");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");

  if (userDisplay) {
    userDisplay.textContent = `👤 ${user.cuenta}`;
    userDisplay.style.display = "inline-block";
  }

  if (loginBtn) {
    loginBtn.style.display = "none";
  }

  if (logoutBtn) {
    logoutBtn.style.display = "inline-block";
  }
}

function updateUIForLoggedOutUser() {
  const userDisplay = document.getElementById("user-display");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");

  if (userDisplay) {
    userDisplay.style.display = "none";
  }

  if (loginBtn) {
    loginBtn.style.display = "inline-block";
  }

  if (logoutBtn) {
    logoutBtn.style.display = "none";
  }
}

// ========================================
// EVENT LISTENERS
// ========================================
function setupEventListeners() {
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
}

// ========================================
// LOGOUT
// ========================================
async function handleLogout() {
  try {
    const token = localStorage.getItem("token");

    // Llamar al API de logout
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Limpiar localStorage independientemente de la respuesta
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("examData");

    // Mostrar alerta de éxito
    showAlert("Sesión cerrada exitosamente", "success");

    // Actualizar UI
    updateUIForLoggedOutUser();

    // Redirigir a inicio después de 1 segundo
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  } catch (error) {
    console.error("Error en logout:", error);

    // Limpiar localStorage de todas formas
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("examData");

    updateUIForLoggedOutUser();
    window.location.href = "index.html";
  }
}

// ========================================
// VERIFICAR AUTENTICACIÓN
// ========================================
function isAuthenticated() {
  const token = localStorage.getItem("token");
  return token !== null;
}

function getUserData() {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
}

// ========================================
// FUNCIÓN DE ALERTA
// ========================================
function showAlert(message, type = "info") {
  const iconMap = {
    success: "success",
    error: "error",
    warning: "warning",
    info: "info",
  };

  const titleMap = {
    success: "¡Éxito!",
    error: "Error",
    warning: "Advertencia",
    info: "Información",
  };

  Swal.fire({
    title: titleMap[type] || "Información",
    text: message,
    icon: iconMap[type] || "info",
    confirmButtonColor: "#2563eb",
    confirmButtonText: "Aceptar",
    timer: type === "success" ? 2000 : undefined,
    timerProgressBar: type === "success" ? true : false,
  });
}

// ========================================
// FUNCIONES AUXILIARES
// ========================================
function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString("es-MX", options);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount);
}

// Exportar funciones para uso en otros archivos
window.appUtils = {
  isAuthenticated,
  getUserData,
  showAlert,
  formatDate,
  formatCurrency,
  API_URL,
};
