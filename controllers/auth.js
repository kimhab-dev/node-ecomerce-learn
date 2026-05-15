const auth = require('../services/auth');

const register = async (req, res) => {
    try {
        const result = await auth.register(req.body);
        return res.json({
            result: true,
            message: "Register successfully.",
            data: result
        });
    } catch (err) {
        console.log(err);
        return res.json({
            result: false,
            message: "Register fail.",
            data: err.message
        });
    }
}

const login = async (req, res) => {
    try {
        const data = await auth.login(req.body);

        // save refresh token in cookie
        res.cookie("refreshToken", data.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({
            result: true,
            message: "login successfully.",
            data: data,
        })

    } catch (err) {
        console.log(err);

        return res.json({
            result: false,
            message: "Login fail.",
            data: err.message
        });
    }
}

const refresh = async (req, res) => {
    try {
        console.log();

        const header = req.headers.cookie;

        const path = header.split('=');
        const token = path[1];

        const data = await auth.refreshToken(token);

        return res.json({
            result: true,
            accessToken: data.accessToken
        });

    } catch (err) {
        return res.status(403).json({
            result: false,
            message: err.message
        });
    }
};

const getMe = async (req, res) => {
    try {
        const row = await auth.getMe(req.user);
        return res.json({
            result: true,
            message: "get profile successfully.",
            data: row,
        })
    } catch (error) {
        console.log(error);
    }
}

const logout = async (req, res) => {
    try {
        await auth.logout(req.user.id);
        return res.json({
            result: true,
            message: "loggount successfully.",
        })
    } catch (error) {
        console.log(error)
    }
}

const verifyEmail = async (req, res) => {
    try {
        const result = await auth.verifyEmail(req.query.token);

        return res.json({
            result: true,
            message: result.message,
        })

    } catch (error) {
        console.log(error);
        return res.json({
            result: false,
            message: error.message,
        })
    }
}

const resendVerifycationEmail = async (req, res) => {
    try {
        const result = await auth.resendVerifycationEmail(req.body.email)
        return res.json({
            result: true,
            message: result.message,
        })
    } catch (error) {
        console.log(error);
        return res.json({
            result: false,
            message: error.message,
        })
    }
}

module.exports = {
    register,
    login,
    getMe,
    logout,
    refresh,
    verifyEmail,
    resendVerifycationEmail
}