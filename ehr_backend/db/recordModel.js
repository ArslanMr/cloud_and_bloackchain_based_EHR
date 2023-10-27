const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    date:{ type:Date, required:true, default:Date.now },
    doctor:{ type:String, required:true },
    diseases:{ type:String, required:true },
    medicines:{ type:String, required:true },
    extratests: { type: String, required:true }
})


const Record = mongoose.model("records", recordSchema);
module.exports = Record;