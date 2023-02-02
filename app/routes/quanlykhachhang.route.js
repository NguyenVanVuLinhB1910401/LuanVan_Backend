const express = require("express");
const quanLyKhachHangController = require("../controllers/quanLyKhachHang.controller");

const router = express.Router();
router.get("/", quanLyKhachHangController.getAllKhachHang);
//router.delete("/:id", quanLyKhachHangController.deleteChiNhanh);

module.exports = router;