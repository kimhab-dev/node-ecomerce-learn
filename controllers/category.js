const category = require('../services/category');

const getAll = async (req, res) => {
    try {
        const rows = await category.getAll();
        return res.json({
            result: true,
            message: "get category successfully.",
            totalItems: rows.length,
            data: rows
        })
    } catch (err) {
        console.log(err);
    }
}

const getById = async (req, res) => {
    try {
        const row = await category.getById(req.params.id);
        return res.json({
            result: true,
            message: "get category successfully.",
            data: row[0]
        })

    } catch (err) {
        return res.json({
            result: false,
            message: "get category fail.",
            details: err.message
        })
    }
}

const create = async (req, res) => {
    try {
        const row = await category.create(req.body);
        return res.json({
            result: true,
            message: "create category successfully.",
            data: row[0]
        })
    } catch (err) {
        console.log(err);
        return res.json({
            result: false,
            message: "get category fail.",
            details: err.message
        })
    }
}

module.exports = { getAll, getById, create }