const PhieuNhapXuatService = require('../services/phieunhapxuat.service');
const ChiTietPhieuNhapXuatService = require('../services/chitietphieunhapxuat.service');
const TonKhoService = require('../services/tonkho.service');
const MongoDB = require('../utils/mongodb.util');
const ApiError = require('../api-error');
const { ObjectId, startSession } = require('mongodb');
const ThongTinChuyenKhoService = require('../services/thongtinchuyenkho.service');

exports.getAllPhieuNhap = async (req, res, next) => {
  try {
    const phieuNhapXuatService = new PhieuNhapXuatService(MongoDB.client);
    const result = await phieuNhapXuatService.findPhieuNhap();
    return res.status(200).json({ result });
  } catch (err) {
    console.log(err);
    return next(
      new ApiError(500, 'An errror occurred while finding the AllPhieuNhap')
    );
  }
};

exports.getOnePhieuNhap = async (req, res, next) => {
  try {
    const phieuNhapXuatService = new PhieuNhapXuatService(MongoDB.client);
    const result = await phieuNhapXuatService.findOnePhieuNhap(req.params.id);
    const chiTietPhieuNhapXuatService = new ChiTietPhieuNhapXuatService(
      MongoDB.client
    );
    const dsSanPham = await chiTietPhieuNhapXuatService.find(req.params.id);
    //console.log(dsSanPham);
    return res.status(200).json({ result, dsSanPham });
  } catch (err) {
    console.log(err);
    return next(
      new ApiError(500, 'An errror occurred while finding the OnePhieuNhap')
    );
  }
};

exports.getAllDanhSachSanPhamDaNhap = async (req, res, next) => {
  try {
    const chiTietPhieuNhapXuatService = new ChiTietPhieuNhapXuatService(
      MongoDB.client
    );
    const result = await chiTietPhieuNhapXuatService.findAll();
    return res.status(200).json({ result });
  } catch (err) {
    console.log(err);
    return next(
      new ApiError(
        500,
        'An errror occurred while finding the ALLDanhSachSanPhamDaNhap'
      )
    );
  }
};

exports.createPhieuNhap = async (req, res, next) => {
  const phieuNhap = {
    idUser: req.body.idUser,
    noiDung: req.body.noiDung,
    total: req.body.total,
    dateTime: req.body.dateTime,
    loaiPhieu: 'Phiếu Nhập',
  };
  let dsSanPham = req.body.dsSanPham;
  // console.log(phieuNhap);
  // console.log(dsSanPham);
  const client = MongoDB.client;
  const session = client.startSession();
  try {
    session.startTransaction();
    //create phieu nhap
    const phieuNhapCollection = client.db().collection('phieunhapxuats');
    const resultPN = await phieuNhapCollection.insertOne(phieuNhap, {
      session,
    });
    console.log(resultPN);
    //Create chi tiet phieu nhap
    dsSanPham = req.body.dsSanPham.map((pro) => {
      return {
        idPhieuNhapXuat: resultPN.insertedId.toString(),
        idSP: pro.idSP,
        idCN: pro.idCN,
        idNCC: pro.idNCC,
        soLuong: parseInt(pro.soLuong),
        gia: parseInt(pro.gia),
        loaiPhieu: 'Phiếu Nhập',
      };
    });
    const chiTietPhieuNhapCollection = client.db().collection('chitietphieunhapxuats');
    const resultCTPN = await chiTietPhieuNhapCollection.insertMany(dsSanPham, {
      session,
    });
    console.log(resultCTPN);
    //Update so luong san pham trong kho
    const tonKhoCollection = client
        .db()
        .collection('tonkhhos');
      for (let i = 0; i < dsSanPham.length; i++) {
        const result = await tonKhoCollection.findOneAndUpdate(
          { idSP: dsSanPham[i].idSP, idCN: dsSanPham[i].idCN },
          { $inc: { soLuong: +dsSanPham[i].soLuong }, $setOnInsert: {
            daBan: 0,  // good
          } },
          { session, setDefaultsOnInsert: true, returnDocument: 'after', upsert: true}
        );
        console.log(result);
      }
    await session.commitTransaction();
    await session.endSession();
    //console.log('Transaction successfully committed.');
    return res.status(201).json({ msg: 'Nhập hàng thành công', code: 1 });
  } catch (error) {
    //console.log(error);
    await session.abortTransaction();
    await session.endSession();
    return res.status(200).json({ msg: 'Nhập hàng thất bại', code: 0 });;
  }
  // try {
  //   const phieuNhapService = new PhieuNhapXuatService(MongoDB.client);
  //   const resultPhieuNhap = await phieuNhapService.createPhieuNhap(phieuNhap);
  //   const dsSanPham = req.body.dsSanPham.map((pro) => {
  //     return {
  //       idPhieuNhapXuat: resultPhieuNhap._id,
  //       idSP: pro.idSP,
  //       idCN: pro.idCN,
  //       idNCC: pro.idNCC,
  //       soLuong: parseInt(pro.soLuong),
  //       gia: pro.gia,
  //       loaiPhieu: 'Phiếu Nhập',
  //     };
  //   });
  //   const chiTietPhieuNhapXuatService = new ChiTietPhieuNhapXuatService(
  //     MongoDB.client
  //   );
  //   const resultChiTiet = await chiTietPhieuNhapXuatService.createMany(
  //     dsSanPham
  //   );
  //   const tonKhoService = new TonKhoService(MongoDB.client);
  //   for (let i = 0; i < dsSanPham.length; i++) {
  //     const checkSPTCN = await tonKhoService.findOne({
  //       idSP: dsSanPham[i].idSP,
  //       idCN: dsSanPham[i].idCN,
  //     });
  //     // console.log(checkSPTCN);
  //     if (checkSPTCN) {
  //       const resultTonKho = await tonKhoService.updateSoLuong({
  //         ...dsSanPham[i],
  //         soLuong:
  //           parseInt(checkSPTCN.soLuong) + parseInt(dsSanPham[i].soLuong),
  //       });
  //     } else {
  //       const resultTonKho = await tonKhoService.create(dsSanPham[i]);
  //     }
  //   }
  //   return res.status(201).json({ message: 'Nhập kho thành công' });
  // } catch (err) {
  //   console.log(err);
  //   return next(
  //     new ApiError(500, 'An errror occurred while creating the PhieuNhap')
  //   );
  // }
};
exports.getAllSanPhamTrongKho = async (req, res, next) => {
  try {
    const tonKhoService = new TonKhoService(MongoDB.client);
    const result = await tonKhoService.findAll();
    return res.status(200).json({ result });
  } catch (err) {
    console.log(err);
    return next(
      new ApiError(
        500,
        'An errror occurred while finding the AllSanPhamTrongKho'
      )
    );
  }
};

exports.getAllPhieuXuat = async (req, res, next) => {
  try {
    const phieuNhapXuatService = new PhieuNhapXuatService(MongoDB.client);
    const result = await phieuNhapXuatService.findPhieuXuat();
    return res.status(200).json({ result });
  } catch (err) {
    console.log(err);
    return next(
      new ApiError(500, 'An errror occurred while finding the AllPhieuXuat')
    );
  }
};

exports.getOnePhieuXuat = async (req, res, next) => {
  try {
    const phieuNhapXuatService = new PhieuNhapXuatService(MongoDB.client);
    const result = await phieuNhapXuatService.findOnePhieuXuat(req.params.id);
    const chiTietPhieuNhapXuatService = new ChiTietPhieuNhapXuatService(
      MongoDB.client
    );
    const dsSanPham = await chiTietPhieuNhapXuatService.find(req.params.id);
    //console.log(dsSanPham);
    return res.status(200).json({ result, dsSanPham });
  } catch (err) {
    console.log(err);
    return next(
      new ApiError(500, 'An errror occurred while finding the OnePhieuNhap')
    );
  }
};

exports.getAllDanhSachSanPhamDaXuat = async (req, res, next) => {
  try {
    const chiTietPhieuNhapXuatService = new ChiTietPhieuNhapXuatService(
      MongoDB.client
    );
    const result = await chiTietPhieuNhapXuatService.findAllSPDaXuat();
    return res.status(200).json({ result });
  } catch (err) {
    console.log(err);
    return next(
      new ApiError(
        500,
        'An errror occurred while finding the ALLDanhSachSanPhamDaXuat'
      )
    );
  }
};

exports.createPhieuXuat = async (req, res, next) => {
  const phieuXuat = {
    idUser: req.body.idUser,
    noiDung: req.body.noiDung,
    total: req.body.total,
    dateTime: req.body.dateTime,
    loaiPhieu: 'Phiếu Xuất',
  };
  let dsSanPham = req.body.dsSanPham;
  // console.log(phieuNhap);
  // console.log(dsSanPham);
  const client = MongoDB.client;
  const session = client.startSession();
  try {
    session.startTransaction();
    //create phieu nhap
    const phieuXuatCollection = client.db().collection('phieunhapxuats');
    const resultPX = await phieuXuatCollection.insertOne(phieuXuat, {
      session,
    });
    console.log(resultPX);
    //Create chi tiet phieu nhap
    dsSanPham = req.body.dsSanPham.map((pro) => {
      return {
        idPhieuNhapXuat: resultPX.insertedId.toString(),
        idSP: pro.idSP,
        idCN: pro.idCN,
        // idNCC: pro.idNCC,
        soLuong: parseInt(pro.soLuong),
        gia: parseInt(pro.gia),
        loaiPhieu: 'Phiếu Xuất',
      };
    });
    const chiTietPhieuXuatCollection = client.db().collection('chitietphieunhapxuats');
    const resultCTPX = await chiTietPhieuXuatCollection.insertMany(dsSanPham, {
      session,
    });
    console.log(resultCTPX);
    //Update so luong san pham trong kho
    const tonKhoCollection = client
        .db()
        .collection('tonkhhos');
      for (let i = 0; i < dsSanPham.length; i++) {
        const result = await tonKhoCollection.findOneAndUpdate(
          { idSP: dsSanPham[i].idSP, idCN: dsSanPham[i].idCN },
          { $inc: { daBan: +dsSanPham[i].soLuong }, },
          { session, returnDocument: 'after'}
        );
      }
    await session.commitTransaction();
    await session.endSession();
    //console.log('Transaction successfully committed.');
    return res.status(201).json({ msg: 'Xuất hàng thành công', code: 1 });
  } catch (error) {
    //console.log(error);
    await session.abortTransaction();
    await session.endSession();
    return res.status(200).json({ msg: 'Xuất hàng thất bại', code: 0 });;
  }
  // try {
  //   //const phieuXuat = req.body;
  //   //console.log(phieuXuat);
  //   // let dsSanPham = req.body.dsSanPham.map((pro) => {
  //   //   return {
  //   //     // idPhieuNhapXuat: resultPhieuXuat._id,
  //   //     idSP: pro.idSP,
  //   //     idCN: pro.idCN,
  //   //     soLuong: pro.soLuong,
  //   //     gia: pro.gia,
  //   //     loaiPhieu: 'Phiếu Xuất',
  //   //   };
  //   // });
  //   // //Kiem tra so luong san pham trong kho
  //   // let promises = [];
  //   // const tonKhoService = new TonKhoService(MongoDB.client);
  //   // for (let i = 0; i < dsSanPham.length; i++) {
  //   //   promises.push(
  //   //     tonKhoService.findOne({
  //   //       idSP: dsSanPham[i].idSP,
  //   //       idCN: dsSanPham[i].idCN,
  //   //     })
  //   //   );
  //   // }
  //   // let checkSoLuong = 0;
  //   // await Promise.all(promises).then((promise) => {
  //   //   for (let i = 0; i < promise.length; i++) {
  //   //     if (
  //   //       promise[i] == null ||
  //   //       dsSanPham[i].soLuong + promise[i]?.daBan > promise[i]?.soLuong
  //   //     )
  //   //       checkSoLuong = 1;
  //   //     else dsSanPham[i].daBan = dsSanPham[i].soLuong + promise[i]?.daBan;
  //   //   }
  //   // });
  //   // if (checkSoLuong === 1)
  //   //   return res.status(200).json({ message: 'Sản phẩm đã hết hàng!!!' });
  //   // else {
  //   //   promises = [];
  //   //   for (let i = 0; i < dsSanPham.length; i++) {
  //   //     promises.push(tonKhoService.updateDaBan(dsSanPham[i]));
  //   //   }
  //   //   await Promise.all(promises);
  //   //   //Create phieu xuat
  //   //   const phieuXuatService = new PhieuNhapXuatService(MongoDB.client);
  //   //   const resultPhieuXuat = await phieuXuatService.createPhieuXuat(phieuXuat);
  //   //   dsSanPham = req.body.dsSanPham.map((pro) => {
  //   //     return {
  //   //       idPhieuNhapXuat: resultPhieuXuat._id,
  //   //       idSP: pro.idSP,
  //   //       idCN: pro.idCN,
  //   //       soLuong: pro.soLuong,
  //   //       gia: pro.gia,
  //   //       loaiPhieu: 'Phiếu Xuất',
  //   //     };
  //   //   });
  //   //   //Create chi tiet phieu xuat
  //   //   const chiTietPhieuNhapXuatService = new ChiTietPhieuNhapXuatService(
  //   //     MongoDB.client
  //   //   );
  //   //   const resultChiTiet = await chiTietPhieuNhapXuatService.createMany(
  //   //     dsSanPham
  //   //   );
  //   //   return res.status(201).json({ message: 'Xuất kho thành công' });
  //   // }
  // } catch (err) {
  //   //console.log(err);
  //   return next(
  //     new ApiError(500, 'An errror occurred while creating the PhieuXuat')
  //   );
  // }
};

exports.chuyenKho = async (req, res, next) => {
  //console.log(req.body);
  try {
    const tonKhoService = new TonKhoService(MongoDB.client);
    const result = await tonKhoService.chuyenKho(req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, 'An errror occurred while Chuyen Kho '));
  }
};

exports.thongTinChuyenKho = async (req, res, next) => {
  //console.log(req.body);
  try {
    const thongTinChuyenKhoService = new ThongTinChuyenKhoService(MongoDB.client);
    const result = await thongTinChuyenKhoService.findAll();
    //console.log(result);
    return res.status(200).json(result);
  } catch (err) {
    //console.log(err);
    return next(new ApiError(500, 'An errror occurred while Thong Tin Chuyen Kho '));
  }
};
