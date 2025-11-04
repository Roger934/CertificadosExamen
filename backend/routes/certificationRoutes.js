const express = require("express");
const router = express.Router();
const certificaciones = require("../data/certificaciones");
const { pagos } = require("../data/storage");
const authRequired = require("../middlewares/authMiddleware");

// ========================================
// RUTAS DE CERTIFICACIONES
// ========================================

// GET /api/certifications - Obtener todas las certificaciones
router.get("/", (req, res) => {
  res.json({
    success: true,
    data: certificaciones,
  });
});

// ✅ GET /api/certifications/status/:id - Verificar si el usuario ya pagó
router.get("/status/:id", authRequired, (req, res) => {
  const certId = parseInt(req.params.id);
  const userId = req.userId;

  const pago = pagos.find(
    (p) => p.userId === userId && p.certificationId === certId
  );

  res.json({
    success: true,
    pagado: !!pago,
  });
});

// ✅ POST /api/certifications/pay - Simular pago de certificación
router.post("/pay", authRequired, (req, res) => {
  const { certificationId } = req.body;
  const userId = req.userId;

  // Validar que se envió el ID de certificación
  if (!certificationId) {
    return res.status(400).json({
      success: false,
      message: "ID de certificación no proporcionado",
    });
  }

  // Verificar si ya pagó esta certificación
  const pagoExistente = pagos.find(
    (p) =>
      p.userId === userId && p.certificationId === parseInt(certificationId)
  );

  if (pagoExistente) {
    return res.status(400).json({
      success: false,
      message: "Ya has realizado el pago de esta certificación",
    });
  }

  // Buscar la certificación
  const certificacion = certificaciones.find(
    (c) => c.id === parseInt(certificationId)
  );

  if (!certificacion) {
    return res.status(404).json({
      success: false,
      message: "Certificación no encontrada",
    });
  }

  // Registrar el pago (simulado)
  const nuevoPago = {
    id: pagos.length + 1,
    userId,
    certificationId: parseInt(certificationId),
    monto: certificacion.costo,
    fecha: new Date().toISOString(),
    metodoPago: "simulado",
  };

  pagos.push(nuevoPago);
  //console.log("💾 Estado actual de pagos:", pagos); //AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

  console.log(
    `💳 Pago registrado: Usuario ${userId}, Certificación ${certificationId}, Monto: $${certificacion.costo} MXN`
  );

  res.json({
    success: true,
    message: "Pago realizado exitosamente",
    data: nuevoPago,
  });
});

module.exports = router;
