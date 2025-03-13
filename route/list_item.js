const express = require("express");
const router = express.Router();
const listItemController = require("../controller/listItemController");

router.get('/:list_id', listItemController.getAllItemsOfList);
router.post('/:list_id/new', listItemController.createListItem);

module.exports = router;