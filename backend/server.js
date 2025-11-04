const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('========================================');
    console.log(`🚀 Servidor de Credentia iniciado`);
    console.log(`📡 Escuchando en puerto: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📅 Fecha: ${new Date().toLocaleString('es-MX')}`);
    console.log('========================================');
});