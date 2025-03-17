const express = require("express");
const router = express.Router();
const listItemController = require("../controller/listItemController");
const listController = require("../controller/listController");

router.get('/:list_id', listItemController.getListById);
router.get('/:list_id/users', listController.getAllUsersOfList);
router.get('/:list_id/items', listItemController.getAllItemsOfList);
router.post('/:list_id/new', listItemController.createListItem);
router.put('/update', listItemController.updateListItem);

module.exports = router;