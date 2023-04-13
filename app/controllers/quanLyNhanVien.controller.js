const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");


exports.getAllNhanVien = async (req, res, next) => {
    try {
      const userService = new UserService(MongoDB.client);
      const result = await userService.findAllNhanVien();
      return res.status(200).json({result});
    } catch (err) {
      console.log(err);
      return next(new ApiError(500, "An errror occurred while finding the NhanVien"));
    }
  };


exports.createNV = async (req, res, next) => {
    try {
        //console.log(req.body);
        const user = req.body;
        const userService = new UserService(MongoDB.client);
        const isTaiKhoan = await userService.findByTaiKhoanNhanVien(user.taiKhoan);
        //console.log(isTaiKhoan);
        if(isTaiKhoan) return res.status(400).json({message: "Tai khoan da ton tai"});
        const salt = await bcrypt.genSalt();
        user.matKhau = await bcrypt.hash(user.matKhau, salt);
        const result = await userService.createNV(user);
        delete result.matKhau;
        return res.status(201).json({result});
    } catch (err) {
        console.log(err.message);
        return next(new ApiError(500, "An errror occurred while creating the NhanVien"));
    }
}