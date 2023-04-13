const { ObjectId } = require("mongodb");

class ThongTinChuyenKhoService {
    constructor(client) {
        this.ThongTinChuyenKho = client.db().collection("thongtinchuyenkhos");
    }

    extractThongTinChuyenKhoData(payload) {
        const thongTinChuyenKho = {
            idCNFrom: payload.idCNFrom,
            idCNTo: payload.idCNTo,
            idSP: payload.idSP,
            soLuong: payload.soLuong,
            ngayChuyen: payload.ngayChuyen,
            idNV: payload.idNV
        }
        // remove field undefined
        Object.keys(thongTinChuyenKho).forEach(
            (key) => thongTinChuyenKho[key] === undefined && delete thongTinChuyenKho[key]
        );
        return thongTinChuyenKho;
    }

    async findAll() {
        // const filter = {
        //   _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        // };
        const TTCK = await this.ThongTinChuyenKho.aggregate([
          { $sort : { ngayChuyen : -1 } },
          {
            // Lay cac truong can thiet 1 -> lay; 0 -> an
            $project: {
                idCNFrom: {
                    $toObjectId: '$idCNFrom',
                },
                idCNTo: {
                    $toObjectId: '$idCNTo',
                },
              idSP: {
                $toObjectId: '$idSP',
              },
              idNV: {
                $toObjectId: '$idNV',
              },
              soLuong: 1,
              ngayChuyen: 1
            },
          },
          {
            $lookup: {
              from: 'chinhanhs',
              localField: 'idCNFrom',
              foreignField: '_id',
              as: 'idCNFrom',
            },
          },
          {
            $lookup: {
              from: 'chinhanhs',
              localField: 'idCNTo',
              foreignField: '_id',
              as: 'idCNTo',
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
              from: 'users',
              localField: 'idNV',
              foreignField: '_id',
              as: 'idNV',
            },
          },
          {$unwind: '$idCNFrom'},
          {$unwind: '$idCNTo'},
          {$unwind: '$idSP'},
          {$unwind: '$idNV'},
        ]);
        //console.log(await donHang.toArray());
        const result = await TTCK.toArray();
        return result;
      }

    async insertMany(payload) {
        const data = payload.map((ttck) => {
            return this.extractThongTinChuyenKhoData(ttck);
        });
        const result = await this.ThongTinChuyenKho.insertMany(data);
        return result;
    }
    
}

module.exports = ThongTinChuyenKhoService;