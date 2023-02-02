const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.register = async (req, res, next) => {
    try {
        const user = req.body;
        const userService = new UserService(MongoDB.client);
        const isTaiKhoan = await userService.findByTaiKhoanKhachHang(user.taiKhoan);
        //console.log(isTaiKhoan);
        if(isTaiKhoan) return res.status(400).json({message: "Tai khoan da ton tai"});
        const salt = await bcrypt.genSalt();
        user.matKhau = await bcrypt.hash(user.matKhau, salt);
        const result = await userService.create(user);
        delete result.matKhau;
        return res.status(201).json({result});
    } catch (err) {
        console.log(err.message);
        return next(new ApiError(500, "An errror occurred while creating the user"));
    }
}

exports.login = async (req, res, next) => {
    const { taiKhoan, matKhau } = req.body;
    try {
        const userService = new UserService(MongoDB.client);
        const user = await userService.findByTaiKhoan(taiKhoan);
        if(!user) return res.status(400).json({ message: "User does not exist."});
        const isMatch = await bcrypt.compare(matKhau, user.matKhau);
        if(!isMatch) return res.status(400).json({ message: "Invalid credentials."});
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: "2h"});
        delete user.matKhau;
        return res.status(200).json({token, user});
    } catch (err) {
        console.log(err.message);
        return next(new ApiError(500, "An error occurred while logging."));
    }
}

exports.loginKH = async (req, res, next) => {
    const { taiKhoan, matKhau } = req.body;
    try {
        const userService = new UserService(MongoDB.client);
        const user = await userService.findByTaiKhoanKhachHang(taiKhoan);
        if(!user) return res.status(400).json({ message: "User does not exist."});
        if(user?.trangThai !== 1) return res.status(400).json({ message: "Tài khoản bị khóa."});
        const isMatch = await bcrypt.compare(matKhau, user.matKhau);
        if(!isMatch) return res.status(400).json({ message: "Invalid credentials."});
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: "2h"});
        delete user.matKhau;
        return res.status(200).json({token, user});
    } catch (err) {
        console.log(err.message);
        return next(new ApiError(500, "An error occurred while logging."));
    }
}