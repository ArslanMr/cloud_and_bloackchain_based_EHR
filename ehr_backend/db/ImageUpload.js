const mongoose = require('mongoose');


const imageSchema = new mongoose.Schema({
    originalName: String,
    filename: String,
    path: String,
    cnic: String
  });
  

const ImageUpload = mongoose.model("Images", imageSchema);
module.exports = ImageUpload;