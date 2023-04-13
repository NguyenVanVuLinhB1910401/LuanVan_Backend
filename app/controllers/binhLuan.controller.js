const BinhLuanService = require("../services/binhluan.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.getAllBinhLuan = async (req, res, next) => {
    try {
        const binhLuanService = new BinhLuanService(MongoDB.client);
        const result = await binhLuanService.find(req.params.id);
        return res.status(200).json({result})
    } catch (err) {
        console.log(err.message);
        return next(new ApiError(500, "An errror occurred while get all binh luan"));
    }
}

exports.createBinhLuan = async (req, res, next) => {
    try {
        const binhLuanService = new BinhLuanService(MongoDB.client);
        const result = await binhLuanService.create(req.body);
        return res.status(200).json({result})
    } catch (err) {
        console.log(err.message);
        return next(new ApiError(500, "An errror occurred while create binh luan"));
    }
}