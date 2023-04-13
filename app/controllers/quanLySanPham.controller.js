const SanPhamService = require('../services/sanpham.service');
const TonKhoService = require("../services/tonkho.service");
const MongoDB = require('../utils/mongodb.util');
const ApiError = require('../api-error');
const GiaBanService = require('../services/giaban.service');
const fs = require("fs");
const path = require("path");
exports.getAllSanPham = async (req, res, next) => {
  try {
    const sanPhamService = new SanPhamService(MongoDB.client);
    const result = await sanPhamService.find();
    return res.status(200).json({result});
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, "An errror occurred while finding the SanPham"));
  }
};
exports.getAllSanPhamChoKhachHang = async (req, res, next) => {
  try {
    // const sanPhamService = new SanPhamService(MongoDB.client);
    // const result = await sanPhamService.find();
    const tonKhoService = new TonKhoService(MongoDB.client);
    const result = await tonKhoService.findAllSanPham({idLoai: req.query?.idLoai, idHang: req.query?.idHang, idCN: req.params.idCN});
    return res.status(200).json({result});
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, "An errror occurred while finding the SanPham cho khách hàng"));
  }
};
exports.getOneSanPhamChoKhachHang = async (req, res, next) => {
  try {
    // const sanPhamService = new SanPhamService(MongoDB.client);
    // const result = await sanPhamService.find();
    const tonKhoService = new TonKhoService(MongoDB.client);
    const result = await tonKhoService.findOneSanPhamChiTiet(req.params.id);
    return res.status(200).json({result});
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, "An errror occurred while finding the SanPham cho khách hàng"));
  }
};
exports.getOneSanPham = async (req, res, next) => {
    try {
        const id = req.params.id;
      const sanPhamService = new SanPhamService(MongoDB.client);
      const result = await sanPhamService.findById(id);
      return res.status(200).json({result});
    } catch (err) {
      console.log(err);
      return next(new ApiError(500, "An errror occurred while finding the SanPham"));
    }
  };

exports.createSanPham = async (req, res, next) => {
  try {
    const sanPham = req.body;
    //console.log(sanPham);
    const sanPhamService = new SanPhamService(MongoDB.client);
    const result = await sanPhamService.create(sanPham);
    return res.status(201).json({result});
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, "An errror occurred while creating the SanPham"));
  }
};

exports.updateSanPham = async (req, res, next) => {
  try {
    const id = req.params.id;
    const sanPham = req.body;
    //console.log(sanPham);
    if(sanPham.newAnhDaiDien != sanPham.oldAnhDaiDien && sanPham.newAnhDaiDien != 'undefined') {
      const pathTo = path.join(__dirname, '../../public/assets/' + sanPham.oldAnhDaiDien);
      //Delete ảnh cũ
      if (fs.existsSync(pathTo)) fs.unlinkSync(pathTo)
      sanPham.anhDaiDien = sanPham.newAnhDaiDien;
    }
    // if(sanPham.giaBan != sanPham.oldGiaBan && sanPham.giaBan) {
    //   const giaBanService = new GiaBanService(MongoDB.client);
    //   const giaBan = await giaBanService.create({giaBan: sanPham.giaBan, idSanPham: id});
    //   if(giaBan) sanPham.giaBan = giaBan;
    // }
    const sanPhamService = new SanPhamService(MongoDB.client);
    const result = await sanPhamService.update(id, sanPham);
    return res.status(200).json({result});
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, "An errror occurred while updating the SanPham"));
  }
};

exports.deleteSanPham = async (req, res, next) => {
  try {
    const id = req.params.id;
    const sanPhamService = new SanPhamService(MongoDB.client);
    const result = await sanPhamService.delete(id);
    if(!result) return next(new ApiError(404, "Không tìm thấy sản phẩm"));
    const pathTo = path.join(__dirname, '../../public/assets/' + result.anhDaiDien);
    // console.log(pathTo);
    if (fs.existsSync(pathTo)) {
      fs.unlinkSync(pathTo)
    }
    return res.status(200).json({message: "Deleted successful"});
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, "An errror occurred while deleting the SanPham"));
  }
};

//Khach hang

exports.getAllSanPhamMoi = async (req, res, next) => {
  try {
    const tonKhoService = new TonKhoService(MongoDB.client);
    const result = await tonKhoService.findAllSanPhamMoi(req.params.idCN);
    return res.status(200).json({result});
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, "An errror occurred while finding the SanPhamMoi"));
  }
}

exports.getAllSanPhamNoiBat = async (req, res, next) => {
  try {
    const tonKhoService = new TonKhoService(MongoDB.client);
    const result = await tonKhoService.findAllSanPhamNoiBat(req.params.idCN);
    return res.status(200).json({result});
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, "An errror occurred while finding the SanPhamNoiBat"));
  }
}
exports.getAllSanPhamFilter = async (req, res, next) => {
  try {
    //console.log(req.body);
    const sanPhamService = new SanPhamService(MongoDB.client);
    const result = await sanPhamService.findFilter(req.body);
    return res.status(200).json({result});
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, "An errror occurred while finding the SanPhamFilter"));
  }
};

exports.getSanPhamTheoCN = async (req, res, next) => {
  try {
    const tonKhoService = new TonKhoService(MongoDB.client);
    const result = await tonKhoService.findAllSanPhamTheoCN(req.params.idCN);
    return res.status(200).json({result});
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, "An errror occurred while finding the SanPhamNoiBat"));
  }
}
