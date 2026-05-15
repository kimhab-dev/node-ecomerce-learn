const pool = require('../config/db');

const getByEmail = async (email) => {
    let [row] = await pool.query("SELECT id, email, password, role, is_active, is_verified, created_at FROM users WHERE email = ?", [email]);
    return row;
}

const getById = async (id) => {
    let [row] = await pool.query('SELECT id, name, email, role, is_active, created_at, token FROM users WHERE id = ?', [id]);
    return row;
}

const register = async (user) => {
    console.log(user.ericationTokenExpires)
    const sql = 'INSERT INTO users (name, email, password, verification_token, verification_expires) VALUES (?, ?, ?, ?, ?)';
    let data = [user.name, user.email, user.password, user.vericationToken, user.vericationTokenExpires];
    let [row] = await pool.query(sql, data);
    return row.insertId;
}

const addToken = async (token, id) => {
    await pool.query('UPDATE users SET token = ? WHERE id = ?', [token, id]);
}

const checkToken = async (token) => {
    let [row] = await pool.query('SELECT * FROM users WHERE token = ?', [token]);
    return row;
}

const logout = async (id) => {
    await pool.query('UPDATE users SET token = null WHERE id = ?', [id]);
}

const findByVerication = async (token) => {
    let [row] = await pool.query('SELECT * FROM users WHERE verification_token = ?', [token]);
    return row;
}

const verifyEmail = async (id) => {
    await pool.query('UPDATE users set is_verified = 1 WHERE id = ?', [id]);
}

const resendVerifycationEmail = async (body) => {
    const data = [body.vericationToken, body.vericationTokenExpires, body.id];
    await pool.query('UPDATE users SET verification_token = ?, verification_expires = ? WHERE id = ?', data);
}

module.exports = {
    getByEmail,
    register,
    getById,
    addToken,
    logout,
    checkToken,
    findByVerication,
    verifyEmail,
    resendVerifycationEmail
}