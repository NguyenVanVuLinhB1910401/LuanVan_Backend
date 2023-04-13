const DanhGiaService = require("../services/danhGia.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.getAllDanhGia = async (req, res, next) => {
    try {
        const danhGiaService = new DanhGiaService(MongoDB.client);
        const result = await danhGiaService.find(req.params.id);
        return res.status(200).json(result);
    } catch (err) {
        console.log(err.message);
        return next(new ApiError(500, "An errror occurred while get all danh gia"));
    }
}

exports.createDanhGia = async (req, res, next) => {
    try {
        const danhGiaService = new DanhGiaService(MongoDB.client);
        const result = await danhGiaService.create(req.body);
        return res.status(200).json({result})
    } catch (err) {
        console.log(err.message);
        return next(new ApiError(500, "An errror occurred while create Danh Gia"));
    }
}