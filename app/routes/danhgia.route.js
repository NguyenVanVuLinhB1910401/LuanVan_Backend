const express = require("express");
const danhGiaController = require("../controllers/danhGia.controller");

const router = express.Router();

router.get("/:id", danhGiaController.getAllDanhGia);
router.post("/", danhGiaController.createDanhGia);

module.exports = router;