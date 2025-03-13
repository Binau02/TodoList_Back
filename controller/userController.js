const userService = require("../service/userService");

/**
 * Get all existing users. Send http status `200` if request is successful or `500` on internal server error.
 *
 * @param req
 * @param res
 * @returns all existing users on success
 */
async function getAllUsers(req, res) {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({error: 'Failed to retrieve users'});
    }
}


module.exports = {
    getAllUsers,
};

