const { ObjectId } = require('mongodb');

class DonHangService {
  constructor(client) {
    this.DonHang = client.db().collection('donhangs');
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
      idKH: payload.idKH,
      idCN: payload.idCN,
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
    const donHang = await this.DonHang.findOne({_id: ObjectId.isValid(id) ? new ObjectId(id) : null});
    return donHang;
  }
  async findOne(id) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const donHang = await this.DonHang.aggregate([
      {
        $match: filter
      },
      {
        // Lay cac truong can thiet 1 -> lay; 0 -> an
        $project: {
          idKH: {
            $toObjectId: '$idKH',
          },
          idCN: {
            $toObjectId: '$idCN',
          },
          hoTen: 1,
          sdt: 1,
          email: 1,
          total: 1,
          httt: 1,
          status: 1,
          ngayDat: 1,
          diaChi: 1,
          ghiChu: 1
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
          localField: 'idCN',
          foreignField: '_id',
          as: 'idCN',
        },
      },
      {$unwind: '$idKH'},
      {$unwind: '$idCN'},
    ]);
    //console.log(await donHang.toArray());
    const result = await donHang.toArray();
    return result[0];
  }

  async find() {
    //const donHang = await this.DonHang.find({});
    const donHang = await this.DonHang.aggregate([
      {
        // Lay cac truong can thiet 1 -> lay; 0 -> an
        $project: {
          idKH: {
            $toObjectId: '$idKH',
          },
          idCN: {
            $toObjectId: '$idCN',
          },
          hoTen: 1,
          sdt: 1,
          email: 1,
          total: 1,
          httt: 1,
          status: 1,
          ngayDat: 1
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
          localField: 'idCN',
          foreignField: '_id',
          as: 'idCN',
        },
      },
      {$unwind: '$idKH'},
      {$unwind: '$idCN'},
    ]);
    //console.log(await donHang.toArray());
    return await donHang.toArray();
  }

  // async findByTen(ten) {
  //     const chiNhanh = this.ChiNhanh.findOne({tenChiNhanh: ten});
  //     return chiNhanh;

  // }

  async create(payload) {
    const donHang = this.extractDonHangData(payload);
    const result = await this.DonHang.insertOne(donHang);
    return result.insertedId.toString();
  }

  async update(id, payload) { 
        
    const filter = { 
        _id: ObjectId.isValid(id) ? new ObjectId(id) : null, 
    };
    
    const update = this.extractDonHangData(payload); 
    //console.log(update);
    const result = await this.DonHang.findOneAndUpdate( 
        filter, 
        { $set: {
          status: payload.status
        } }, 
        { returnDocument: "after" } );
    return result.value; 
  }

  async delete(id) {
      const result = await this.DonHang.findOneAndDelete(
          { _id: ObjectId.isValid(id) ? new ObjectId(id) : null }
      );
      return result.value;
  }
}

module.exports = DonHangService;
