const nodemailer = require('nodemailer');

const transpoter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    service: 'gmail',
    auth: {
        user: "kimhabsok9@gmail.com",
        pass: "yozkcxkhfnmyvtfu"
    }
});

module.exports = transpoter;