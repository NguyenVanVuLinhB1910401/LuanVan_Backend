const ChiNhanhService = require("../services/chinhanh.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");


exports.getAllChiNhanh = async (req, res, next) => {
    try {
      const chiNhanhService = new ChiNhanhService(MongoDB.client);
      const result = await chiNhanhService.find();
      return res.status(200).json({result});
    } catch (err) {
      console.log(err);
      return next(new ApiError(500, "An errror occurred while finding the ChiNhanh"));
    }
  };
  
  exports.createChiNhanh = async (req, res, next) => {
    try {
      const chiNhanh = req.body;
      const chiNhanhService = new ChiNhanhService(MongoDB.client);
      const result = await chiNhanhService.create(chiNhanh);
      return res.status(201).json({result});
    } catch (err) {
      console.log(err);
      return next(new ApiError(500, "An errror occurred while creating the ChiNhanh"));
    }
  };
  
  exports.deleteChiNhanh = async (req, res, next) => {
    try {
      const id = req.params.id;
      const chiNhanhService = new ChiNhanhService(MongoDB.client);
      const result = await chiNhanhService.delete(id);
      if(!result) return next(new ApiError(404, "Không tìm thấy chi nhánh"));
      return res.status(200).json({message: "Deleted successful"});
    } catch (err) {
      console.log(err);
      return next(new ApiError(500, "An errror occurred while deleting the ChiNhanh"));
    }
  };
  