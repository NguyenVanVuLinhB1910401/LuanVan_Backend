const { ObjectId, startSession } = require('mongodb');
const ThongTinChuyenKhoService = require('./thongtinchuyenkho.service');
class TonKhoService {
  constructor(client) {
    this.TonKho = client.db().collection('tonkhhos');
    this.client = client;
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
  async findAll(payload) {
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
      { $unwind: '$idSP' },
      { $unwind: '$idCN' },
    ]);
    const result = await dsSanPham.toArray();
    //console.log(result);
    return result;
  }
  async findAllSanPham(payload) {
    const filter = {};
    if(payload.idLoai) filter.idLoaiSP = payload.idLoai;
    if(payload.idHang) filter.idHangDT = payload.idHang;
    const filterTK =  {};
    if(payload.idCN) filterTK.idCN = payload.idCN;
    const sanPhams = await this.TonKho.aggregate([
      {
        $match: {
          ...filterTK,
          $expr:{
            $gt:["$soLuong", "$daBan"]
          }
        }
      },
      {
        $project: {
          idSP: {
            $toObjectId: '$idSP',
          },
          idCN: 1,
          soLuong: 1,
          daBan: 1,
          _id: 1,
        },
      },
      {
        $lookup: {
          from: 'sanphams',
          localField: 'idSP',
          foreignField: '_id',
          as: 'sanpham',
          pipeline : [
            {
              $match: {
                ...filter,
                trangThai: "1"
              }
            },
            { 
              $project : 
              { 
                _id:1,
                tenSanPham: 1,
                anhDaiDien: 1, 
                giaBan: 1,
                giaGoc: 1,
                khuyenMai: 1,
                idLoaiSP: 1,
                idHangDT: 1
              },
               
            }
        ]
        },
      },
      { $unwind: '$sanpham' },
      // { $unwind: '$idCN' },
    ]);
    return await sanPhams.toArray();
  }

  async findAllSanPhamMoi(idCN) {
    const filter = {};
    if(idCN) filter.idCN = idCN;
    const sanPhams = await this.TonKho.aggregate([
      {
        $match: {
          ...filter,
          $expr:{
            $gt:["$soLuong", "$daBan"]
          }
        }
      },
      {
        $project: {
          idSP: {
            $toObjectId: '$idSP',
          },
          idCN: 1,
          soLuong: 1,
          daBan: 1,
          _id: 1,
        },
      },
      {
        $lookup: {
          from: 'sanphams',
          localField: 'idSP',
          foreignField: '_id',
          as: 'sanpham',
          pipeline : [
            {
              $match: {
                spMoi: "1",
                trangThai: "1"
              },
            },
            { 
              $project : 
              { 
                _id:1,
                tenSanPham: 1,
                anhDaiDien: 1, 
                giaBan: 1,
                giaGoc: 1,
                khuyenMai: 1,
                idLoaiSP: 1,
                idHangDT: 1
              },
               
            }
        ]
        },
      },
      { $unwind: '$sanpham' },
      {$limit: 5},
      // { $unwind: '$idCN' },
    ]);
    return await sanPhams.toArray();
  }

  async findAllSanPhamNoiBat(idCN) {
    const filter = {};
    if(idCN) filter.idCN = idCN;
    const sanPhams = await this.TonKho.aggregate([
      {
        $match: {
          ...filter,
          $expr:{
            $gt:["$soLuong", "$daBan"]
          }
        }
      },
      {
        $project: {
          idSP: {
            $toObjectId: '$idSP',
          },
          idCN: 1,
          soLuong: 1,
          daBan: 1,
          _id: 1,
        },
      },
      {
        $lookup: {
          from: 'sanphams',
          localField: 'idSP',
          foreignField: '_id',
          as: 'sanpham',
          pipeline : [
            {
              $match: {
                spNoiBat: "1",
                trangThai: "1"
              },
            },
            { 
              $project : 
              { 
                _id:1,
                tenSanPham: 1,
                anhDaiDien: 1, 
                giaBan: 1,
                giaGoc: 1,
                khuyenMai: 1,
                idLoaiSP: 1,
                idHangDT: 1
              },
               
            }
        ]
        },
      },
      { $unwind: '$sanpham' },
      {$limit: 5},
      // { $unwind: '$idCN' },
    ]);
    return await sanPhams.toArray();
  }
  async findAllSanPhamTheoCN(idCN) {
    const sanPhams = await this.TonKho.aggregate([
      {
        $match: {
          $expr:{
            $gt:["$soLuong", "$daBan"]
          },
          idCN: idCN
        }
      },
      {
        $project: {
          idSP: {
            $toObjectId: '$idSP',
          },
          idCN: 1,
          soLuong: 1,
          daBan: 1,
          _id: 1,
        },
      },
      {
        $lookup: {
          from: 'sanphams',
          localField: 'idSP',
          foreignField: '_id',
          as: 'sanpham',
          pipeline : [
            {
              $match: {
                trangThai: "1"
              },
            },
            { 
              $project : 
              { 
                _id:1,
                tenSanPham: 1,
                anhDaiDien: 1, 
                giaBan: 1,
                giaGoc: 1,
                khuyenMai: 1,
                idLoaiSP: 1,
                idHangDT: 1
              },
               
            }
        ]
        },
      },
      { $unwind: '$sanpham' },
      {$limit: 5},
      // { $unwind: '$idCN' },
    ]);
    return await sanPhams.toArray();
  }
  async findOneSanPhamChiTiet(id) {

    const sanPham = await this.TonKho.aggregate([
      {
        $match: {_id: ObjectId.isValid(id) ? new ObjectId(id) : null}
      },
      {
        $project: {
          idSP: {
            $toObjectId: '$idSP',
          },
          idCN: 1,
          soLuong: 1,
          daBan: 1,
          _id: 1,
        },
      },
      {
        $lookup: {
          from: 'sanphams',
          localField: 'idSP',
          foreignField: '_id',
          as: 'sanpham',
        },
      },
      // {
      //   $lookup: {
      //     from: 'chinhanhs',
      //     localField: 'idCN',
      //     foreignField: '_id',
      //     as: 'idCN',
      //   },
      // },
      { $unwind: '$sanpham' },
      { $limit: 1}
      // { $unwind: '$idCN' },
    ]);
    const result = await sanPham.toArray();
    return result[0];
  }

  async findOne(payload) {
    const result = await this.TonKho.findOne(payload);
    return result;
  }
  async create(payload) {
    const tonKho = this.extractTonKhoData(payload);
    console.log(tonKho);
    const result = await this.TonKho.findOneAndUpdate(
      { idSP: tonKho.idSP, idCN: tonKho.idCN },
      { $set: { ...tonKho, daBan: 0 } },
      { returnDocument: 'after', upsert: true }
    );
    //console.log(result);
    return result.value;
  }

  async updateSoLuong(payload) {
    const result = await this.TonKho.findOneAndUpdate(
      { idSP: payload.idSP, idCN: payload.idCN },
      { $set: { soLuong: payload.soLuong } },
      { returnDocument: 'after', upsert: true }
    );
    //console.log(result);
    return result.value;
  }

  async updateDaBan(payload) {
    const result = await this.TonKho.findOneAndUpdate(
      { idSP: payload.idSP, idCN: payload.idCN },
      { $set: { daBan: payload.daBan } },
      { returnDocument: 'after', upsert: true }
    );
    //console.log(result);
    return result.value;
  }

  async chuyenKho(payload) {
    //console.log(payload);
    const session = this.client.startSession();
    try {
      session.startTransaction();
      const tonKhosCollection = this.client.db().collection('tonkhhos');
      for(let i = 0; i < payload.length; i++) {
        const decreamentFrom = await tonKhosCollection.findOneAndUpdate(
          { idCN: payload[i].idCNFrom, idSP: payload[i].idSP },
          { $inc: { soLuong: -payload[i].soLuong } },
          { session, returnDocument: 'after' }
        );
        //console.log(decreamentFrom.value);
        if(!decreamentFrom.value) {
          throw new Error(`Không tìm thấy ${payload[i].tenSanPham} tại ${payload[i].tuChiNhanh}`);
        }
        if(decreamentFrom.value.soLuong < decreamentFrom.value.daBan) {
          throw new Error(`${payload[i].tenSanPham} tại ${payload[i].tuChiNhanh} không đủ số lượng`);
        }
        const increamentTo = await tonKhosCollection.findOneAndUpdate(
          { idCN: payload[i].idCNTo, idSP: payload[i].idSP },
          { $inc: { soLuong: +payload[i].soLuong },  $setOnInsert: {
            daBan: 0,  // good
          } },
          { session, setDefaultsOnInsert: true, returnDocument: 'after', upsert: true }
        );
        //console.log(increamentTo.value);
      }
      const thongTinChuyenKhoService = new ThongTinChuyenKhoService(this.client);
      const ttck = await thongTinChuyenKhoService.insertMany(payload);
      await session.commitTransaction();
      await session.endSession();
      //console.log('Transaction successfully committed.');
      return {msg: "Chuyển kho thành công", code: 1}
    } catch (error) {
      //console.log(error);
      await session.abortTransaction();
      await session.endSession();
      return {msg: error.message, code: 0}
    }
  }

  async delete(id) {
    const result = await this.LoaiSanPham.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }
}
module.exports = TonKhoService;
