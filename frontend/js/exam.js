let timerInterval = null;
let tiempoRestante = 0; // en segundos
let examData = null;
let isSubmitting = false;

document.addEventListener("DOMContentLoaded", () => {
  // Verificar autenticación
  if (!window.appUtils.isAuthenticated()) {
    window.appUtils.showAlert(
      "Debes iniciar sesión para presentar el examen",
      "error"
    );
    window.location.href = "login.html";
    return;
  }

  // Cargar datos del examen
  cargarDatosExamen();

  // Prevenir recarga de página
  prevenirRecargaPagina();
});

// ========================================
// CARGAR DATOS DEL EXAMEN
// ========================================
function cargarDatosExamen() {
  const examDataStr = localStorage.getItem("examData");

  if (!examDataStr) {
    window.appUtils.showAlert("No hay un examen activo", "error");
    setTimeout(() => {
      window.location.href = "certificaciones.html";
    }, 2000);
    return;
  }

  examData = JSON.parse(examDataStr);

  // Mostrar información del usuario
  const userData = window.appUtils.getUserData();
  const userDisplayExam = document.getElementById("user-display-exam");
  if (userDisplayExam) {
    userDisplayExam.textContent = `👤 ${userData.nombreCompleto}`;
  }

  // Mostrar información del examen
  mostrarInformacionExamen();

  // Renderizar preguntas
  renderizarPreguntas(examData.preguntas);

  // ⭐ INICIAR TEMPORIZADOR
  iniciarTemporizador(examData.tiempoExamen);

  // Configurar envío del formulario
  setupFormSubmit();

  // Ocultar loader
  document.getElementById("exam-loader").style.display = "none";
  document.getElementById("exam-form").style.display = "block";
}

// ========================================
// MOSTRAR INFORMACIÓN DEL EXAMEN
// ========================================
function mostrarInformacionExamen() {
  document.getElementById(
    "exam-title"
  ).textContent = `Examen: ${examData.nombreCertificacion}`;
  document.getElementById(
    "exam-date"
  ).textContent = `📅 ${window.appUtils.formatDate(new Date())}`;
}

// ========================================
// ⭐ TEMPORIZADOR (FEATURE PRINCIPAL)
// ========================================
function iniciarTemporizador(minutos) {
  tiempoRestante = minutos * 60; // Convertir a segundos

  // Actualizar display inmediatamente
  actualizarDisplayTemporizador();

  // Actualizar cada segundo
  timerInterval = setInterval(() => {
    tiempoRestante--;
    actualizarDisplayTemporizador();

    // ⚠️ ADVERTENCIAS DE TIEMPO
    if (tiempoRestante === 120) {
      // 2 minutos
      mostrarAdvertenciaTiempo("¡Atención! Quedan 2 minutos", "warning");
    } else if (tiempoRestante === 60) {
      // 1 minuto
      mostrarAdvertenciaTiempo("¡Cuidado! Queda 1 minuto", "warning");
    } else if (tiempoRestante === 30) {
      // 30 segundos
      mostrarAdvertenciaTiempo("¡Últimos 30 segundos!", "warning");
    }

    // ⏰ TIEMPO AGOTADO - ENVÍO AUTOMÁTICO
    if (tiempoRestante <= 0) {
      clearInterval(timerInterval);
      enviarRespuestasAutomaticamente();
    }
  }, 1000);
}

function actualizarDisplayTemporizador() {
  const minutos = Math.floor(tiempoRestante / 60);
  const segundos = tiempoRestante % 60;

  const display = `${minutos.toString().padStart(2, "0")}:${segundos
    .toString()
    .padStart(2, "0")}`;

  const timerElement = document.getElementById("timer-display");
  timerElement.textContent = display;

  // Cambiar estilos según tiempo restante
  timerElement.classList.remove(
    "timer-normal",
    "timer-warning",
    "timer-critical"
  );

  if (tiempoRestante <= 30) {
    timerElement.classList.add("timer-critical");
    document.getElementById("timer-warning").style.display = "block";
  } else if (tiempoRestante <= 120) {
    timerElement.classList.add("timer-warning");
  } else {
    timerElement.classList.add("timer-normal");
    document.getElementById("timer-warning").style.display = "none";
  }
}

function mostrarAdvertenciaTiempo(mensaje, tipo) {
  window.appUtils.showAlert(mensaje, tipo);
}

// ========================================
// RENDERIZAR PREGUNTAS
// ========================================
function renderizarPreguntas(preguntas) {
  const container = document.getElementById("questions-container");
  container.innerHTML = "";

  preguntas.forEach((pregunta, index) => {
    const questionCard = document.createElement("div");
    questionCard.className = "question-card";

    questionCard.innerHTML = `
            <div class="question-header">
                <div class="question-number">${index + 1}</div>
                <div class="question-text">${pregunta.pregunta}</div>
            </div>
            <div class="options-container">
                ${pregunta.opciones
                  .map(
                    (opcion, optIndex) => `
                    <div class="option-item">
                        <input 
                            type="radio" 
                            id="q${index}_opt${optIndex}" 
                            name="question_${index}" 
                            value="${opcion}"
                        >
                        <label for="q${index}_opt${optIndex}">${opcion}</label>
                    </div>
                `
                  )
                  .join("")}
            </div>
        `;

    container.appendChild(questionCard);
  });
}

// ========================================
// CONFIGURAR ENVÍO DEL FORMULARIO
// ========================================
function setupFormSubmit() {
  const form = document.getElementById("exam-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Confirmar envío
    // Confirmar envío
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas enviar tus respuestas? No podrás modificarlas después.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "Sí, enviar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    await enviarRespuestas();
  });
}

// ========================================
// RECOPILAR RESPUESTAS DEL USUARIO
// ========================================
function recopilarRespuestas() {
  const respuestas = [];

  examData.preguntas.forEach((pregunta, index) => {
    const radioSeleccionado = document.querySelector(
      `input[name="question_${index}"]:checked`
    );
    respuestas.push(radioSeleccionado ? radioSeleccionado.value : null);
  });

  return respuestas;
}

// ========================================
// ENVIAR RESPUESTAS AL BACKEND
// ========================================
async function enviarRespuestas() {
  if (isSubmitting) return;
  isSubmitting = true;

  // Detener temporizador
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  // Deshabilitar formulario
  const form = document.getElementById("exam-form");
  form.classList.add("submitting");

  const respuestas = recopilarRespuestas();

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${window.appUtils.API_URL}/exam/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        certificationId: examData.certificationId,
        respuestas: respuestas,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Guardar intento
      guardarIntento(data.data);

      // Mostrar resultado
      mostrarResultado(data.data);

      // Limpiar datos del examen
      localStorage.removeItem("examData");
    } else {
      window.appUtils.showAlert(
        data.message || "Error al enviar respuestas",
        "error"
      );
      form.classList.remove("submitting");
      isSubmitting = false;
    }
  } catch (error) {
    console.error("Error al enviar respuestas:", error);
    window.appUtils.showAlert(
      "Error de conexión al enviar respuestas",
      "error"
    );
    form.classList.remove("submitting");
    isSubmitting = false;
  }
}

// ========================================
// ⏰ ENVÍO AUTOMÁTICO POR TIEMPO AGOTADO
// ========================================
async function enviarRespuestasAutomaticamente() {
  window.appUtils.showAlert(
    "El tiempo ha finalizado. Enviando respuestas automáticamente...",
    "info"
  );

  // Deshabilitar formulario
  const form = document.getElementById("exam-form");
  form.classList.add("submitting");

  // Enviar respuestas
  await enviarRespuestas();
}

// ========================================
// GUARDAR INTENTO EN LOCALSTORAGE
// ========================================
function guardarIntento(resultado) {
  const userData = window.appUtils.getUserData();

  let intentos = [];
  const intentosGuardados = localStorage.getItem("intentosExamen");

  if (intentosGuardados) {
    intentos = JSON.parse(intentosGuardados);
  }

  intentos.push({
    userId: userData.id,
    certificationId: examData.certificationId,
    calificacion: resultado.calificacion,
    aprobo: resultado.aprobo,
    fecha: new Date().toISOString(),
  });

  localStorage.setItem("intentosExamen", JSON.stringify(intentos));
}

// ========================================
// MOSTRAR RESULTADO
// ========================================
function mostrarResultado(resultado) {
  const modal = document.getElementById("result-modal");
  const resultIcon = document.getElementById("result-icon");
  const resultTitle = document.getElementById("result-title");
  const resultMessage = document.getElementById("result-message");
  const resultScore = document.getElementById("result-score");
  const downloadBtn = document.getElementById("download-cert-btn");

  if (resultado.aprobo) {
    resultIcon.textContent = "🎉";
    resultTitle.textContent = "¡Felicidades! Has aprobado";
    resultTitle.style.color = "var(--success-color)";
    resultMessage.textContent = `Has demostrado tus conocimientos en ${examData.nombreCertificacion}. Tu certificado está listo para descargar.`;
    downloadBtn.style.display = "inline-block";
  } else {
    resultIcon.textContent = "😔";
    resultTitle.textContent = "No has aprobado";
    resultTitle.style.color = "var(--error-color)";
    resultMessage.textContent = `Necesitas ${resultado.puntuacionMinima} puntos para aprobar. Te invitamos a seguir estudiando e intentarlo nuevamente en el futuro.`;
    downloadBtn.style.display = "none";
  }

  resultScore.textContent = `Calificación: ${resultado.calificacion} / 100`;

  modal.style.display = "flex";

  // Configurar botones del modal
  setupModalButtons(resultado);
}

// ========================================
// CONFIGURAR BOTONES DEL MODAL
// ========================================
function setupModalButtons(resultado) {
  const downloadBtn = document.getElementById("download-cert-btn");
  const closeBtn = document.getElementById("close-modal-btn");

  downloadBtn.onclick = () => descargarCertificado();

  closeBtn.onclick = () => {
    window.location.href = "certificaciones.html";
  };
}

// ========================================
// DESCARGAR CERTIFICADO PDF
// ========================================
async function descargarCertificado() {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${window.appUtils.API_URL}/exam/pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        certificationId: examData.certificationId,
      }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Certificado_${examData.nombreCertificacion.replace(
        / /g,
        "_"
      )}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      window.appUtils.showAlert(
        "Certificado descargado exitosamente",
        "success"
      );
    } else {
      window.appUtils.showAlert("Error al descargar el certificado", "error");
    }
  } catch (error) {
    console.error("Error al descargar certificado:", error);
    window.appUtils.showAlert(
      "Error de conexión al descargar certificado",
      "error"
    );
  }
}

// ========================================
// PREVENIR RECARGA DE PÁGINA
// ========================================
function prevenirRecargaPagina() {
  window.addEventListener("beforeunload", (e) => {
    if (timerInterval && !isSubmitting) {
      e.preventDefault();
      e.returnValue =
        "¿Estás seguro de salir? Perderás tu progreso en el examen.";
      return e.returnValue;
    }
  });
}

// ========================================
// LIMPIAR AL SALIR
// ========================================
window.addEventListener("unload", () => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});
