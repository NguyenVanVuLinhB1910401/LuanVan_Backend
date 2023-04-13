const jwt = require('jsonwebtoken');

exports.verifyToken = async (req, res, next) => {
  try {
    let token = req.header('Authorization');
    if (!token) return res.status(403).json({ message: 'Access Denied.' });

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.lenght).trimLeft();
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    //console.log('Check token');

    next();
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

// For NhanVien
exports.isNhanVien = (req, res, next) => {
  this.verifyToken(req, res, () => {
    if (req.user.loaiNguoiDung === 'Nhân Viên') {
      next();
    } else {
      res.status(403).send('Access denied. Not authorized...');
    }
  });
};

// For Admin
exports.isAdmin = (req, res, next) => {
  this.verifyToken(req, res, () => {
    if (req.user.loaiNguoiDung === 'Admin') {
      //console.log('Check isAdmin');
      next();
    } else {
      res.status(403).send('Access denied. Not authorized...');
    }
  });
};
//For Admin And Nhân Viên
exports.isAdminAndisNhanVien = (req, res, next) => {
  this.verifyToken(req, res, () => {
    if (
      req.user.loaiNguoiDung === 'Admin' ||
      req.user.loaiNguoiDung === 'Nhân Viên'
    ) {
      //console.log('Check isAdmin');
      next();
    } else {
      res.status(403).send('Access denied. Not authorized...');
    }
  });
};
