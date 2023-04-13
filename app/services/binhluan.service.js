const { ObjectId } = require("mongodb");

class BinhLuanService {
    constructor(client) {
        this.BinhLuan = client.db().collection("binhluans");
    }

    extractBinhLuanData(payload) {
        const binhLuan = {
          productId: payload.productId,
          body: payload.body,
          hoTen: payload.hoTen,
          userId: payload.userId,
          parentId: payload.parentId,
          createdAt: payload.createdAt,
        }
        // remove field undefined
        Object.keys(binhLuan).forEach(
            (key) => binhLuan[key] === undefined && delete binhLuan[key]
        );
        return binhLuan;
    }
    async find(id) {
        const binhLuan = await this.BinhLuan.find({productId: id}).sort({createdAt: -1});
        return await binhLuan.toArray();
    }

    async create(payload) {
        const binhLuan = this.extractBinhLuanData(payload);
        const result = await this.BinhLuan.insertOne(binhLuan);
        //console.log(result);
        payload._id = result.insertId;
        return payload;
    }

}

module.exports = BinhLuanService;