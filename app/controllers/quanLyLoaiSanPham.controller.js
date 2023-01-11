const LoaiSanPhamService = require('../services/loaisanpham.service');
const MongoDB = require('../utils/mongodb.util');
const ApiError = require('../api-error');

exports.getAllLoaiSP = async (req, res, next) => {
  try {
    const loaiSanPhamService = new LoaiSanPhamService(MongoDB.client);
    const result = await loaiSanPhamService.find();
    return res.status(200).json({result});
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, "An errror occurred while finding the loaiSP"));
  }
};

exports.createLoaiSP = async (req, res, next) => {
  try {
    const loaiSanPham = req.body;
    const loaiSanPhamService = new LoaiSanPhamService(MongoDB.client);
    const result = await loaiSanPhamService.create(loaiSanPham);
    return res.status(201).json({result});
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, "An errror occurred while creating the loaiSP"));
  }
};

exports.deleteLoaiSP = async (req, res, next) => {
  try {
    const id = req.params.id;
    const loaiSanPhamService = new LoaiSanPhamService(MongoDB.client);
    const result = await loaiSanPhamService.delete(id);
    if(!result) return next(new ApiError(404, "Không tìm thấy loại sản phẩm"));
    return res.status(200).json({message: "Deleted successful"});
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, "An errror occurred while deleting the loaiSP"));
  }
};
