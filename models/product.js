const pool = require("../config/db");

const getAll = async () => {
    const [rows] = await pool.query('SELECT * FROM products');
    return rows;
}

const getById = async (id) => {
    const [row] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    return row;
}

const create = async (product) => {
    const sql = 'INSERT INTO products (name, category, price, description) VALUES (?, ?, ?, ?)';
    const data = [product.name, product.category, product.price, product.description];
    const [result] = await pool.query(sql, data);
    return result.insertId;
}

module.exports = { getAll, getById, create }; 