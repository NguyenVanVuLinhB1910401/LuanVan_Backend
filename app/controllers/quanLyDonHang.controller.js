const DonHangService = require("../services/donhang.service");
const ChiTietDonHangService = require("../services/chitietdonhang.service");
const UserService = require("../services/user.service");
const LoaiSanPhamService = require("../services/loaisanpham.service");
const HangDienThoaiService = require("../services/hangdienthoai.service");
const SanPhamService = require("../services/sanpham.service");
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
      const donHang = await donHangService.findOne(req.params.id, req.query.htnh);
      const chiTietDonHangService = new ChiTietDonHangService(MongoDB.client);
      const dsSanPham = await chiTietDonHangService.find(req.params.id);
      return res.status(200).json({donHang, dsSanPham});
    } catch (err) {
      console.log(err);
      return next(new ApiError(500, "An errror occurred while finding One the DonHang"));
    }
  };

  exports.updateStatus = async (req, res, next) => {
    try {
      const donHangService = new DonHangService(MongoDB.client);
      const donHang = await donHangService.update(req.params.id, req.body);
      return res.status(200).json({donHang});
    } catch (err) {
      console.log(err);
      return next(new ApiError(500, "An errror occurred while updateStatus One the DonHang"));
    }
  };

  exports.deleteDonHang = async (req, res, next) => {
    try {
      const donHangService = new DonHangService(MongoDB.client);
      const result  = await donHangService.deleteDHDaHuy(req.params.id);
      return res.status(200).json(result);
    } catch (err) {
      console.log(err);
      return next(new ApiError(500, "An errror occurred while deleting the DonHang"));
    }
  };
  exports.huyDonHang = async (req, res, next) => {
    try {
      //console.log(req.body);
      const id = req.params.id;
      const idCNDH = req.body.idCNDH;
      const dsSanPham = req.body.dsSanPham.map((sp) => {
        return {
          id: sp.idSP._id, 
          soLuong: sp.soLuong
        };
      });
      const donHangService = new DonHangService(MongoDB.client);
      const result = await donHangService.huyDH({id: id, cart: dsSanPham, idCN: idCNDH});
      return res.status(200).json(result);
    } catch (err) {
      console.log(err);
      return next(new ApiError(500, "An errror occurred while deleting the DonHang"));
    }
  };
  
  exports.ThongKe = async (req, res, next) => {
    try {
      const donHangService = new DonHangService(MongoDB.client);
      const data = await donHangService.thongKe();
      const result = data.filter(d => d.year == req.params.year);
      const userService = new UserService(MongoDB.client);
      const soLuongKhachHang = await userService.soLuongKH();
      const soLuongNhanVien = await userService.soLuongNV();
      const loaiSanPhanService = new LoaiSanPhamService(MongoDB.client);
      const soLuongLoai = await loaiSanPhanService.soLuongLoai();
      const hangDienThoaiService = new HangDienThoaiService(MongoDB.client);
      const soLuongHang = await hangDienThoaiService.soLuongHang();
      const sanPhamService = new SanPhamService(MongoDB.client);
      const soLuongSP = await sanPhamService.soLuongSP();
      return res.status(200).json({
        dataThongKe: result, 
        soLuongKH: soLuongKhachHang,
        soLuongNV: soLuongNhanVien,
        soLuongLoai: soLuongLoai,
        soLuongHang: soLuongHang,
        soLuongSP: soLuongSP
      });
    } catch (err) {
      console.log(err);
      return next(new ApiError(500, "An errror occurred while thong ke the DonHang"));
    }
  };
  