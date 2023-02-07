const { ObjectId } = require("mongodb");

class TonKhoService {
    constructor(client) {
        this.TonKho = client.db().collection("tonkhhos");
    }
    //Dinh nghia cac phuong thuc truy xuat CSDL su dung mongodb
    extractTonKhoData(payload) {
        const tonKho = {
            idSP: payload.idSP,
            idCN: payload.idCN,
            soLuong: payload.soLuong,
        };
        // Remove undefined fields
        Object.keys(tonKho).forEach(
            (key) => tonKho[key] === undefined && delete tonKho[key]
        );

        return tonKho;
    }
    async findAll() {
        const dsSanPham = await this.TonKho.aggregate([
            {
              $project: {
                idSP: {
                  $toObjectId: '$idSP',
                },
                idCN: {
                  $toObjectId: '$idCN',
                },
                soLuong: 1,
                daBan: 1,
                },
            },
            {
              $lookup: {
                from: 'sanphams',
                localField: 'idSP',
                foreignField: '_id',
                as: 'idSP',
              },
            },
            {
              $lookup: {
                from: 'chinhanhs',
                localField: 'idCN',
                foreignField: '_id',
                as: 'idCN',
              },
            },
            {$unwind: '$idSP'},
            {$unwind: '$idCN'},
          ]);
          const result = await dsSanPham.toArray();
          return result;
    }
    async find() {
        const loaiSanPham = await this.LoaiSanPham.find({});
        return await loaiSanPham.toArray();
    }

    async findOne(payload) {
        const result = await this.TonKho.findOne(payload);
        return result;

    }
    async create(payload) {
        const tonKho = this.extractTonKhoData(payload);
        console.log(tonKho);
        const result = await this.TonKho.findOneAndUpdate(
            {idSP: tonKho.idSP, idCN: tonKho.idCN},
            {$set: {...tonKho, daBan: 0 }},
            { returnDocument: "after", upsert: true}
        );
        //console.log(result);
        return result.value;
    }

    async updateSoLuong(payload) {
        const result = await this.TonKho.findOneAndUpdate(
            {idSP: payload.idSP, idCN: payload.idCN},
            {$set: {soLuong: payload.soLuong}},
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
module.exports = TonKhoService;
