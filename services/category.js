const category = require('../models/category')

const getAll = async () => {
    const rows = await category.getAll();
    return rows;
}

const getById = async (id) => {
    const row = await category.getById(id);
    if (row.length === 0) {
        throw new Error("categoryy not found.");
    }
    return row;
}

const create = async (body) => {
    const result = await category.create(body);
    const row = await category.getById(result);
    return row;
}

module.exports = { getAll, getById, create };