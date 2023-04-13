const express = require("express");
const quanLyKhachHangController = require("../controllers/quanLyKhachHang.controller");

const router = express.Router();
router.get("/", quanLyKhachHangController.getAllKhachHang);
router.put("/:id", quanLyKhachHangController.updateTrangThaiTaiKhoan);
//router.delete("/:id", quanLyKhachHangController.deleteChiNhanh);

module.exports = router;