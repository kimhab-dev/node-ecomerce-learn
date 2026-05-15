const pool = require('../config/db');

const getAll = async () => {
    const [rows] = await pool.query('SELECT * FROM categories');
    return rows;
}

const getById = async (id) => {
    const [row] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    return row;
}

const create = async (category) => {
    const [result] = await pool.query('INSERT INTO categories (name) VALUES (?)', [category.name]);
    return result.insertId;
}

module.exports = { getAll, getById, create };