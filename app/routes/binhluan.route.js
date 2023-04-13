const express = require("express");
const binhLuanController = require("../controllers/binhLuan.controller");

const router = express.Router();

router.get("/:id", binhLuanController.getAllBinhLuan);
router.post("/", binhLuanController.createBinhLuan);

module.exports = router;