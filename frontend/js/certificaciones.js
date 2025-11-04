// Estado local de pagos (en memoria del navegador)
let pagosRealizados = {};

document.addEventListener("DOMContentLoaded", async () => {
  cargarEstadoPagos();
  setupCertificacionesEventListeners();

  // 👇 Solo verificamos pagos si el usuario está autenticado
  if (window.appUtils.isAuthenticated()) {
    await verificarPagosDelUsuario();
  }

  actualizarUISegunEstado();
});

// ============================
// Nueva función mejorada
// ============================
async function verificarPagosDelUsuario() {
  for (let i = 1; i <= 4; i++) {
    await verificarPago(i); // Espera cada verificación antes de continuar
  }
}

// ========================================
// CARGAR ESTADO DE PAGOS DESDE LOCALSTORAGE
// ========================================
function cargarEstadoPagos() {
  const pagosGuardados = localStorage.getItem("pagosRealizados");
  if (pagosGuardados) {
    pagosRealizados = JSON.parse(pagosGuardados);
  }
}

function guardarEstadoPagos() {
  localStorage.setItem("pagosRealizados", JSON.stringify(pagosRealizados));
}

// ========================================
// CONFIGURAR EVENT LISTENERS
// ========================================
function setupCertificacionesEventListeners() {
  // Botones de pago
  const btnsPago = document.querySelectorAll(".btn-pay");
  btnsPago.forEach((btn) => {
    btn.addEventListener("click", handlePago);
  });

  // Botones de iniciar examen
  const btnsStart = document.querySelectorAll(".btn-start");
  btnsStart.forEach((btn) => {
    btn.addEventListener("click", handleIniciarExamen);
  });
}

// ========================================
// ACTUALIZAR UI SEGÚN ESTADO
// ========================================
function actualizarUISegunEstado() {
  // Verificar cada certificación
  for (let certId = 1; certId <= 4; certId++) {
    const certCard = document.querySelector(`[data-cert-id="${certId}"]`);
    const btnPago = certCard.querySelector(".btn-pay");
    const paymentStatus = document.querySelector(
      `.payment-status[data-cert-id="${certId}"]`
    );

    // Si ya pagó, mostrar badge y deshabilitar botón de pago
    if (pagosRealizados[certId]) {
      btnPago.classList.add("btn-disabled");
      btnPago.textContent = "✓ Ya Pagado";
      btnPago.disabled = true;

      if (paymentStatus) {
        paymentStatus.style.display = "block";
      }
    }
  }
}

// ========================================
// MANEJAR PAGO
// ========================================

async function verificarPago(certId) {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${window.appUtils.API_URL}/certifications/status/${certId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  if (data.pagado) {
    pagosRealizados[certId] = true;
    guardarEstadoPagos();
    actualizarUISegunEstado();
  }
}

async function handlePago(e) {
  const certId = parseInt(e.target.dataset.certId);

  // Verificar si está logueado
  if (!window.appUtils.isAuthenticated()) {
    window.appUtils.showAlert(
      "Debes iniciar sesión para realizar el pago",
      "error"
    );
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
    return;
  }

  // Verificar si ya pagó
  if (pagosRealizados[certId]) {
    window.appUtils.showAlert(
      "Ya has realizado el pago de esta certificación",
      "warning"
    );
    return;
  }

  // Confirmar pago (simulado)
  // Confirmar pago (simulado)
  const result = await Swal.fire({
    title: "Confirmar Pago",
    text: "¿Deseas proceder con el pago de esta certificación?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#2563eb",
    cancelButtonColor: "#dc2626",
    confirmButtonText: "Sí, pagar",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) {
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const userData = window.appUtils.getUserData();

    // Simular pago en el backend
    const response = await fetch(
      `${window.appUtils.API_URL}/certifications/pay`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          certificationId: certId,
        }),
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      // Marcar como pagado localmente
      pagosRealizados[certId] = true;
      guardarEstadoPagos();

      // Actualizar UI
      actualizarUISegunEstado();

      window.appUtils.showAlert("¡Pago realizado exitosamente!", "success");
    } else {
      window.appUtils.showAlert(
        data.message || "Error al procesar el pago",
        "error"
      );
    }
  } catch (error) {
    console.error("Error en pago:", error);
    window.appUtils.showAlert("Error de conexión al procesar el pago", "error");
  }
}

// ========================================
// MANEJAR INICIO DE EXAMEN
// ========================================
async function handleIniciarExamen(e) {
  const certId = parseInt(e.target.dataset.certId);

  // VALIDACIÓN 1: Verificar si está logueado
  if (!window.appUtils.isAuthenticated()) {
    window.appUtils.showAlert(
      "Debes iniciar sesión para presentar el examen",
      "error"
    );
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
    return;
  }

  // ✅ VALIDACIÓN 2: Consultar al backend si realmente ya pagó
  const token = localStorage.getItem("token");
  const pagoResponse = await fetch(
    `${window.appUtils.API_URL}/certifications/status/${certId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const pagoData = await pagoResponse.json();

  if (!pagoData.pagado && !pagosRealizados[certId]) {
    window.appUtils.showAlert(
      "Debes realizar el pago antes de iniciar el examen",
      "warning"
    );
    return;
  }

  // VALIDACIÓN 3: Verificar si ya presentó el examen
  const intentosGuardados = localStorage.getItem("intentosExamen");
  if (intentosGuardados) {
    const intentos = JSON.parse(intentosGuardados);
    const userData = window.appUtils.getUserData();

    const intentoExistente = intentos.find(
      (i) => i.userId === userData.id && i.certificationId === certId
    );

    if (intentoExistente) {
      window.appUtils.showAlert(
        "El examen solo se puede aplicar una vez",
        "error"
      );
      return;
    }
  }

  try {
    // ✅ Si pasó las validaciones, iniciar examen en el backend
    const response = await fetch(`${window.appUtils.API_URL}/exam/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ certificationId: certId }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      localStorage.setItem(
        "examData",
        JSON.stringify({
          certificationId: certId,
          preguntas: data.data.preguntas,
          tiempoExamen: data.data.tiempoExamen,
          nombreCertificacion: data.data.nombreCertificacion,
          fechaInicio: Date.now(),
        })
      );

      window.location.href = "exam.html";
    } else {
      window.appUtils.showAlert(
        data.message || "Error al iniciar el examen",
        "error"
      );
    }
  } catch (error) {
    console.error("Error al iniciar examen:", error);
    window.appUtils.showAlert(
      "Error de conexión al iniciar el examen",
      "error"
    );
  }
}

// ========================================
// FUNCIONES AUXILIARES
// ========================================

// Verificar si el usuario ya presentó un examen específico
function yaPresentoExamen(certId) {
  const intentosGuardados = localStorage.getItem("intentosExamen");
  if (!intentosGuardados) return false;

  const intentos = JSON.parse(intentosGuardados);
  const userData = window.appUtils.getUserData();

  return intentos.some(
    (i) => i.userId === userData.id && i.certificationId === certId
  );
}

// Obtener información de una certificación
function getCertificationInfo(certId) {
  const certifications = {
    1: {
      nombre: "JavaScript Advanced",
      precio: 1500,
      tiempo: 20,
      puntuacion: 75,
    },
    2: {
      nombre: "Java Professional",
      precio: 2000,
      tiempo: 25,
      puntuacion: 80,
    },
    3: { nombre: "HTML5 Specialist", precio: 1200, tiempo: 15, puntuacion: 70 },
    4: {
      nombre: "CSS Master Designer",
      precio: 1400,
      tiempo: 18,
      puntuacion: 75,
    },
  };

  return certifications[certId];
}
