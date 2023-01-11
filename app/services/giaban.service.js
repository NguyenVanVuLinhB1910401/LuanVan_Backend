const { ObjectId } = require('mongodb');
const moment = require('moment');
class GiaBanService {
  constructor(client) {
    this.GiaBan = client.db().collection('giabans');
  }

  extractGiaBanData(payload) {
    const giaBan = {
      giaBan: payload.giaBan,
      idSanPham: payload.idSanPham,
    };
    //console.log(payload);
    // remove field undefined
    Object.keys(giaBan).forEach(
      (key) => giaBan[key] === undefined && delete giaBan[key]
    );
    return giaBan;
  }
  async find() {
    const giaBan = await this.GiaBan.find({});
    return await giaBan.toArray();
  }

  async findById(id) {
    const giaBan = await this.GiaBan.findOne({_id: ObjectId.isValid(id) ? new ObjectId(id) : null});
    return giaBan;
  }

  async create(payload) {
    const giaBan = this.extractGiaBanData(payload);
    const result = await this.GiaBan.findOneAndUpdate(
      giaBan,
      { $set: { ngayApDung: moment().format('MM/DD/YYYY HH:mm:ss') } },
      { returnDocument: 'after', upsert: true }
    );
    //console.log(result);
    return result.value;
  }

  async update(id, payload) { 
        
    const filter = { 
        _id: ObjectId.isValid(id) ? new ObjectId(id) : null, 
    };
    
    const update = this.extractGiaBanData(payload); 
    // console.log(id);
    // console.log("------");
    // console.log(update);
    const result = await this.GiaBan.findOneAndUpdate( 
        filter, 
        { $set: update }, 
        { returnDocument: "after" } );
    return result.value;
  }

}

module.exports = GiaBanService;
