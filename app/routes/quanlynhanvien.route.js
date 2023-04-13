const express = require("express");
const quanLyNhanVienController = require("../controllers/quanLyNhanVien.controller");

const router = express.Router();
router.get("/", quanLyNhanVienController.getAllNhanVien);
router.post("/", quanLyNhanVienController.createNV);
//router.delete("/:id", quanLyKhachHangController.deleteChiNhanh);

module.exports = router;