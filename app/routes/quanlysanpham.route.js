const express = require("express");
const quanLySanPhamController = require("../controllers/quanLySanPham.controller");

const router = express.Router();
router.get("/", quanLySanPhamController.getAllSanPham);
router.post("/", quanLySanPhamController.createSanPham);
router.get("/:id", quanLySanPhamController.getOneSanPham); 
router.put("/:id", quanLySanPhamController.updateSanPham);
router.delete("/:id", quanLySanPhamController.deleteSanPham);

module.exports = router;