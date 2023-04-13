const { ObjectId } = require('mongodb');
const path = require('path');
const MongoDB = require("../utils/mongodb.util");
class ChiTietPhieuNhapXuatService {
  constructor(client) {
    this.ChiTietPhieuNhapXuat = client.db().collection('chitietphieunhapxuats');
  }
  //Dinh nghia cac phuong thuc truy xuat CSDL su dung mongodb
  extractChiTietPhieuNhapXuatData(payload) {
    const phieuNhapXuat = {
      idPhieuNhapXuat : payload.idPhieuNhapXuat,
      idCN: payload.idCN,
      idNCC: payload.idNCC,
      idSP: payload.idSP,
      loaiPhieu: payload.loaiPhieu
    };
    // Remove undefined fields
    Object.keys(chiTietPhieuNhapXuat).forEach(
      (key) => chiTietPhieuNhapXuat[key] === undefined && delete chiTietPhieuNhapXuat[key]
    );
    return chiTietPhieuNhapXuat;
  }

  async find(id) {
    // const filter = {
    //   idPhieuNhapXuat: ObjectId.isValid(id) ? new ObjectId(id) : null,
    // };
    // console.log(filter);
    const dsSanPham = await this.ChiTietPhieuNhapXuat.aggregate([
      {
        $match: {
          idPhieuNhapXuat: id
        },
      },
      {
        $project: {
          idSP: {
            $toObjectId: '$idSP',
          },
          idCN: {
            $toObjectId: '$idCN',
          },
          idNCC: {
            $toObjectId: '$idNCC',
          },
          soLuong: 1,
          gia: 1
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
      {
        $lookup: {
          from: 'nhacungcaps',
          localField: 'idNCC',
          foreignField: '_id',
          as: 'idNCC',
        },
      },
    ]);
    const result = await dsSanPham.toArray();
    //console.log(result);
    return result;
  }

  async findAll() {
    const dsSanPham = await this.ChiTietPhieuNhapXuat.aggregate([
      {
        $match: {
          loaiPhieu: "Phiếu Nhập"
        },
      },
      {
        $project: {
          idSP: {
            $toObjectId: '$idSP',
          },
          idCN: {
            $toObjectId: '$idCN',
          },
          idNCC: {
            $toObjectId: '$idNCC',
          },
          soLuong: 1,
          gia: 1,
          idPhieuNhapXuat: 1
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
      {
        $lookup: {
          from: 'nhacungcaps',
          localField: 'idNCC',
          foreignField: '_id',
          as: 'idNCC',
        },
      },
      {$unwind: '$idSP'},
      {$unwind: '$idCN'},
      {$unwind: '$idNCC'},
    ]);
    const result = await dsSanPham.toArray();
    return result;
  }

  async findAllSPDaXuat() {
    const dsSanPham = await this.ChiTietPhieuNhapXuat.aggregate([
      {
        $match: {
          loaiPhieu: "Phiếu Xuất"
        },
      },
      {
        $project: {
          idSP: {
            $toObjectId: '$idSP',
          },
          idCN: {
            $toObjectId: '$idCN',
          },
          // idNCC: {
          //   $toObjectId: '$idNCC',
          // },
          soLuong: 1,
          gia: 1,
          idPhieuNhapXuat: 1
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
      // {
      //   $lookup: {
      //     from: 'nhacungcaps',
      //     localField: 'idNCC',
      //     foreignField: '_id',
      //     as: 'idNCC',
      //   },
      // },
      {$unwind: '$idSP'},
      {$unwind: '$idCN'},
      // {$unwind: '$idNCC'},
    ]);
    const result = await dsSanPham.toArray();
    return result;
  }

  async createMany(payload) {
    const result = await this.ChiTietPhieuNhapXuat.insertMany(payload);
    return result;
  }

  
}
module.exports = ChiTietPhieuNhapXuatService;
