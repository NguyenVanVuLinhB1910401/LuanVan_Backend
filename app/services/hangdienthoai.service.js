const { ObjectId } = require("mongodb");

class HangDienThoaiService {
    constructor(client) {
        this.HangDienThoai = client.db().collection("hangdienthoais");
    }

    extractHangDienThoaiData(payload) {
        const hangDienThoai = {
            tenHang: payload.tenHang,
        }
        // remove field undefined
        Object.keys(hangDienThoai).forEach(
            (key) => hangDienThoai[key] === undefined && delete hangDienThoai[key]
        );
        return hangDienThoai;
    }
    async find() {
        const hangDienThoai = await this.HangDienThoai.find({});
        return await hangDienThoai.toArray();
    }

    async soLuongHang() {
        const soLuong = await this.HangDienThoai.find({}).count();
        return soLuong;
    }

    async findByTen(ten) {
        const hangDienThoai = this.HangDienThoai.findOne({tenHang: ten});
        return hangDienThoai;

    }

    async create(payload) {
        const hangDienThoai = this.extractHangDienThoaiData(payload);
        const result = await this.HangDienThoai.findOneAndUpdate(
            hangDienThoai,
            {$set: {}},
            { returnDocument: "after", upsert: true}
        );
        //console.log(result);
        return result.value;
    }

    async delete(id) {
        const result = await this.HangDienThoai.findOneAndDelete(
            { _id: ObjectId.isValid(id) ? new ObjectId(id) : null }
        );
        return result.value;
    }
}

module.exports = HangDienThoaiService;