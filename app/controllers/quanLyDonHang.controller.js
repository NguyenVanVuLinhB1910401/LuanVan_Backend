const DonHangService = require("../services/donhang.service");
const ChiTietDonHangService = require("../services/chitietdonhang.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");


exports.getAllDonHang = async (req, res, next) => {
    try {
      const donHangService = new DonHangService(MongoDB.client);
      const result = await donHangService.find();
      return res.status(200).json({result});
    } catch (err) {
      console.log(err);
      return next(new ApiError(500, "An errror occurred while finding the DonHang"));
    }
  };
  exports.getOneDonHang = async (req, res, next) => {
    try {
      const donHangService = new DonHangService(MongoDB.client);
      const donHang = await donHangService.findOne(req.params.id);
      const chiTietDonHangService = new ChiTietDonHangService(MongoDB.client);
      const dsSanPham = await chiTietDonHangService.find(req.params.id);
      return res.status(200).json({donHang, dsSanPham});
    } catch (err) {
      console.log(err);
      return next(new ApiError(500, "An errror occurred while finding One the DonHang"));
    }
  };

  exports.deleteDonHang = async (req, res, next) => {
    try {
      const donHangService = new DonHangService(MongoDB.client);
      const chiTietDonHangService = new ChiTietDonHangService(MongoDB.client);
      const result = await donHangService.delete(req.params.id);
      const resultCTDH = await chiTietDonHangService.deleteMany(req.params.id);
      return res.status(200).json({result});
    } catch (err) {
      console.log(err);
      return next(new ApiError(500, "An errror occurred while deleting the DonHang"));
    }
  };
  