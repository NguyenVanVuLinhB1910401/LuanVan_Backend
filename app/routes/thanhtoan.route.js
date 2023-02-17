const express = require("express");
const thanhToanController = require("../controllers/thanhToan.controller");

const router = express.Router();

router.post("/thanhtoan", thanhToanController.thanhToan);
router.get("/thanhtoan", thanhToanController.thanhToanThanhCong);
module.exports = router;