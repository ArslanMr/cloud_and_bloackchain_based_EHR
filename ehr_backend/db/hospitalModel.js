const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  hospitalName: { type: String, required: true },
  regNumber: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  zipCode: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  verificationToken:   { type: String,  },
  isVerified: { type: Boolean, required: true , default:false}, 
});

const Hospital = mongoose.model("Hospital", hospitalSchema);

module.exports = Hospital;