const express = require("express");
const quanLyHangDienThoaiController = require("../controllers/quanLyHangDienThoai.controller");

const router = express.Router();
router.get("/", quanLyHangDienThoaiController.getAllHangDT);
router.post("/", quanLyHangDienThoaiController.createHangDT);
router.delete("/:id", quanLyHangDienThoaiController.deleteHangDT);

module.exports = router;