const express = require("express");
const router = express.Router();
const listController = require("../controller/listController");

router.get('', listController.getAllListsOfUser);
router.post('/new', listController.createList);
router.post('/grant_access', listController.grantAccessToList);

module.exports = router;