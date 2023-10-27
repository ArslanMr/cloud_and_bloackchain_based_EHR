const mongoose = require('mongoose');

const filesSchema = new mongoose.Schema({
  cid: {
    type: String,
    required: true
  },
  originalname: {
    type: String,

  },
  mimetype: {

    type: String,
  },
  last_modified: {
    type: String,
  },
});

const Files = mongoose.model('Files', filesSchema);


module.exports = {
  Files,
};