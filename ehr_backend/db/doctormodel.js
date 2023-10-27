const mongoose = require('mongoose');



const doctorSchema = new mongoose.Schema({
  DrName: {type: String, required: true},
  DrCNIC: {type: String, required: true,  unique: true },
  DrEmail: { type: String,  required: true },
  PhNmbr: { type: String,  required: true },
  Degree: {  type: String,required: true },
  specialist: { type: String, required: true },
  password: {type: String, required: true},
  usertype:{type:String, default:'doctor'}
});

//module.exports = mongoose.model('Doctor', doctorSchema);
const Doctor= mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;