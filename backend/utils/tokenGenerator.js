const crypto = require('crypto');

/**
 * Genera un token único usando crypto.randomUUID()
 * 
 * @returns {string} Token único en formato UUID
 * 
 * Ejemplo de token generado:
 * "550e8400-e29b-41d4-a716-446655440000"
 */
function generateToken() {
    return crypto.randomUUID();
}

module.exports = {
    generateToken
};