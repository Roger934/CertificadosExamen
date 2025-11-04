const users = require('../data/users');
const tokens = require('../data/tokens');
const { generateToken } = require('../utils/tokenGenerator');

// ========================================
// LOGIN
// ========================================
const login = (req, res) => {
    const { cuenta, password } = req.body;

    // Validación de campos
    if (!cuenta || !password) {
        return res.status(400).json({
            success: false,
            message: 'Por favor, proporciona cuenta y contraseña'
        });
    }

    // Buscar usuario
    const user = users.find(u => u.cuenta === cuenta && u.password === password);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Error en las credenciales'
        });
    }

    // Generar token usando crypto.randomUUID()
    const token = generateToken();

    // Guardar token en el array de tokens activos
    tokens.push({
        token,
        userId: user.id,
        cuenta: user.cuenta,
        createdAt: new Date()
    });

    // Devolver respuesta exitosa (sin enviar password)
    const { password: _, ...userData } = user;

    res.json({
        success: true,
        message: 'Login exitoso',
        token,
        user: userData
    });

    console.log(`✅ Login exitoso: ${user.cuenta} (ID: ${user.id})`);
};

// ========================================
// LOGOUT
// ========================================
const logout = (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'Token no proporcionado'
        });
    }

    // Buscar y eliminar el token
    const index = tokens.findIndex(t => t.token === token);

    if (index !== -1) {
        const deletedToken = tokens.splice(index, 1)[0];
        
        console.log(`✅ Logout exitoso: ${deletedToken.cuenta}`);
        
        return res.json({
            success: true,
            message: 'Sesión cerrada exitosamente'
        });
    } else {
        return res.status(401).json({
            success: false,
            message: 'Token inválido o ya expirado'
        });
    }
};

// ========================================
// VERIFICAR TOKEN (opcional, para debugging)
// ========================================
const verifyToken = (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'Token no proporcionado'
        });
    }

    const tokenData = tokens.find(t => t.token === token);

    if (tokenData) {
        return res.json({
            success: true,
            message: 'Token válido',
            userId: tokenData.userId,
            cuenta: tokenData.cuenta
        });
    } else {
        return res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }
};

module.exports = {
    login,
    logout,
    verifyToken
};