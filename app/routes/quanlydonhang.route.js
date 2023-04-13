const express = require("express");
const quanLyDonHangController = require("../controllers/quanLyDonHang.controller");

const router = express.Router();
router.get("/", quanLyDonHangController.getAllDonHang);
router.get("/:id", quanLyDonHangController.getOneDonHang);
router.get("/thongke", quanLyDonHangController.ThongKe);
router.put("/:id", quanLyDonHangController.updateStatus);
router.put("/huy/:id", quanLyDonHangController.huyDonHang);
router.delete("/:id", quanLyDonHangController.deleteDonHang);

module.exports = router;