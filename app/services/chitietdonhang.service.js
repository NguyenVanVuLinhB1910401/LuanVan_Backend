const { ObjectId } = require("mongodb");

class ChiTietDonHangService {
    constructor(client) {
        this.ChiTietDonHang = client.db().collection("chitietdonhangs");
    }

    extractChiTietDonHangData(payload) {
        const chiTietDonHang = {
            idSP: payload.idSP,
            idDH: payload.idDH,
            soLuong: payload.soLuong,
            gia: payload.gia,
        }
        // remove field undefined
        Object.keys(chiTietDonHang).forEach(
            (key) => chiTietDonHang[key] === undefined && delete chiTietDonHang[key]
        );
        return chiTietDonHang;
    }
    async find(id) {
        // const filter = {
        //   _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        // };
        const CTDH = await this.ChiTietDonHang.aggregate([
          {
            $match: {
                idDH: id
            }
          },
          {
            // Lay cac truong can thiet 1 -> lay; 0 -> an
            $project: {
              idSP: {
                $toObjectId: '$idSP',
              },
              gia: 1,
              soLuong: 1
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
          {$unwind: '$idSP'},
        ]);
        //console.log(await donHang.toArray());
        const result = await CTDH.toArray();
        return result;
      }
    

    // async findByTen(ten) {
    //     const chiNhanh = this.ChiNhanh.findOne({tenChiNhanh: ten});
    //     return chiNhanh;

    // }

    async create(payload) {
        const result = await this.ChiTietDonHang.insertMany(payload);
        return result;
    }

    async deleteMany(id) {
        const result = await this.ChiTietDonHang.deleteMany(
            { _id: ObjectId.isValid(id) ? new ObjectId(id) : null }
        );
        return result.value;
    }
}

module.exports = ChiTietDonHangService;