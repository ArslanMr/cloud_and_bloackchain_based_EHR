const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    file:{type:String, required:true},
    originalname:{type:String, required:true},
    createdAt: { type: Date, default: Date.now}
})


const Report = mongoose.model("report", reportSchema);
module.exports = Report;