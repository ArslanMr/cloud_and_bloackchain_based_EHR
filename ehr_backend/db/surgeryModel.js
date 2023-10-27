const mongoose = require("mongoose");

const surgerySchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    surgery: { type:String, required:true },
    doctor: { type:String, required:true },
    hospital: { type:String, required:true }
});


const Surgery = mongoose.model("surgeries", surgerySchema);
module.exports = Surgery;