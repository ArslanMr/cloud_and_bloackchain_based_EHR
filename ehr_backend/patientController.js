// patientController.js
const PatientModel = require('../ehr_backend/db/patientModel');

// Controller function for uploading the patient's profile picture
exports.uploadProfilePicture = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const profilePicturePath = req.file.path;
  const cnic = req.body.cnic; // Assuming you have the patient's CNIC in the request body

  PatientModel.findOneAndUpdate(
    { cnic: cnic },
    { profilePicturePath: profilePicturePath },
    { new: true },
    (err, patient) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to upload profile picture' });
      }

      return res.status(200).json({ message: 'Profile picture uploaded successfully' });
    }
  );
};
