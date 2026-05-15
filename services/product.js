const product = require("../models/product");
const category = require("../services/category");
const getAll = async () => {
    const rows = await product.getAll();
    return rows;
}

const getById = async (id) => {
    const row = await product.getById(id);
    if (row.length === 0) {
        throw new Error("Products not found.");
    }
    return row;
}

const create = async (body) => {
    if (!body.name) {
        throw new Error("name is requiire.");
    }
    if (!body.category) {
        throw new Error("category is requiire.");
    }
    if (!body.price) {
        throw new Error("price is requiire.");
    }
    await category.getById(body.category);
    const result = await product.create(body);
    const row = await product.getById(result);
    return row;
}

module.exports = { getAll, getById, create };