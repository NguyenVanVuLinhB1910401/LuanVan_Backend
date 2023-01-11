const { ObjectId } = require('mongodb');
const path = require('path');
const moment = require('moment');
const GiaBanService = require("./giaban.service");
const MongoDB = require("../utils/mongodb.util");
class SanPhamService {
  constructor(client) {
    this.SanPham = client.db().collection('sanphams');
  }
  //Dinh nghia cac phuong thuc truy xuat CSDL su dung mongodb
  extractSanPhamData(payload) {
    const sanPham = {
      tenSanPham: payload.tenSanPham,
      manHinh: payload.manHinh,
      heDieuHanh: payload.heDieuHanh,
      cameraTruoc: payload.cameraTruoc,
      cameraSau: payload.cameraSau,
      chip: payload.chip,
      ram: payload.ram,
      dungLuong: payload.dungLuong,
      sim: payload.sim,
      pin: payload.pin,
      sac: payload.sac,
      moTa: payload.moTa,
      anhDaiDien: payload.anhDaiDien,
      idLoaiSP: payload.idLoaiSP,
      idHangDT: payload.idHangDT,
      idGiaBan: payload.giaBan,
      idKhuyenMai: payload.idKhuyenMai,
      dsAnh: payload.dsAnh,
      trangThai: payload.trangThai,
    };
    // Remove undefined fields
    Object.keys(sanPham).forEach(
      (key) => sanPham[key] === undefined && delete sanPham[key]
    );

    return sanPham;
  }

  async find() {
    //const sanPham = await this.SanPham.find({}).populate();
    const sanPham = await this.SanPham.aggregate([
      {
        // Lay cac truong can thiet 1 -> lay; 0 -> an
        $project: {
          idLoaiSP: {
            $toObjectId: '$idLoaiSP',
          },
          idHangDT: {
            $toObjectId: '$idHangDT',
          },
          // idGiaBan: {
          //   $toObjectId: '$idGiaBan',
          // },
          tenSanPham: 1,
          manHinh: 1,
          heDieuHanh: 1,
          cameraTruoc: 1,
          cameraSau: 1,
          chip: 1,
          ram: 1,
          dungLuong: 1,
          sim: 1,
          pin: 1,
          sac: 1,
          moTa: 1,
          anhDaiDien: 1,
          idGiaBan: 1,
          trangThai: 1,
        },
      },
      {
        $lookup: {
          from: 'loaisanphams',
          localField: 'idLoaiSP',
          foreignField: '_id',
          as: 'idLoaiSP',
        },
      },
      {
        $lookup: {
          from: 'hangdienthoais',
          localField: 'idHangDT',
          foreignField: '_id',
          as: 'idHangDT',
        },
      },
      // {
      //   $lookup: {
      //     from: 'giabans',
      //     localField: 'idGiaBan',
      //     foreignField: '_id',
      //     as: 'idGiaBan',
      //   },
      // },
    ]);
    const result = await sanPham.toArray();

    return result;
  }

  async findById(id) {
    const sanPham = await this.SanPham.findOne({_id: ObjectId.isValid(id) ? new ObjectId(id) : null});
    const { giaBan} = sanPham.idGiaBan;
    sanPham.giaBan = giaBan;
    //console.log(sanPham);
    return sanPham;
  }

  async findByTen(ten) {
    const sanPham = this.SanPham.findOne({ tenSanPham: ten });
    return sanPham;
  }
  async create(payload) {
    const giaBanService = new GiaBanService(MongoDB.client);
    //console.log(payload);
    const sanPham = this.extractSanPhamData(payload);
    const result = await this.SanPham.findOneAndUpdate(
      sanPham,
      {
        $set: {
          trangThai: sanPham.trangThai ?? 0,
          createAt: moment().format('MM/DD/YYYY HH:mm:ss'),
          updateAt: moment().format('MM/DD/YYYY HH:mm:ss'),
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
    //console.log(id);
    const result = await this.SanPham.findOneAndUpdate( 
        filter, 
        { $set: update }, 
        { returnDocument: "after" } );
    return result.value; 
  }

  async delete(id) {
    const result = await this.SanPham.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }
}
module.exports = SanPhamService;
