const NhaCungCapService = require("../services/nhacungcap.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");


exports.getAllNhaCungCap = async (req, res, next) => {
    try {
      const nhaCungCapService = new NhaCungCapService(MongoDB.client);
      const result = await nhaCungCapService.find();
      return res.status(200).json({result});
    } catch (err) {
      console.log(err);
      return next(new ApiError(500, "An errror occurred while finding the NhaCungCap"));
    }
  };
  
  exports.createNhaCungCap = async (req, res, next) => {
    try {
      const nhaCungCap = req.body;
      const nhaCungCapService = new NhaCungCapService(MongoDB.client);
      const result = await nhaCungCapService.create(nhaCungCap);
      return res.status(201).json({result});
    } catch (err) {
      console.log(err);
      return next(new ApiError(500, "An errror occurred while creating the NhaCungCap"));
    }
  };
  
  exports.deleteNhaCungCap = async (req, res, next) => {
    try {
      const id = req.params.id;
      const nhaCungCapService = new NhaCungCapService(MongoDB.client);
      const result = await nhaCungCapService.delete(id);
      if(!result) return next(new ApiError(404, "Không tìm thấy nhà cung cấp"));
      return res.status(200).json({message: "Deleted successful"});
    } catch (err) {
      console.log(err);
      return next(new ApiError(500, "An errror occurred while deleting the NhaCungCap"));
    }
  };
  