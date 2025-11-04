const tokens = require('../data/tokens');

/**
 * Middleware para proteger rutas
 * Valida que el token sea válido y adjunta userId al request
 */
const authRequired = (req, res, next) => {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Token no proporcionado. Acceso no autorizado'
        });
    }

    const token = authHeader.replace('Bearer ', '');

    // Buscar token en el array de tokens activos
    const tokenData = tokens.find(t => t.token === token);

    if (!tokenData) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido o expirado. Por favor, inicia sesión nuevamente'
        });
    }

    // Adjuntar userId al request para uso en controladores
    req.userId = tokenData.userId;
    req.userCuenta = tokenData.cuenta;

    // Continuar al siguiente middleware o controlador
    next();
};

module.exports = authRequired;