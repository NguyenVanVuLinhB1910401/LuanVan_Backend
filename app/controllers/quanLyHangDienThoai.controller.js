const HangDienThoaiService = require("../services/hangdienthoai.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");


exports.getAllHangDT = async (req, res, next) => {
    try {
      const hangDienThoaiService = new HangDienThoaiService(MongoDB.client);
      const result = await hangDienThoaiService.find();
      return res.status(200).json({result});
    } catch (err) {
      console.log(err);
      return next(new ApiError(500, "An errror occurred while finding the hangDT"));
    }
  };
  
  exports.createHangDT = async (req, res, next) => {
    try {
      const hangDienThoai = req.body;
      const hangDienThoaiService = new HangDienThoaiService(MongoDB.client);
      const result = await hangDienThoaiService.create(hangDienThoai);
      return res.status(201).json({result});
    } catch (err) {
      console.log(err);
      return next(new ApiError(500, "An errror occurred while creating the hangDT"));
    }
  };
  
  exports.deleteHangDT = async (req, res, next) => {
    try {
      const id = req.params.id;
      const hangDienThoaiService = new HangDienThoaiService(MongoDB.client);
      const result = await hangDienThoaiService.delete(id);
      if(!result) return next(new ApiError(404, "Không tìm thấy hãng điện thoại"));
      return res.status(200).json({message: "Deleted successful"});
    } catch (err) {
      console.log(err);
      return next(new ApiError(500, "An errror occurred while deleting the hangDT"));
    }
  };
  