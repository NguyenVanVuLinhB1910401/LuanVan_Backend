const express = require("express");
const quanLyChiNhanhController = require("../controllers/quanLyChiNhanh.controller");

const router = express.Router();
router.get("/", quanLyChiNhanhController.getAllChiNhanh);
router.post("/", quanLyChiNhanhController.createChiNhanh);
router.delete("/:id", quanLyChiNhanhController.deleteChiNhanh);

module.exports = router;