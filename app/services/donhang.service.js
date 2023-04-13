const { ObjectId, startSession } = require('mongodb');

class DonHangService {
  constructor(client) {
    this.DonHang = client.db().collection('donhangs');
    this.client = client;
  }

  extractDonHangData(payload) {
    const donHang = {
      hoTen: payload.hoTen,
      sdt: payload.sdt,
      email: payload.email,
      diaChi: payload.diaChi,
      ghiChu: payload.ghiChu,
      total: payload.total,
      httt: payload.httt,
      htnh: payload.htnh,
      idKH: payload.idKH,
      idCNNH: payload.idCNNH,
      idCNDH: payload.idCNDH,
      status: payload.status,
      ngayDat: payload.ngayDat,
    };
    // remove field undefined
    Object.keys(donHang).forEach(
      (key) => donHang[key] === undefined && delete donHang[key]
    );
    return donHang;
  }
  async findById(id) {
    const donHang = await this.DonHang.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return donHang;
  }
  async findOne(id, htnh) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    if (htnh !== "GHTN") {
      const donHang = await this.DonHang.aggregate([
        {
          $match: filter,
        },
        {
          // Lay cac truong can thiet 1 -> lay; 0 -> an
          $project: {
            // idKH: {
            //   $toObjectId: '$idKH',
            // },
            idCNNH: {
              $toObjectId: '$idCNNH',
            },
            idCNDH: {
              $toObjectId: '$idCNDH',
            },
            hoTen: 1,
            sdt: 1,
            email: 1,
            total: 1,
            httt: 1,
            htnh: 1,
            status: 1,
            ngayDat: 1,
            diaChi: 1,
            ghiChu: 1,
          },
        },
        {
          $lookup: {
            from: 'chinhanhs',
            localField: 'idCNNH',
            foreignField: '_id',
            as: 'idCNNH',
          },
        },
        {
          $lookup: {
            from: 'chinhanhs',
            localField: 'idCNDH',
            foreignField: '_id',
            as: 'idCNDH',
          },
        },
        // {
        //   $lookup: {
        //     from: 'users',
        //     localField: 'idKH',
        //     foreignField: '_id',
        //     as: 'idKH',
        //   },
        // },
        // { $unwind: '$idKH' },
        { $unwind: '$idCNNH' },
        { $unwind: '$idCNDH' },
      ]);
      //console.log(await donHang.toArray());
      const result = await donHang.toArray();
      return result[0];
    } else {
      const donHang = await this.DonHang.aggregate([
        {
          $match: filter,
        },
        {
          // Lay cac truong can thiet 1 -> lay; 0 -> an
          $project: {
            idKH: {
              $toObjectId: '$idKH',
            },
            idCNDH: {
              $toObjectId: '$idCNDH',
            },
            hoTen: 1,
            sdt: 1,
            email: 1,
            total: 1,
            httt: 1,
            htnh: 1,
            status: 1,
            ngayDat: 1,
            diaChi: 1,
            ghiChu: 1,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'idKH',
            foreignField: '_id',
            as: 'idKH',
          },
        },
        {
          $lookup: {
            from: 'chinhanhs',
            localField: 'idCNDH',
            foreignField: '_id',
            as: 'idCNDH',
          },
        },
        { $unwind: '$idKH' },
        { $unwind: '$idCNDH' },
      ]);
      //console.log(await donHang.toArray());
      const result = await donHang.toArray();
      return result[0];
    }
  }

  async find() {
    //const donHang = await this.DonHang.find({});
    const donHang = await this.DonHang.aggregate([
      { $sort: { ngayDat: -1 } },
      {
        // Lay cac truong can thiet 1 -> lay; 0 -> an
        $project: {
          idCNDH: {
            $toObjectId: '$idCNDH',
          },
          hoTen: 1,
          sdt: 1,
          email: 1,
          total: 1,
          httt: 1,
          htnh: 1,
          status: 1,
          ngayDat: {
            $dateFromString: {
              dateString: '$ngayDat',
            }
          },
        },
      },
      {
        $lookup: {
          from: 'chinhanhs',
          localField: 'idCNDH',
          foreignField: '_id',
          as: 'idCNDH',
        }
      },
      {$unwind: '$idCNDH'}
    ]);
    //console.log(await donHang.toArray());
    return await donHang.toArray();
  }

  async createDH(payload) {
    const session = this.client.startSession();
    //console.log(payload);
    try {
      session.startTransaction();
      //create don hang
      const donHangCollection = this.client.db().collection('donhangs');
      const resultDH = await donHangCollection.insertOne(payload.donHang, {
        session,
      });
      //console.log(resultDH);
      const chiTietDH = payload.cart.map((pro) => {
        return {
          idDH: resultDH.insertedId.toString(),
          idSP: pro.id,
          soLuong: parseInt(pro.soLuong),
          gia: parseInt(pro.gia),
        };
      });
      //create chi tiet don hang
      const chiTietDonHangCollection = this.client
        .db()
        .collection('chitietdonhangs');
      const resultCTDH = await chiTietDonHangCollection.insertMany(chiTietDH, {
        session,
      });
      //console.log(resultCTDH);
      // if(resultCTDH) throw new Error("Khong du so luong");
      //Update so luong ton kho
      const tonKhoCollection = this.client
        .db()
        .collection('tonkhhos');
      for (let i = 0; i < payload.cart.length; i++) {
        const result = await tonKhoCollection.findOneAndUpdate(
          { idSP: payload.cart[i].id, idCN: payload.cart[i].idCN },
          { $inc: { daBan: +payload.cart[i].soLuong } },
          { session, returnDocument: 'after' }
        );
        if (result.value?.daBan > result.value?.soLuong || result.value === null) {
          throw new Error(`${payload.cart[i].tenSanPham} đã hết hàng`);
        }
      }
      await session.commitTransaction();
      await session.endSession();
      //console.log('Transaction successfully committed.');
      return { msg: "Đặt hàng thành công", code: 1, idDH: resultDH.insertedId.toString() };
    } catch (error) {
      //console.log(error);
      await session.abortTransaction();
      await session.endSession();
      return { msg: error.message, code: 0 };
    }
  }



  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };

    const update = this.extractDonHangData(payload);
    //console.log(update);
    const result = await this.DonHang.findOneAndUpdate(
      filter,
      {
        $set: {
          status: payload.status,
        },
      },
      { returnDocument: 'after' }
    );
    return result.value;
  }

  async delete(payload) {
    const filter = {
      _id: ObjectId.isValid(payload.id) ? new ObjectId(payload.id) : null,
    };
    const session = this.client.startSession();
    //console.log(payload);
    try {
      session.startTransaction();
      //delete don hang
      const donHangCollection = this.client.db().collection('donhangs');
      const resultDH = await donHangCollection.deleteOne(filter, {
        session,
      });
      //console.log(resultDH);
      //create chi tiet don hang
      const chiTietDonHangCollection = this.client
        .db()
        .collection('chitietdonhangs');
      const resultCTDH = await chiTietDonHangCollection.deleteMany({ idDH: payload.id }, {
        session,
      });
      //console.log(resultCTDH);
      //Cap nhat lai so luong san pham trong kho
      const tonKhoCollection = this.client.db().collection('tonkhhos');
      for (let i = 0; i < payload.cart.length; i++) {
        const result = await tonKhoCollection.findOneAndUpdate(
          { idSP: payload.cart[i].id, idCN: payload.idCNDH },
          { $inc: { daBan: -payload.cart[i].soLuong } },
          { session, returnDocument: 'after' }
        );
      }
      await session.commitTransaction();
      await session.endSession();
      //console.log('Transaction successfully committed.');
      return { msg: "Xoa don hang thanh cong", code: 1, };
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      await session.endSession();
      return { msg: error.message, code: 0 };
    }
  }

  async huyDH(payload) {
    console.log("Data", payload);
    const filter = {
      _id: ObjectId.isValid(payload.id) ? new ObjectId(payload.id) : null,
    };
    const session = this.client.startSession();
    //console.log(payload);
    try {
      session.startTransaction();
      if(!payload.idCN) throw new Error("Không tìm thấy chi nhánh");
      //update trang thai don hang da huy
      const donHangCollection = this.client.db().collection('donhangs');
      const result = await donHangCollection.findOneAndUpdate(
        filter,
        {
          $set: {
            status: "Đã hủy",
          },
        },
        { returnDocument: 'after' }
      );
      //Cap nhat lai so luong san pham trong kho
      const tonKhoCollection = this.client.db().collection('tonkhhos');
      for (let i = 0; i < payload.cart.length; i++) {
        const result = await tonKhoCollection.findOneAndUpdate(
          { idSP: payload.cart[i].id, idCN: payload.idCN },
          { $inc: { daBan: -payload.cart[i].soLuong } },
          { session, returnDocument: 'after' }
        );
      }
      await session.commitTransaction();
      await session.endSession();
      //console.log('Transaction successfully committed.');
      return { msg: "Đơn hàng đã hủy thành công", code: 1, };
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      await session.endSession();
      return { msg: error.message, code: 0 };
    }
  }

  async deleteDHDaHuy(id) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const session = this.client.startSession();
    //console.log(payload);
    try {
      session.startTransaction();
      //create don hang
      const donHangCollection = this.client.db().collection('donhangs');
      const resultDH = await donHangCollection.deleteOne(filter, {
        session,
      });
      //console.log(resultDH);
      //create chi tiet don hang
      const chiTietDonHangCollection = this.client
        .db()
        .collection('chitietdonhangs');
      const resultCTDH = await chiTietDonHangCollection.deleteMany({ idDH: id }, {
        session,
      });
      await session.commitTransaction();
      await session.endSession();
      //console.log('Transaction successfully committed.');
      return { msg: "Xoa don hang thanh cong", code: 1, };
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      await session.endSession();
      return { msg: error.message, code: 0 };
    }
  }

  async thongKe() {
    const donHang = await this.DonHang.aggregate([
      {
        $match: {
          status: "Đã hoàn thành",
          //year: { $eq: year }
        }
      },
      // {
      //   $project: {
      //     year: 1
      //   }
      // },
      {
        $group: {
          _id: {
            year: {
              $year: {
                date: {
                  $dateFromString: {
                    dateString: '$ngayDat',
                  }
                }
              }
            },
            month: {
              $month: {
                date: {
                  $dateFromString: {
                    dateString: '$ngayDat',
                  }
                }
              }
            }
          },
          total_cost_month: { $sum: "$total" },
          total_order_month: { $sum: 1 }
        }
      }
    ]);
    const result = await donHang.toArray();
    return result.map((i) => {
      return {
        id: i._id.month,
        year: i._id.year,
        total: i.total_cost_month / 1000000,
        number: i.total_order_month
      }
    });
  }
}

module.exports = DonHangService;
