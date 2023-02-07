const express = require("express");
const quanLyNhapXuatKhoController = require("../controllers/quanLyNhapXuatKho.controller");

const router = express.Router();
router.get("/phieunhap", quanLyNhapXuatKhoController.getAllPhieuNhap);
router.get("/phieunhap/:id", quanLyNhapXuatKhoController.getOnePhieuNhap);
router.get("/danhsachsanphamdanhap", quanLyNhapXuatKhoController.getAllDanhSachSanPhamDaNhap);
router.get("/tonkho", quanLyNhapXuatKhoController.getAllSanPhamTrongKho);
router.post("/nhapkho", quanLyNhapXuatKhoController.createPhieuNhap);
//router.post("/xuatkho", quanLyNhapXuatKhoController.createPhieuXuat);
//router.delete("/:id", quanLyNhapXuatKhoController.deleteChiNhanh);

module.exports = router;