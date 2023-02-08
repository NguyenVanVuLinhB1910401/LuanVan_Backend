const { ObjectId } = require('mongodb');
const path = require('path');
const moment = require('moment');
const MongoDB = require('../utils/mongodb.util');
class PhieuNhapXuatService {
  constructor(client) {
    this.PhieuNhapXuat = client.db().collection('phieunhapxuats');
  }
  //Dinh nghia cac phuong thuc truy xuat CSDL su dung mongodb
  extractPhieuNhapXuatData(payload) {
    const phieuNhapXuat = {
      idUser: payload.idUser,
      noiDung: payload.noiDung,
      total: payload.total,
      dateTime: payload.dateTime,
    };
    // Remove undefined fields
    Object.keys(phieuNhapXuat).forEach(
      (key) => phieuNhapXuat[key] === undefined && delete phieuNhapXuat[key]
    );

    return phieuNhapXuat;
  }

  async findPhieuNhap() {
    const phieuNhap = await this.PhieuNhapXuat.aggregate([
      {
        $match: {
          loaiPhieu: "Phiếu Nhập"
        },
      },
      {
        // Lay cac truong can thiet 1 -> lay; 0 -> an
        $project: {
          idUser: {
            $toObjectId: '$idUser',
          },
          noiDung: 1,
          total: 1,
          dateTime: 1,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'idUser',
          foreignField: '_id',
          as: 'idUser',
        },
      },
    ]);
    const result = await phieuNhap.toArray();
    return result;
  }

  async findOnePhieuNhap(id) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const phieuNhap = await this.PhieuNhapXuat.aggregate([
      {
        $match: filter,
      },
      {
        // Lay cac truong can thiet 1 -> lay; 0 -> an
        $project: {
          idUser: {
            $toObjectId: '$idUser',
          },
          noiDung: 1,
          total: 1,
          dateTime: 1,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'idUser',
          foreignField: '_id',
          as: 'idUser',
        },
      },
    ]);
    const result = await phieuNhap.toArray();
    return result[0];
  }

  async createPhieuNhap(payload) {
    const phieuNhap = this.extractPhieuNhapXuatData(payload);
    const result = await this.PhieuNhapXuat.findOneAndUpdate(
      phieuNhap,
      {
        $set: {
          loaiPhieu: 'Phiếu Nhập',
        },
      },
      { returnDocument: 'after', upsert: true }
    );
    //console.log(result);
    return result.value;
  }
  async findPhieuXuat() {
    const phieuNhap = await this.PhieuNhapXuat.aggregate([
      {
        $match: {
          loaiPhieu: "Phiếu Xuất"
        },
      },
      {
        // Lay cac truong can thiet 1 -> lay; 0 -> an
        $project: {
          idUser: {
            $toObjectId: '$idUser',
          },
          noiDung: 1,
          total: 1,
          dateTime: 1,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'idUser',
          foreignField: '_id',
          as: 'idUser',
        },
      },
    ]);
    const result = await phieuNhap.toArray();
    return result;
  }

  async findOnePhieuXuat(id) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const phieuXuat = await this.PhieuNhapXuat.aggregate([
      {
        $match: filter,
      },
      {
        // Lay cac truong can thiet 1 -> lay; 0 -> an
        $project: {
          idUser: {
            $toObjectId: '$idUser',
          },
          noiDung: 1,
          total: 1,
          dateTime: 1,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'idUser',
          foreignField: '_id',
          as: 'idUser',
        },
      },
    ]);
    const result = await phieuXuat.toArray();
    return result[0];
  }

  async createPhieuXuat(payload) {
    const phieuXuat = this.extractPhieuNhapXuatData(payload);
    const result = await this.PhieuNhapXuat.findOneAndUpdate(
      phieuXuat,
      {
        $set: {
          loaiPhieu: 'Phiếu Xuất',
        },
      },
      { returnDocument: 'after', upsert: true }
    );
    //console.log(result);
    return result.value;
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };

    const update = this.extractSanPhamData(payload);
    console.log(update);
    const result = await this.SanPham.findOneAndUpdate(
      filter,
      {
        $set: {
          ...update,
          updateAt: moment().format('MM/DD/YYYY HH:mm:ss'),
        },
      },
      { returnDocument: 'after' }
    );
    return result.value;
  }

  async delete(id) {
    const result = await this.SanPham.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }
}
module.exports = PhieuNhapXuatService;
