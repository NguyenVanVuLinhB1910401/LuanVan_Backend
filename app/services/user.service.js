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

    
    async findByTaiKhoan(payload) {
        const user = await this.User.findOne({taiKhoan: payload.taiKhoan, loaiNguoiDung: payload.loaiNguoiDung});
        return user;

    }
    async findByTaiKhoanKhachHang(taikhoan) {
        const user = await this.User.findOne({taiKhoan: taikhoan, loaiNguoiDung: "KhachHang"});
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

    async findByTaiKhoanNhanVien(taikhoan) {
      const user = this.User.findOne({taiKhoan: taikhoan, loaiNguoiDung: "Nhân Viên"});
      return user;

  }
    async createNV(payload) {
      const user = this.extractUserData(payload);
      //console.log(user);
      user.loaiNguoiDung = "Nhân Viên";
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

      async soLuongKH(){
        const soLuong = await this.User.find({loaiNguoiDung: "KhachHang"}).count();
        return soLuong;
      }

      async soLuongNV(){
        const soLuong = await this.User.find({loaiNguoiDung: "Nhân Viên"}).count();
        return soLuong;
      }

      async findAllNhanVien() {
        const nhanVien = await this.User.aggregate([
          {
            $match: {
              loaiNguoiDung: "Nhân Viên"
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
        const result = await nhanVien.toArray();
    
        return result;
      }

      async update(id, payload) { 
        
        const filter = { 
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null, 
        };
        
        const result = await this.User.findOneAndUpdate( 
            filter, 
            { $set: {
              trangThai: payload.trangThai
            } }, 
            { returnDocument: "after" } );
        return result.value; 
      }
    
}
module.exports = UserService;