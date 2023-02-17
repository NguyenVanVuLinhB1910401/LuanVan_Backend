const TonKhoService = require('../services/tonkho.service');
const DonHangService = require('../services/donhang.service');
const ChiTietDonHangService = require('../services/chitietdonhang.service');
const MongoDB = require('../utils/mongodb.util');
const ApiError = require('../api-error');
var $ = require('jquery');
const { setTimeout } = require('timers/promises');
exports.thanhToan = async (req, res, next) => {
  let cart = req.body.cart;
  const donHang = {
    hoTen: req.body.hoTen,
    sdt: req.body.sdt,
    email: req.body.email,
    diaChi: req.body.diaChi,
    ghiChu: req.body.ghiChu,
    total: req.body.total,
    httt: req.body.httt,
    idKH: req.body.idKH,
    idCN: req.body.idCN,
    status: 'Chưa xử lý',
    ngayDat: req.body.ngayDat,
  };
  const tonKhoService = new TonKhoService(MongoDB.client);
  const donHangService = new DonHangService(MongoDB.client);
  const chiTietDonHangService = new ChiTietDonHangService(MongoDB.client);
  try {
    if (req.body.httt === 'Khi nhận hàng') {
      //Kiem tra so luong san pham trong kho
      let promises = [];
      for (let i = 0; i < cart.length; i++) {
        promises.push(
          tonKhoService.findOne({
            idSP: cart[i].id,
            idCN: req.body.idCN,
          })
        );
      }
      let checkSoLuong = -1;
      await Promise.all(promises).then((promise) => {
        for (let i = 0; i < promise.length; i++) {
          if (
            promise[i] == null ||
            cart[i].soLuong + promise[i]?.daBan > promise[i]?.soLuong
          ) {
            //console.log(promise[i]);
            checkSoLuong = i;
          } else cart[i].daBan = cart[i].soLuong + promise[i]?.daBan;
        }
      });
      //console.log(checkSoLuong);
      if (checkSoLuong !== -1)
        return res.status(200).json({
          message: `${cart[checkSoLuong].tenSanPham} không đủ số lượng để giao!!!`,
        });
      else {
        promises = [];
        for (let i = 0; i < cart.length; i++) {
          promises.push(
            tonKhoService.updateDaBan({
              idSP: cart[i].id,
              idCN: req.body.idCN,
              daBan: cart[i].daBan,
            })
          );
        }
        await Promise.all(promises).then(async (result) => {
          //Create don hang
          const resultDH = await donHangService.create(donHang);
          const chiTietDH = req.body.cart.map((pro) => {
            return {
              idDH: resultDH,
              idSP: pro.id,
              soLuong: pro.soLuong,
              gia: pro.gia,
            };
          });
          const resultCTDH = await chiTietDonHangService.create(chiTietDH);
        });
        return res.status(201).json({ message: 'Đặt hàng thành công!!!' });
      }
    } else {
      //console.log('VNPAY');
      donHang.status = 'Chưa thanh toán';
      const resultDH = await donHangService.create(donHang);
      const chiTietDH = req.body.cart.map((pro) => {
        return {
          idDH: resultDH,
          idSP: pro.id,
          soLuong: pro.soLuong,
          gia: pro.gia,
        };
      });
      const resultCTDH = await chiTietDonHangService.create(chiTietDH);

      // setTimeout(async () => {
      //   const resultFind = await donHangService.findById(resultDH);
      //   if(resultFind.status === "Chưa thanh toán") {
      //     console.log("Xoa don hang"+resultFind);
      //     const resultDelete = await donHangService.delete(req.query.vnp_TxnRef);
      //     const resultCTDHDelete = await chiTietDonHangService.deleteMany(req.query.vnp_TxnRef);
      //   }
      // }, 1000*60*16);
      var ipAddr =
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

      // var config = require('config');
      var dateFormat = require('dateformat');

      var tmnCode = 'LOKRO1JC';
      var secretKey = 'ISWQPWWJKRXEQAWPKVEZTZYDPMQQPCCR';
      var vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
      var returnUrl = 'http://localhost:3000/api/thanhtoans/thanhtoan';
      var date = new Date();
      //console.log(date);
      var createDate = dateFormat(date, 'yyyymmddHHmmss');
      var orderId = resultDH;
      var amount = req.body.total;
      var bankCode = 'NCB';

      var orderInfo = 'Thanh toan hoa don';
      var orderType = 'billpayment';
      var locale = 'vn';
      if (locale === null || locale === '') {
        locale = 'vn';
      }
      var currCode = 'VND';
      var vnp_Params = {};
      vnp_Params['vnp_Version'] = '2.1.0';
      vnp_Params['vnp_Command'] = 'pay';
      vnp_Params['vnp_TmnCode'] = tmnCode;
      //vnp_Params['vnp_Merchant'] = ''
      vnp_Params['vnp_Locale'] = locale;
      vnp_Params['vnp_CurrCode'] = currCode;
      vnp_Params['vnp_TxnRef'] = orderId;
      vnp_Params['vnp_OrderInfo'] = orderInfo;
      vnp_Params['vnp_OrderType'] = orderType;
      vnp_Params['vnp_Amount'] = amount * 100;
      vnp_Params['vnp_ReturnUrl'] = returnUrl;
      vnp_Params['vnp_IpAddr'] = ipAddr;
      vnp_Params['vnp_CreateDate'] = createDate;
      if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
      }

      vnp_Params = sortObject(vnp_Params);

      var querystring = require('qs');
      var signData = querystring.stringify(vnp_Params, { encode: false });

      var crypto = require('crypto');
      var hmac = crypto.createHmac('sha512', secretKey);
      var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
      vnp_Params['vnp_SecureHash'] = signed;
      vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
      //console.log(vnpUrl);
      //res.redirect(vnpUrl);
      return res.status(200).json({ url: vnpUrl });
      //return res.redirect(vnpUrl)
    }
  } catch (err) {
    console.log(err);
    return next(
      new ApiError(500, 'An errror occurred while creating the ThanhToan')
    );
  }
};

exports.thanhToanThanhCong = async (req, res, next) => {
  // console.log(req.query.vnp_TxnRef);
  // console.log(req.query.vnp_ResponseCode);
  // console.log(req.query.vnp_TransactionStatus);
  try {
    if(req.query.vnp_ResponseCode == "00" && req.query.vnp_TransactionStatus == "00" && req.query.vnp_TxnRef){
      const donHangService = new DonHangService(MongoDB.client);
      const result = await donHangService.update(req.query.vnp_TxnRef, {status: "Đã thanh toán"});
      return res.send("<h1>Thanh toán thành công. Cảm ơn quý khách đã sử dụng dịch vụ!!!! <a href='http://localhost:3002/lichsudonhang?status=thanhcong'>Xem đơn hàng vừa đặt</a></h1>");
    }
    if((req.query.vnp_ResponseCode == "11" || req.query.vnp_ResponseCode == "24") && req.query.vnp_TxnRef){
      const donHangService = new DonHangService(MongoDB.client);
      const chiTietDonHangService = new ChiTietDonHangService(MongoDB.client);
      const result = await donHangService.delete(req.query.vnp_TxnRef);
      const resultCTDH = await chiTietDonHangService.deleteMany(req.query.vnp_TxnRef);
      return res.send("<a href='http://localhost:3002/thanhtoan'><h1>Vui lòng thực hiện lại giao dịch</h1></a>");

    } 
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, "An errror occurred while finding the ThanhToanThanhCong"));
  }
};

function sortObject(obj) {
  var sorted = {};
  var str = [];
  var key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}

