// patientRoutes.js
const express = require('express');
const router = express.Router();
const patientController = require('./patientController');

// Define the route for uploading the patient's profile picture
router.post('/upload-profile-picture', patientController.uploadProfilePicture);

module.exports = router;
