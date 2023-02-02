const { ObjectId } = require("mongodb");

class NhaCungCapService {
    constructor(client) {
        this.NhaCungCap = client.db().collection("nhacungcaps");
    }

    extractNhaCungCapData(payload) {
        const nhaCungCap = {
            tenNCC: payload.tenNCC,
            diaChiNCC: payload.diaChiNCC,
            sdtNCC: payload.sdtNCC,
            emailNCC: payload.emailNCC,
        }
        // remove field undefined
        Object.keys(nhaCungCap).forEach(
            (key) => nhaCungCap[key] === undefined && delete nhaCungCap[key]
        );
        return nhaCungCap;
    }
    async find() {
        const nhaCungCap = await this.NhaCungCap.find({});
        return await nhaCungCap.toArray();
    }

    async findByTen(ten) {
        const nhaCungCap = this.NhaCungCap.findOne({tenNCC: ten});
        return nhaCungCap;

    }

    async create(payload) {
        const nhaCungCap = this.extractNhaCungCapData(payload);
        const result = await this.NhaCungCap.findOneAndUpdate(
            nhaCungCap,
            {$set: {}},
            { returnDocument: "after", upsert: true}
        );
        //console.log(result);
        return result.value;
    }

    async delete(id) {
        const result = await this.NhaCungCap.findOneAndDelete(
            { _id: ObjectId.isValid(id) ? new ObjectId(id) : null }
        );
        return result.value;
    }
}

module.exports = NhaCungCapService;