const product = require("../services/product");

const getAll = async (req, res) => {
    try {
        const rows = await product.getAll();
        res.status(200).json({
            result: true,
            message: "Get all products successfully.",
            totalResult: rows.length,
            data: rows
        })
    } catch (err) {
        console.log(err);
    }
}

const getById = async (req, res) => {
    try {
        const row = await product.getById(req.params.id);
        return res.status(200).json({
            result: true,
            message: "Get a products successfully.",
            data: row[0]
        })
    } catch (err) {
        return res.json({
            result: true,
            message: "Get a products fail.",
            details: err.message
        })
    }
}

const create = async (req, res) => {
    try {
        const result = await product.create(req.body);
        return res.json({
            result: true,
            message: "Create products successfully.",
            data: result[0]
        })
    }
    catch (err) {
        return res.json({
            result: false,
            message: "Create product fail.",
            details: err.message
        })
    }
}

module.exports = { getAll, getById, create };