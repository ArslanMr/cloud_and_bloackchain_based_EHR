const mongoose = require("mongoose");
const {Files} = require("./FileUpload")

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
      },
      cnic: {
        type: String,
        required: true,
        unique: true
      },
      gender: {
        type: String,
        required: true
      },
      dateOfBirth: {
        type: Date,
        required: true,
        get: (value) => value.toISOString().split('T')[0] // Format date before retrieving it from the database
      },
      phoneNumber: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      homeAddress: {
        type: String,
        required: true
      },
      emergencyContact: {
        Ename: {
          type: String,
          required: true
        },
        Erelationship: {
          type: String,
          required: true
        },
        EphoneNumber: {
          type: String,
          required: true
        }

      },
      profilePicture: {
        type: String,
        // required: true
      },
      
      medicalHistory: {
        bloodPressure: Boolean,
        familyHistoryBloodPressure: Boolean,
        diabetes: Boolean,
        familyHistoryDiabetes: Boolean,
        hepatitis: Boolean,
        familyHistoryHepatitis: Boolean,
        migrane: Boolean,
        familyHistoryMigrane: Boolean,
        cardiacDisease: Boolean,
        familyHistoryCardiacDisease: Boolean,
        asthma: Boolean,
        familyHistoryAsthma: Boolean,
        tuberculosis: Boolean,
        familyHistoryTuberculosis: Boolean,
        height: String,
        weight: String,
        bloodGroup: String
      },
      usertype:{type:String, default:'patient'},
      
      files: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Files'
      }]
    });

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;