const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");


exports.getAllKhachHang = async (req, res, next) => {
    try {
      const userService = new UserService(MongoDB.client);
      const result = await userService.findAllKhachHang();
      return res.status(200).json({result});
    } catch (err) {
      console.log(err);
      return next(new ApiError(500, "An errror occurred while finding the KhachHang"));
    }
  };
  exports.updateTrangThaiTaiKhoan = async (req, res, next) => {
    try {
      const userService = new UserService(MongoDB.client);
      const result = await userService.update(req.params.id, req.body);
      return res.status(200).json(result);
    } catch (err) {
      console.log(err);
      return next(new ApiError(500, "An errror occurred while update Trang Thai the KhachHang"));
    }
  };
  
 