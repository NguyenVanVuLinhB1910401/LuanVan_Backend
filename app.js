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
const { getAllSanPham, getAllSanPhamMoi, getAllSanPhamNoiBat, getOneSanPham, getAllSanPhamFilter } = require("./app/controllers/quanLySanPham.controller");
const nhapXuatKhoRoute = require("./app/routes/nhapxuatkho.route");
const { getAllLoaiSP } = require("./app/controllers/quanLyLoaiSanPham.controller");
const { getAllHangDT } = require("./app/controllers/quanLyHangDienThoai.controller");
const { thanhToanThanhCong } = require("./app/controllers/thanhToan.controller");
const thanhToanRoute = require("./app/routes/thanhtoan.route");
const donHangRoute = require("./app/routes/quanlydonhang.route");
const {chuyenKho } = require("./app/controllers/quanLyNhapXuatKho.controller");
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
app.post("/api/chuyenkho", chuyenKho);
app.use("/api/users", authRoute);
app.get("/api/sanphams", getAllSanPham);
app.get("/api/sanphams/spmoi", getAllSanPhamMoi);
app.get("/api/sanphams/spnoibat", getAllSanPhamNoiBat);
app.post("/api/sanphams/filter", getAllSanPhamFilter);
app.get("/api/sanphams/:id", getOneSanPham);
app.get("/api/loaisanphams", getAllLoaiSP);
app.get("/api/hangdienthoais", getAllHangDT);
app.get("/api/thanhtoans/thanhtoan", thanhToanThanhCong);

app.use("/api/thanhtoans", middleware.verifyToken, thanhToanRoute);

app.use("/api/loaisanphams", middleware.verifyToken, loaiSanPhamRoute);

app.use("/api/hangdienthoais", middleware.verifyToken, hangDienThoaiRoute);

app.use("/api/chinhanhs", middleware.verifyToken, chiNhanhRoute);

app.use("/api/nhacungcaps", middleware.verifyToken, nhaCungCapRoute);

app.use("/api/khachhangs", middleware.verifyToken, khachHangRoute);

app.use("/api/sanphams", middleware.verifyToken, upload.single("picture"), sanPhamRoute);

app.use("/api/nhapxuatkho", middleware.verifyToken, nhapXuatKhoRoute);

app.use("/api/donhangs", middleware.verifyToken, donHangRoute);

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