// function return function
const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,  // oy vea jenh mdong 1 orr all (fale 1, true all)
        // allowUnknow: false
    });

    if (error) {
        return res.json({
            message: "Register fails",
            details: error.details.map((d) => d.message)
        })
    }

    req.validate = value;
    next();
}

module.exports = validate;