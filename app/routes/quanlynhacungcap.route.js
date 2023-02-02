const express = require("express");
const quanLyNhaCungCapController = require("../controllers/quanLyNhaCungCap.controller");

const router = express.Router();
router.get("/", quanLyNhaCungCapController.getAllNhaCungCap);
router.post("/", quanLyNhaCungCapController.createNhaCungCap);
router.delete("/:id", quanLyNhaCungCapController.deleteNhaCungCap);

module.exports = router;