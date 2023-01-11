const express = require("express");
const quanLyLoaiSanPhamController = require("../controllers/quanLyLoaiSanPham.controller");

const router = express.Router();
router.get("/", quanLyLoaiSanPhamController.getAllLoaiSP)
router.post("/", quanLyLoaiSanPhamController.createLoaiSP);
router.delete("/:id", quanLyLoaiSanPhamController.deleteLoaiSP);

module.exports = router;