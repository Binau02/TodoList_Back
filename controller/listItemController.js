const listItemService = require("../service/listItemService");
const listService = require("../service/listService");

/**
 * Get all items of a list. Send http status `200` if request is successful or `500` on internal server error.
 *
 * @param req
 * @param res
 * @returns all items of tje list on success
 */
async function getAllItemsOfList(req, res) {
    try {
        const {list_id} = req.params;

        if (!list_id) {
            return res.status(400).json({error: "Missing list_id parameter"});
        }

        const list_items = await listItemService.getAllItemsOfList(list_id);
        res.status(200).json(list_items);
    } catch (error) {
        res.status(500).json({error: 'Failed to retrieve list items'});
    }
}

/**
 * Get a list by its id. Send http status `200` if request is successful or `500` on internal server error.
 *
 * @param req
 * @param res
 * @returns all items of tje list on success
 */
async function getListById(req, res) {
    try {
        const {list_id} = req.params;

        if (!list_id) {
            return res.status(400).json({error: "Missing list_id parameter"});
        }

        const list_items = await listService.getListById(list_id);
        res.status(200).json(list_items);
    } catch (error) {
        res.status(500).json({error: 'Failed to retrieve list'});
    }
}

/**
 * Create item in the list. Send http status `201` if item creation is successful, `400`on bad request or `500` on internal server error.
 *
 * @param req
 * @param res
 * @returns the created list item on success
 */
async function createListItem(req, res) {
    try {
        const {name, end_date, position} = req.body;
        const {list_id} = req.params;

        if (!name || !end_date || !list_id) {
            return res.status(400).json({error: 'Bad request'});
        }

        const listItem = await listItemService.createListItem(name, end_date, list_id, position);

        if (!listItem) {
            return res.status(404).json({message: 'Error - received object is null => not inserted'});
        }

        res.status(201).json(listItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

/**
 * Update item. Send http status `201` if item update is successful, `400`on bad request or `500` on internal server error.
 *
 * @param req
 * @param res
 */
async function updateListItem(req, res) {
    try {
        const {completed_by, position, id: item_id, name} = req.body;

        if (!item_id || !name) {
            return res.status(400).json({error: 'Bad request'});
        }

        await listItemService.updateListItem(item_id, completed_by, position, name);

        res.status(201).json(true);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}


module.exports = {
    getAllItemsOfList,
    createListItem,
    updateListItem,
    getListById
};

