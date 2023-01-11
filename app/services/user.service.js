const { ObjectId } = require("mongodb");

class UserService {
    constructor(client) {
        this.User = client.db().collection("users");
    }
    //Dinh nghia cac phuong thuc truy xuat CSDL su dung mongodb
    extractUserData(payload) {
        const user = {
            taiKhoan: payload.taiKhoan,
            matKhau: payload.matKhau,
            hoTen: payload.hoTen,
            email: payload.email,
            sdt: payload.sdt,
            diaChi: payload.diaChi,
            loaiNguoiDung: payload.loaiNguoiDung,
            idCapBac: payload.idCapBac,
        };
        //console.log(user);
        // Remove undefined fields
        Object.keys(user).forEach(
            (key) => user[key] === undefined && delete user[key]
        );
        //console.log(user);

        return user;
    }

    //USER REGISTER
    async findByTaiKhoan(taikhoan) {
        const user = this.User.findOne({taiKhoan: taikhoan});
        return user;

    }
    async create(payload) {
        const user = this.extractUserData(payload);
        //console.log(user);
        user.loaiNguoiDung = "KhachHang";
        const result = await this.User.findOneAndUpdate(
            user,
            {$set: {loaiNguoiDung: user.loaiNguoiDung}},
            { returnDocument: "after", upsert: true}
        )
        return result.value;

    }
}
module.exports = UserService;