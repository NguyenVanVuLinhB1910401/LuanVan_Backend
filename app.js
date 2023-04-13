const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const {fileURLToPath} =  require("url");
const ApiError = require("./app/api-error");
const { diskStorage } = require("multer");
const middleware = require("./app/middleware/auth");

const authRoute = require("./app/routes/auth.route");

const loaiSanPhamRoute = require("./app/routes/quanlyloaisanpham.route");
const hangDienThoaiRoute = require("./app/routes/quanlyhangdienthoai.route");
const chiNhanhRoute = require("./app/routes/quanlychinhanh.route");
const nhaCungCapRoute = require("./app/routes/quanlynhacungcap.route");
const sanPhamRoute = require("./app/routes/quanlysanpham.route");
const khachHangRoute = require("./app/routes/quanlykhachhang.route");
const { getAllSanPhamChoKhachHang, getOneSanPhamChoKhachHang, getAllSanPhamMoi, getAllSanPhamNoiBat, getOneSanPham, getAllSanPhamFilter, getSanPhamTheoCN } = require("./app/controllers/quanLySanPham.controller");
const nhapXuatKhoRoute = require("./app/routes/nhapxuatkho.route");
const { getAllLoaiSP } = require("./app/controllers/quanLyLoaiSanPham.controller");
const { getAllHangDT } = require("./app/controllers/quanLyHangDienThoai.controller");
const { thanhToanThanhCong } = require("./app/controllers/thanhToan.controller");
const thanhToanRoute = require("./app/routes/thanhtoan.route");
const donHangRoute = require("./app/routes/quanlydonhang.route");
const {chuyenKho } = require("./app/controllers/quanLyNhapXuatKho.controller");
const nhanVienRoute = require("./app/routes/quanlynhanvien.route");
const { getAllChiNhanh } = require("./app/controllers/quanLyChiNhanh.controller");
const binhLuanRoute = require("./app/routes/binhluan.route");
const danhGiaRoute = require("./app/routes/danhgia.route");
const {getAllDanhGia} = require("./app/controllers/danhGia.controller");
const {getAllDonHang, getOneDonHang, ThongKe, huyDonHang} = require("./app/controllers/quanLyDonHang.controller");
dotenv.config();
const app = express();

app.use(express.json());
//Loc cac header doc hai; cho truy cap anh tu client
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
//Logging cac request ra console
app.use(morgan("common"));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// parse application/json  
app.use(bodyParser.json({extended: true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
//console.log(path.join(__dirname, "public/assets"));
//FILE STORAGE
const storage = multer.diskStorage(
    {
        destination: function(req, file, cb) {
            cb(null, "public/assets");
        },
        filename: function(req, file, cb) {
            cb(null, file.originalname);
        },
    }
);

const upload = multer({storage});
app.get("/api/thongke/:year", ThongKe);
app.use("/api/users", authRoute);
app.get("/api/sanphamskhtheocn/:idCN", getAllSanPhamChoKhachHang);
app.get("/api/sanphamskh/:id", getOneSanPhamChoKhachHang);
app.get("/api/sanphams/spmoi/:idCN", getAllSanPhamMoi);
app.get("/api/sanphams/spnoibat/:idCN", getAllSanPhamNoiBat);
app.post("/api/sanphams/filter", getAllSanPhamFilter);
app.get("/api/sanphams/:id", getOneSanPham);
app.get("/api/sanphamstheochinhanh/:idCN", getSanPhamTheoCN);
app.get("/api/loaisanphams", getAllLoaiSP);
app.get("/api/hangdienthoais", getAllHangDT);
app.get("/api/thanhtoans/thanhtoan", thanhToanThanhCong);
app.get("/api/danhgias/:id", getAllDanhGia);
app.get("/api/chinhanhs/", getAllChiNhanh);
app.use("/api/thanhtoans", middleware.verifyToken, thanhToanRoute);
app.use("/api/binhluans", middleware.verifyToken, binhLuanRoute);
app.use("/api/danhgias", middleware.verifyToken, danhGiaRoute);
app.get("/api/donhangs", middleware.verifyToken, getAllDonHang);
app.get("/api/donhangs/:id", middleware.verifyToken, getOneDonHang);
app.use("/api/loaisanphams", middleware.isAdminAndisNhanVien, loaiSanPhamRoute);
app.put("/api/donhangs/khhuy/:id", middleware.verifyToken, huyDonHang);
app.use("/api/hangdienthoais", middleware.isAdminAndisNhanVien, hangDienThoaiRoute);

app.use("/api/chinhanhs", middleware.isAdminAndisNhanVien, chiNhanhRoute);

app.use("/api/nhacungcaps", middleware.isAdminAndisNhanVien, nhaCungCapRoute);

app.use("/api/khachhangs", middleware.isAdminAndisNhanVien, khachHangRoute);

app.use("/api/sanphams", middleware.isAdminAndisNhanVien, upload.single("picture"), sanPhamRoute);

app.use("/api/nhapxuatkho", middleware.isAdminAndisNhanVien, nhapXuatKhoRoute);

app.use("/api/donhangs", middleware.isAdminAndisNhanVien, donHangRoute);

app.post("/api/chuyenkho", middleware.isAdminAndisNhanVien, chuyenKho);

app.use("/api/nhanviens", middleware.isAdmin, nhanVienRoute);

//Thuc thi khi khong co url nao map
app.use((req, res, next) => {
    // Goi next de chuyen den xu ly loi tap trung
    return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error"
    });
});
module.exports = app;