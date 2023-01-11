const { ObjectId } = require("mongodb");

class LoaiSanPhamService {
    constructor(client) {
        this.LoaiSanPham = client.db().collection("loaisanphams");
    }
    //Dinh nghia cac phuong thuc truy xuat CSDL su dung mongodb
    extractLoaiSanPhamData(payload) {
        const loaiSanPham = {
            tenLoaiSP: payload.tenLoaiSP,
        };
        // Remove undefined fields
        Object.keys(loaiSanPham).forEach(
            (key) => loaiSanPham[key] === undefined && delete loaiSanPham[key]
        );

        return loaiSanPham;
    }

    async find() {
        const loaiSanPham = await this.LoaiSanPham.find({});
        return await loaiSanPham.toArray();
    }

    async findByTen(ten) {
        const loaiSanPham = this.LoaiSanPham.findOne({tenLoaiSP: ten});
        return loaiSanPham;

    }
    async create(payload) {
        const loaiSanPham = this.extractLoaiSanPhamData(payload);
        const result = await this.LoaiSanPham.findOneAndUpdate(
            loaiSanPham,
            {$set: {}},
            { returnDocument: "after", upsert: true}
        );
        //console.log(result);
        return result.value;
    }

    async delete(id) {
        const result = await this.LoaiSanPham.findOneAndDelete(
            { _id: ObjectId.isValid(id) ? new ObjectId(id) : null }
        );
        return result.value;
    }

}
module.exports = LoaiSanPhamService;