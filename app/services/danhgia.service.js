const { ObjectId } = require("mongodb");

class DanhGiaService {
    constructor(client) {
        this.DanhGia = client.db().collection("danhgias");
    }

    extractDanhGiaData(payload) {
        const danhGia = {
          productId: payload.productId,
          userId: payload.userId,
          soSao: payload.soSao,
          noiDung: payload.noiDung,
          createdAt: payload.createdAt,
        }
        // remove field undefined
        Object.keys(danhGia).forEach(
            (key) => danhGia[key] === undefined && delete danhGia[key]
        );
        return danhGia;
    }

    async find(id) {
        const binhLuan = await this.DanhGia.find({productId: id});
        const result = await binhLuan.toArray();
        let tong = 0;
        for(let i=0; i< result.length; i++){
            tong += result[i].soSao;
        }
        return {tongSoSao: tong, tongSoDG: result.length};
    }

    async create(payload) {
        const danhGia = this.extractDanhGiaData(payload);
        const result = await this.DanhGia.insertOne(danhGia);
        //console.log(result);
        return result;
    }

}

module.exports = DanhGiaService;