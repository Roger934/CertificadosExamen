const app = require('./app');

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0"; // Escucha todas las IPs

// IP fija de tu red local
const LOCAL_IP = "192.168.100.86";

app.listen(PORT, HOST, () => {
    console.log('========================================');
    console.log(`🚀 Servidor de Credentia iniciado`);
    console.log(`📡 Escuchando en puerto: ${PORT}`);
    console.log('========================================');
    console.log(`🌐 Accesos disponibles:`);
    console.log(`   📍 Local:    http://localhost:${PORT}`);
    console.log(`   📍 Red:      http://${LOCAL_IP}:${PORT}`);
    console.log('========================================');
    console.log(`📋 Comparte esta URL con otras computadoras:`);
    console.log(`   👉 http://${LOCAL_IP}:${PORT}`);
    console.log('========================================');
    console.log(`📅 Fecha: ${new Date().toLocaleString('es-MX')}`);
    console.log('========================================');
});
