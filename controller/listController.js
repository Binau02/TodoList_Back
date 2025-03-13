const listService = require("../service/listService");

/**
 * Get all lists of user. Send http status `200` if request is successful or `500` on internal server error.
 *
 * @param req
 * @param res
 * @returns all user's lists on success
 */
async function getAllListsOfUser(req, res) {
    try {
        const lists = await listService.getAllListsOfUser(req.userEmail);
        res.status(200).json(lists);
    } catch (error) {
        res.status(500).json({error: 'Failed to retrieve lists'});
    }
}

/**
 * Create a list. Send http status `201` if list creation is successful, `400`on bad request or `500` on internal server error.
 *
 * @param req
 * @param res
 * @returns the created list on success
 */
async function createList(req, res) {
    try {
        const {name} = req.body;

        if (!name) {
            return res.status(400).json({error: 'Bad request'});
        }

        const list = await listService.createList(req.userEmail, name);

        if (!list) {
            return res.status(404).json({message: 'Error - received object is null => not inserted'});
        }

        res.status(201).json(list);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

/**
 * Grant access to a list. Send http status `201` if list creation is successful, `400`on bad request or `500` on internal server error.
 *
 * @param req
 * @param res
 */
async function grantAccessToList(req, res) {
    try {
        const {list_id, email} = req.body;

        if (!list_id || !email) {
            return res.status(400).json({error: 'Bad request'});
        }

        await listService.grantAccessToList(email, list_id);

        res.status(201).json(true);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}


module.exports = {
    getAllListsOfUser,
    createList,
    grantAccessToList,
};

