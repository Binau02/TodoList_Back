const authService = require('../service/authenticationService');
const helper = require('../helper/inputValidityHelper');

/**
 * Register new user. Send http status `201` if request is successful, `400` if bad request format or `500` on
 * internal server error.
 *
 * @param req
 * @param res
 */
async function register(req, res) {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({error: 'Bad request'});
        }

        if (!await helper.emailIsValid(email)) {
            return res.status(400).json({error: 'Invalid email format'});
        }
        if (await helper.emailIsAlreadyUsed(email)) {
            return res.status(400).json({error: 'Email is already used'});
        }

        await authService.registerUser(email, password);
        res.status(201).json({message: 'User registered successfully'});
    } catch (error) {
        res.status(500).json({error: 'Registration failed'});
    }
}

/**
 * Log in by creating an authentication token cookie. Send http status `200` if request is successful, `401` if login
 * and password do not match or `500` on internal server error.
 *
 * @param req
 * @param res
 */
async function login(req, res) {
    try {
        const {email, password} = req.body;
        const result = await authService.authenticateUser(email, password);
        if (!result) {
            return res.status(401).json({error: 'Authentication failed'});
        }
        res.cookie('token', result.token, {httpOnly: true, maxAge: 3600000});
        res.status(200).json({message: 'Login successful'});
    } catch (error) {
        res.status(500).json({error: 'Login failed'});
    }
}

/**
 * Log out by clearing the authentication token cookie. Send http status `200` if request is successful or `500` on
 * internal server error.
 *
 * @param req
 * @param res
 */
async function logout(req, res) {
    try {
        res.clearCookie('token');
        res.status(200).json({message: 'Logout successful'});
    } catch (error) {
        res.status(500).json({error: 'Logout failed'});
    }
}

/**
 * Return true if a user is logged in, false otherwise. Send http status `200` if request is successful or `500` on
 * internal server error.
 *
 * @param req
 * @param res
 */
function isLoggedIn(req, res) {
    try {
        res.status(200).json({isLoggedIn: !!req.userEmail});
    } catch (error) {
        res.status(500).json({error: 'IsLoggedIn failed'});
    }
}

module.exports = {
    register,
    login,
    logout,
    isLoggedIn,
};
