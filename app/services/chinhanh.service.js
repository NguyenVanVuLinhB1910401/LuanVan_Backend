const { ObjectId } = require("mongodb");

class ChiNhanhService {
    constructor(client) {
        this.ChiNhanh = client.db().collection("chinhanhs");
    }

    extractChiNhanhData(payload) {
        const chiNhanh = {
            tenChiNhanh: payload.tenChiNhanh,
            diaChiChiNhanh: payload.diaChiChiNhanh
        }
        // remove field undefined
        Object.keys(chiNhanh).forEach(
            (key) => chiNhanh[key] === undefined && delete chiNhanh[key]
        );
        return chiNhanh;
    }
    async find() {
        const chiNhanh = await this.ChiNhanh.find({});
        return await chiNhanh.toArray();
    }

    async findByTen(ten) {
        const chiNhanh = this.ChiNhanh.findOne({tenChiNhanh: ten});
        return chiNhanh;

    }

    async create(payload) {
        const chiNhanh = this.extractChiNhanhData(payload);
        const result = await this.ChiNhanh.findOneAndUpdate(
            chiNhanh,
            {$set: {}},
            { returnDocument: "after", upsert: true}
        );
        //console.log(result);
        return result.value;
    }

    async delete(id) {
        const result = await this.ChiNhanh.findOneAndDelete(
            { _id: ObjectId.isValid(id) ? new ObjectId(id) : null }
        );
        return result.value;
    }
}

module.exports = ChiNhanhService;