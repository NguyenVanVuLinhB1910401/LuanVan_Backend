const PhieuNhapXuatService = require('../services/phieunhapxuat.service');
const ChiTietPhieuNhapXuatService = require('../services/chitietphieunhapxuat.service');
const TonKhoService = require('../services/tonkho.service');
const MongoDB = require('../utils/mongodb.util');
const ApiError = require('../api-error');

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
      const chiTietPhieuNhapXuatService = new ChiTietPhieuNhapXuatService(MongoDB.client);
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
      const chiTietPhieuNhapXuatService = new ChiTietPhieuNhapXuatService(MongoDB.client);
      const result = await chiTietPhieuNhapXuatService.findAll();
      return res.status(200).json({ result });
    } catch (err) {
      console.log(err);
      return next(
        new ApiError(500, 'An errror occurred while finding the ALLDanhSachSanPhamDaNhap')
      );
    }
  };


exports.createPhieuNhap = async (req, res, next) => {
  try {
    const phieuNhap = req.body;
    const phieuNhapService = new PhieuNhapXuatService(MongoDB.client);
    const resultPhieuNhap = await phieuNhapService.createPhieuNhap(phieuNhap);
    const dsSanPham = req.body.dsSanPham.map((pro) => {
      return {
        idPhieuNhapXuat: resultPhieuNhap._id,
        idSP: pro.idSP,
        idCN: pro.idCN,
        idNCC: pro.idNCC,
        soLuong: pro.soLuong,
        gia: pro.gia,
      };
    });
    const chiTietPhieuNhapXuatService = new ChiTietPhieuNhapXuatService(
      MongoDB.client
    );
    const resultChiTiet = await chiTietPhieuNhapXuatService.createMany(
      dsSanPham
    );
    const tonKhoService = new TonKhoService(MongoDB.client);
    for (let i = 0; i < dsSanPham.length; i++) {
      const checkSPTCN = await tonKhoService.findOne({
        idSP: dsSanPham[i].idSP,
        idCN: dsSanPham[i].idCN,
      });
      // console.log(checkSPTCN);
      if (checkSPTCN) {
        const resultTonKho = await tonKhoService.updateSoLuong({
          ...dsSanPham[i],
          soLuong:
            parseInt(checkSPTCN.soLuong) + parseInt(dsSanPham[i].soLuong),
        });
      } else {
        const resultTonKho = await tonKhoService.create(dsSanPham[i]);
      }
    }
    return res.status(201).json({ message: 'Nhập kho thành công' });
  } catch (err) {
    console.log(err);
    return next(
      new ApiError(500, 'An errror occurred while creating the PhieuNhap')
    );
  }
};
exports.getAllSanPhamTrongKho = async (req, res, next) => {
  try {
    const tonKhoService = new TonKhoService(MongoDB.client);
    const result = await tonKhoService.findAll();
    return res.status(200).json({ result });
  } catch (err) {
    console.log(err);
    return next(
      new ApiError(500, 'An errror occurred while finding the AllSanPhamTrongKho')
    );
  }
};