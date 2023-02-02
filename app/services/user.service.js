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
            trangThai: 1,
        };
        //console.log(user);
        // Remove undefined fields
        Object.keys(user).forEach(
            (key) => user[key] === undefined && delete user[key]
        );
        //console.log(user);

        return user;
    }

    
    async findByTaiKhoan(taikhoan) {
        const user = this.User.findOne({taiKhoan: taikhoan, loaiNguoiDung: "Admin"});
        return user;

    }
    async findByTaiKhoanKhachHang(taikhoan) {
        const user = this.User.findOne({taiKhoan: taikhoan, loaiNguoiDung: "KhachHang"});
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

    async findAllKhachHang() {
        const khachHang = await this.User.aggregate([
          {
            $match: {
              loaiNguoiDung: "KhachHang"
            },
          },
          {
            // Lay cac truong can thiet 1 -> lay; 0 -> an
            $project: {
              taiKhoan: 1,
                matKhau: 1,
                hoTen: 1,
                email: 1,
                sdt: 1,
                diaChi: 1,
                loaiNguoiDung: 1,
                idCapBac: 1,
                trangThai: 1,            },
          },
        ]);
        const result = await khachHang.toArray();
    
        return result;
      }
}
module.exports = UserService;