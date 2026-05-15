const user = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config/jwt');
const crypto = require('crypto');
const sendMailVerication = require('./mailService')

const register = async (body) => {
    if (!body.name || !body.email || !body.password) {
        throw new Error("name, email and password is require");
    }

    // check have email orr not
    const checkemail = await user.getByEmail(body.email);
    if (checkemail.length > 0) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const vericationToken = await crypto.randomBytes(32).toString('hex');
    const vericationTokenExpires = new Date(Date.now() + 2 * 60 * 1000);

    // create new user
    // const result = await user.register({ ...body, hashedPassword });
    const result = await user.register({
        name: body.name,
        email: body.email,
        password: hashedPassword,
        vericationToken,
        vericationTokenExpires
    });

    await sendMailVerication.sendVerificationEmail(body.email, vericationToken);

    const [row] = await user.getById(result);
    delete row.token;
    return row;
}

const login = async (body) => {
    if (!body.email || !body.password) {
        throw new Error("email and password is require.");
    }
    const row = await user.getByEmail(body.email);
    if (row.length === 0) {
        throw new Error("User not found.");
    }

    const data = row[0];

    // conpare password user and password in database
    const isMatch = await bcrypt.compare(body.password, data.password);
    if (!isMatch) {
        throw new Error("invalid username or password.");
    }

    // Access Token (short)
    const accessToken = jwt.sign(
        { id: data.id, name: data.name },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
    );

    // Refresh Token (long)
    // const refreshToken = jwt.sign(
    //     { id: data.id },
    //     refreshJwtConfig.secret,
    //     { expiresIn: "7d" }
    // );

    // save refresh token in DB
    // await user.addToken(refreshToken, data.id);
    await user.addToken(accessToken, data.id);


    const [userInfo] = await user.getById(data.id);

    delete userInfo.token;

    return {
        user: userInfo,
        token: accessToken
    };
}

// const refreshToken = async (token) => {
//     if (!token) {
//         throw new Error("No token");
//     }

//     let decoded;
//     try {
//         decoded = jwt.verify(token, refreshJwtConfig.secret);
//     } catch (err) {
//         throw new Error("Invalid refresh token");
//     }

//     const row = await user.getById(decoded.id);

//     if (row.length === 0 || row[0].token !== token) {
//         throw new Error("Token not match");
//     }

//     const newAccessToken = jwt.sign(
//         { id: decoded.id },
//         jwtConfig.secret,
//         { expiresIn: "15m" }
//     );

//     return { accessToken: newAccessToken };
// };

const getMe = async (data) => {
    const [row] = await user.getById(data.id);
    const userInfo = {
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        is_active: row.is_active,
        created_at: row.created_at
    }
    return userInfo;
}

const verifyEmail = async (token) => {
    if (!token) {
        throw new Error('Token is require');
    }
    const userInfo = await user.findByVerication(token);
    if (userInfo.length == 0) {
        throw new Error("Invalid token");
    }

    if (userInfo[0].is_verified) {
        throw new Error("Email already verify");
    }

    if (!userInfo[0].verification_expires || new Date(userInfo[0].verification_expires) < new Date()) {
        throw new Error("Token is expired");
    }

    await user.verifyEmail(userInfo[0].id);
    return { message: "Verify email successfully." }
}

const logout = async (id) => {
    await user.logout(id);
}

const resendVerifycationEmail = async (email) => {
    if (!email) {
        throw new Error("email is require.");
    }

    const row = await user.getByEmail(email);
    
    if (row.length === 0) {
        throw new Error("invalid email.");
    }

    if (row[0].is_verified) {
        throw new Error("Email already verify.");
    }

    const vericationToken = await crypto.randomBytes(32).toString('hex');
    const vericationTokenExpires = new Date(Date.now() + 2 * 60 * 1000);

    await user.resendVerifycationEmail({
        vericationToken,
        vericationTokenExpires,
        id: row[0].id
    })

    await sendMailVerication.sendVerificationEmail(email, vericationToken);
    return { message: "Resend email successfully" }

}

module.exports = {
    register,
    login,
    getMe,
    logout,
    // refreshToken,
    verifyEmail,
    resendVerifycationEmail
}