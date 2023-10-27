const express = require("express");
const cors = require('cors');
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const multer = require('multer');
require("dotenv").config();
var app = express();
app.use(cors());
// app.use(bodyParser.json());
app.use(express.json({ limit: '50mb'}));
app.use(express.urlencoded({ extended: false }))


const Web3 = require('web3');

//Contracts
//Report Contract
const RepContract = require('./build/contracts/Report.json');
//Surgeries Contract
const SurContract = require('./build/contracts/Surgeries.json');
//Record Contract
const RecContract = require('./build/contracts/Record.json'); 


// Connect to the blockchain using Ganache provider
const web3 = new Web3("http://127.0.0.1:7545");

//ABI And Contract address
// Get the Report contract ABI and address
const repcontractABI = RepContract.abi;
const repcontractAddress = '0xc5579D73a55208d819e2904B68EE6064cf4238AC';
// Get the Report contract ABI and address
const surcontractABI = SurContract.abi;
const surcontractAddress = '0xF4b33D3CE47304460DaBcA94078E11460E3a73Cd';
// Get the Report contract ABI and address
const reccontractABI = RecContract.abi;
const reccontractAddress = '0x916A4aCe44eABff1642854f7592016C87fd0a032';


// Create an instance of the contract
//Report Intance
const repcontract = new web3.eth.Contract(repcontractABI, repcontractAddress);
//Surgery Intance
const surcontract = new web3.eth.Contract(surcontractABI, surcontractAddress);
//Record Intance
const reccontract = new web3.eth.Contract(reccontractABI, reccontractAddress);





// import database connection
const dbConnect = require("./db/dbConnect");
// import middleware
const authMiddleware = require("./middleware/auth");
// import db models
const Patient = require("./db/patientSchema");
const Hospital = require("./db/hospitalModel");
const Doctor = require("./db/doctormodel");
const Report = require("./db/reportModel");
const Surgery = require("./db/surgeryModel");
const Record = require("./db/recordModel");
const {Files} = require("./db/FileUpload");

const ImageSchema = require("./db/ImageUpload");
//const Doctor = require("./db/doctormodel");

// serve all static files and static data
app.use(express.static('public'));

const IMupload = multer({ dest: 'uploads/' });

// execute database connection
dbConnect();

//Patient Signup
app.post("/patient_signup", bodyParser.json(), async (req, res) => {
  console.log("Req body: ", req.body);
  const {
    name,
    cnic,
    gender,
    dateOfBirth,
    phoneNumber,
    email,
    password,
    homeAddress,
    emergencyContact,
    medicalHistory
  } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const patient = await Patient.findOne({ cnic });
  if (patient) {
    return res.status(401).send("Record already exist");
  }
  const newPatient = new Patient({
      name,
      cnic,
      gender,
      dateOfBirth,
      phoneNumber,
      email,
      password:hashedPassword,
      homeAddress,
      emergencyContact,
      medicalHistory
    });
  await newPatient.save();
  res.send("User created successfully");
});

//Patient Login
app.post("/patient_login", bodyParser.json(), async (req, res) => {
  const { cnic, password } = req.body;
  const patient = await Patient.findOne({ cnic });
  if (!patient) {
    return res.status(401).send("Invalid Credentials");
  }
  // console.log("Record exist: ", patient);
  const passwordMatch = await bcrypt.compare(password, patient.password);
  if (!passwordMatch) {
    return res.status(401).send("Invalid CNIC or Password");
  }
  const token = jwt.sign({ cnic: patient.cnic }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });
  res.send({ token });
});

app.post('/:cnic/upload-image', bodyParser.json(), async (req, res) => {
  try {
    const {cnic} = req.params
    const { base64Image } = req.body;
      const patient = await Patient.findOne({ cnic });
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      patient.profilePicture = base64Image;
      await patient.save();
      res.status(200).json({ message: 'Image uploaded successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
})

app.post('/upload-file', async (req, res) => {
  try {
    // cnic: userProfile?.cnic,
    //     cid,
    //     originalname: selectedFile.name,
    //     mimetype: selectedFile.type,
    //     last_modified: [file.lastModifiedDate.toLocaleString()]
    const { cnic, cid, originalname, mimetype,last_modified  } = req.body;

    console.log({ cnic, cid });

    const patient = await Patient.findOne({ cnic });
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      const newFile = new Files({
        cid,
        originalname, 
        mimetype,
        last_modified
      });

      const savedFile = await newFile.save();
      console.log(savedFile);
      patient.files.push(savedFile._id);
      await patient.save();
      res.status(200).json({ message: 'File uploaded successfully' });
  }


  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});


app.get('/:cnic/files', async (req, res) => {
  try {
    const cnic = req.params.cnic; 
    const patient = await Patient.findOne({cnic}).populate('files');
    console.log({patientCIDS: patient.files});
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json(patient.files);
  } catch (error) {
    console.error('Error retrieving files:', error);
    res.status(500).json({ message: 'Failed to retrieve files' });
  }
});


//Authentication
app.get("/protected", authMiddleware, (req, res) => {
  res.send(`Protected data for ${req.user.email}`);
});


//Hospital Signup
app.post("/hospital_signup", bodyParser.json(), async (req, res) => {
  
  try {
    console.log("Req body: ", req.body);
    const {
      hospitalName,
      regNumber,
      category,
      email,
      city,
      state,
      phoneNumber,
      zipCode,
      password,
      address,
    } = req.body;

    const response = await Hospital.find({ $or: [{ regNumber }, { email }] });
    if (response.length > 0) {
      res.status(401).send("Record already exists");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = crypto.randomBytes(20).toString("hex"); // Generate a random token

      const hospital = new Hospital({
        hospitalName,
        regNumber,
        category,
        email,
        city,
        state,
        phoneNumber,
        zipCode,
        password: hashedPassword,
        address,
        verificationToken, // Save the token in the hospital document
        isVerified: false, // Set initial verification status to false
      });

      await hospital.save();

      // Send the verification email to the admin email address (abc@ehr.com)
      const adminEmail = "abc@example.com";
      const verificationLink = `http://localhost:5000/verify_hospital/${verificationToken}`;

      // Create a nodemailer transporter
      const transporter = nodemailer.createTransport({
        // Configure your email provider here
        // For example, for Gmail:
        service: "Gmail",
        auth: {
          user: "abc@example.com",
          pass: "pass",
        },
      });

      // Define the email options
      const mailOptions = {
        // from: "your-email@gmail.com",
        // to: adminEmail,
        from:"abc@example.com",
        to:"admin@example.com", 
        subject: "Hospital Email Verification",
        html: `<p>Please click the following link to verify the hospital:</p><p><a href="${verificationLink}">${verificationLink}</a></p>
        hospital name is <b>${hospitalName}</b><br/> registration Number is <b> ${regNumber}</b><br/>
        Hospital Contact Number is <b>${phoneNumber}</b></br/>
        Hospital Address is <b>${address}</b><br/>
        Hospital Email Address is <b> ${email}</b><br/>
        Hospital City is <b>${city}</b><br/>
        Hospital State is <b> ${state}</b><br/>
        Hospital Category is <b>${category}</b><br/>`,
      };

      // Send the verification email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
          res.status(500).send("Failed to send verification email");
        } else {
          console.log("Email sent:", info.response);
          res.send("Hospital registration successful. Please wait for admin verification.");
        }
      });
    }
  } catch (err) {
    console.log("Error: ", err);
    res.status(400).send("Unable to process the request");
  }
});

app.get("/verify_hospital/:token", async (req, res) => {
  try {
    const { token } = req.params;
    console.log({token});
    const hospital = await Hospital.findOne({ verificationToken: token });
    console.log({hospital});

    if (!hospital) {
      return res.status(404).send("Invalid verification token");
    }


    // Verify if the token belongs to the admin
    // const adminEmail = "abc@ehr.com";

    console.log({hi:'there'});
    const adminEmail = "your-email@gmail.com";
    // if (hospital.email === adminEmail) {
      hospital.isVerified = true; // Update the verification status
      hospital.verificationToken = undefined; // Clear the verification token
      await hospital.save();

      res.send("Hospital verified successfully. You can now log in.");
    // } else {
      // 
      // res.status(401).send("Unauthorized verification token");
    // }
  } catch (err) {
    console.log("Error: ", err);
    res.status(500).send("An error occurred during hospital verification");
  }
});
   
//Hospital List
app.get('/hospitallist', async (req, res) => {
  try {
    const alldata=await Hospital.find({});
    res.send({status:"ok",data:alldata})
    
  } catch (error) {
    console.log(error)
  }
});

app.post("/hospital_login", bodyParser.json(), async (req, res) => {
  const { regNumber, password } = req.body;
  const hospital = await Hospital.findOne({ regNumber });

  console.log({hospital})
  if (!hospital) {
    return res.status(401).send("Invalid Credentials");
  }
  const passwordMatch = await bcrypt.compare(password, hospital.password);
  if (!passwordMatch) {
    return res.status(401).send("Invalid Registeration number or Password");
  }

  if(!hospital.isVerified){
    return res.status(401).send("Hospital is not verified yet");
  }
  const token = jwt.sign({ regNumber }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });
  res.send({ token });
});

//Patient Profile Data
app.get('/patient_profile/:cnic', authMiddleware,  async (req, res) => {
  try {
    const { cnic } = req.params;
    const patientRecord = await Patient.findOne({ cnic });
    if (!patientRecord) {
      return res.status(404).send('Patient not found');
    }
    res.send(patientRecord);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.get('/hospital_profile', authMiddleware,  async (req, res) => {
  try {
    const { regNumber } = req.user;
    const hospitalRecord = await Hospital.findOne({ regNumber });
    if (!hospitalRecord) {
      return res.status(404).send('Hospital not found');
    }
    res.send(hospitalRecord);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//Doctor List in hospitals
app.get('/getAlldrdata', async (req, res) => {
  try {
    const alldata=await Doctor.find({});
    res.send({status:"ok",data:alldata})
    
  } catch (error) {
    console.log(error)
  }
});

//Dr Registeration Data
// POST endpoint to save Doctor details
app.post("/doctor_registeration", bodyParser.json(), async (req, res) => {
  
    // Create a new Doctor object from the request body
    
    try {
      console.log("Req body: ", req.body);
      const {
        DrName,
        DrCNIC,
        DrEmail,
        PhNmbr,
        Degree,
        specialist,
        password
      } = req.body;
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newDoctor = new Doctor({
        DrName,
        DrCNIC,
        DrEmail,
        PhNmbr,
        Degree,
        specialist,
        password: hashedPassword
      });
    
    

    // Save the Doctor object to the database
    await newDoctor.save();
    // Return the saved Doctor object
    res.json(newDoctor);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});


// random password to DrEmail

app.post('/mailnodemailer', bodyParser.json(), async (req, res) => {
  const { recipientEmail, password } = req.body;

  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'pass',
    },
  });

  // Configure the email options
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: recipientEmail,
    subject: 'Your Registration Password',
    text: `Hello, your password is: ${password}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to send email' });
    } else {
      console.log('Email sent: ' + info.response);
      res.json({ success: true });
    }
  });
});




// Doctor Login

app.post("/doctor_login", bodyParser.json(), async (req, res) => {
  const { DrCNIC, password } = req.body;
  const doctor = await Doctor.findOne({ DrCNIC });
  if (!doctor) {
    return res.status(401).send("Invalid Credentials");
  }
  console.log("Record exist: ", doctor);
  const passwordMatch = await bcrypt.compare(password, doctor.password);
  if (!passwordMatch) {
    return res.status(401).send("Invalid CNIC or Password");
  }
  const token = jwt.sign({ DrCNIC: doctor.DrCNIC }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });
  res.send({ token });
});


app.get('/doctor_profile', authMiddleware,  async (req, res,) => {
  try {
    const { DrCNIC } = req.user;
    const doctorRecord = await Doctor.findOne({ DrCNIC });
    if (!doctorRecord) {
      return res.status(404).send('Doctor not found');
    }
    res.send(doctorRecord);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.post('/find-patient',async(req,res)=>{
  const {cnic, ph} = req.body;  
  try{
    const patient = await Patient.findOne({cnic});
    if(patient){
      const {phoneNumber, emergencyContact} = patient;
      if(ph==phoneNumber || ph==emergencyContact.EphoneNumber){
       return res.status(200).send(patient);
      }
    }
  }
  catch(error){
      return res.status(500).send(error.message)
  }
  res.status(422).send("Patient Not Found");
});


app.get('/reports', async(req,res)=>{
  try{
    const files = await Report.find();
    res.status(200).json(files);
  }catch(error){
    res.status(500).json({ message: 'Failed to retrieve files' });
  }
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, './public/uploads/reports')
  },
  filename: function (req, file, cb) {
    const uniqueFileName=`${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
    cb(null,uniqueFileName)
  }
})

const upload = multer({ storage: storage })

// Handle file upload
app.post('/upload', upload.single('file'), async(req,res) => {
  try {
    const { originalname,filename } = req.file;
    // Create a new report document
    const report = new Report({ file: filename, originalname });
    // Save the report to the database
    await report.save();
    res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload file' });
  }
});

// Surgery Data Upload Api
app.post('/post-surgery', async(req,res)=>{  
  try{
    const surgery = new Surgery(req.body);
    await surgery.save();
    res.status(200).json({ message: 'Data uploaded Successfully' });
  }catch(error){
    res.status(500).json({ message: 'Failed to upload data' });
  }
})

// Surgery Data get Api
app.get('/get-surgery', async(req,res)=>{
  try{
    const surgeries = await Surgery.find()
    res.status(200).json(surgeries);
  }catch(error){
    res.status(500).json({ message: 'Failed to fetch data' });
  }
})


// Record Api 
app.post('/post-record', async(req,res)=>{  
  try{  
    const record = new Record(req.body);
    await record.save();
    res.status(200).json({ message: 'Data uploaded Successfully' });
  }catch(error){
    res.status(500).json({ message: 'Failed to upload data' });
  }
})

app.get('/get-record', async(req,res)=>{
  try{
    const records = await Record.find()
    res.status(200).json(records);
  }catch(error){
    res.status(500).json({ message: 'Failed to fetch data' });
  }
})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////





app.post('/profile_picture/:cnic', IMupload.single('image'), async (req, res) => {
  try {
    const { filename, path } = req.file;
    const { cnic } = req.params;
    const image = new ImageSchema({ name: filename, path, cnic });
    await image.save();
    res.send('Image uploaded successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while uploading the image.');
  }
});




//////////////////////////////////////////////////////////////////////////////////////////////////////

// Update patient's medical history
app.put('/patient_medical_history/:cnic', async (req, res) => {
  try {
    const { cnic } = req.params;
    const { medicalHistory } = req.body;

    const patient = await Patient.findOne({ cnic });

    if (!patient) {
      return res.status(404).send('Patient not found.');
    }

    console.log({medicalHistory});

    patient.medicalHistory = {
      ...medicalHistory,
      // if blood patient is "yes" than add true otherwise false
      bloodPressure:  medicalHistory?.bloodPressure === 'Yes'|| medicalHistory?.bloodPressure === true  ? true : false,
      //same for below  
      familyHistoryBloodPressure:medicalHistory?.familyHistoryBloodPressure === 'Yes' || medicalHistory?.familyHistoryBloodPressure === true  ? true : false,
    };

    await patient.save();

    // updated patient object
    // console.log(patient);

    res.send('Medical history updated successfully.');
  } catch (error) {
    console.error('Error in updating medical history:', error);
    res.status(500).send('An error occurred while updating medical history.');
  }
});





//////////////Blockchain code///////////////////////////

////////////////////////Report Portion Start/////////////////////////////
//Upload Report
app.post('/uploadreport', (req, res) => {
  const hash = req.body.hash; // Hash of the file
  const uniqueId = req.body.uniqueId; // Unique ID
  const date = req.body.date; // Date
  const fileName = req.body.fileName; // File name

  // Print the received data to the console
  console.log('Received report:');
  console.log('Hash:', hash);
  console.log('Unique ID:', uniqueId);
  console.log('Date:', date);
  console.log('File Name:', fileName);

  const senderAddress = '0xfA2a889E17Fae5F4bDe0F2AaBf7C4cE344c62689'; // Update with your sender address

  // Send the report data to the blockchain
  repcontract.methods
    .set(uniqueId, hash, date, fileName)
    .send({ from: senderAddress, gas: 3000000 })
    .then((receipt) => {
      // Transaction successful
      console.log('Transaction receipt:', receipt);

      // Handle the data saving logic here (e.g., save the hash, uniqueId, date, and fileName to a database)

      // Send a response back to the client
      res.sendStatus(200);
    })
    .catch((error) => {
      // Transaction failed
      console.error('Error sending report data to blockchain:', error);

      // Return an error response
      res.status(500).send('Error sending report data to blockchain');
    });
});


// API endpoint to retrieve report data based on unique ID
app.get('/getreport/:uniqueId', (req, res) => {
  const uniqueId = parseInt(req.params.uniqueId); // Convert the uniqueId to an integer

  // Call the contract method to retrieve report data
  repcontract.methods.getImageCount(uniqueId).call((error, count) => {
    if (error) {
      console.error('Error retrieving report data from blockchain:', error);
      res.status(500).send('Error retrieving report data from blockchain');
    } else {
      const imagePromises = [];
      for (let i = 0; i < count; i++) {
        imagePromises.push(repcontract.methods.getImageByIndex(uniqueId, i).call());
      }

      Promise.all(imagePromises)
        .then((results) => {
          // Parse the retrieved data
          const report = results.map((result) => {
            const hash = result[0];
            const date = result[1];
            const fileName = result[2];
            return {
              uniqueId,
              hash,
              date,
              fileName,
            };
          });

          // Send the report data as the response
          res.json(report);
        })
        .catch((error) => {
          console.error('Error retrieving report data from blockchain:', error);
          res.status(500).send('Error retrieving report data from blockchain');
        });
    }
  });
});
////////////////////////Report Portion End/////////////////////////////

//////////////////////////Surgeries Portion Start/////////////////////


//Send Data from Front End to Blockchian
app.post('/surgeries', (req, res) => {
  // Extract the data from the request body
  const { uniqueId, imageDate, sname, dname, hname } = req.body;

  // Store the data in your desired manner (e.g., database, file, etc.)
  // Replace this example with your own data storage logic
  const surgeryData = {
    uniqueId,
    imageDate,
    sname,
    dname,
    hname
  };
  
  // Print the received data on the console
  console.log('Received surgery data:', surgeryData);
  
  // Replace this example with your own data storage logic
  const senderAddress = '0xfA2a889E17Fae5F4bDe0F2AaBf7C4cE344c62689'; // Update with your sender address

  // Send the report data to the blockchain
  surcontract.methods
    .set(uniqueId, imageDate, sname, dname,hname)
    .send({ from: senderAddress, gas: 3000000 })
    .then((receipt) => {
      // Transaction successful
      console.log('Transaction receipt:', receipt);
      // Handle the data saving logic here (e.g., save the hash, uniqueId, date, and fileName to a database)

      // Send a response back to the client
      res.json({ message: 'Surgery data received and stored successfully' });
    })
    .catch((error) => {
      // Transaction failed
      console.error('Error sending report data to blockchain:', error);

      // Return an error response
      res.status(500).send('Error sending report data to blockchain');
    });
});

//API that get the surgeries Data
app.get('/getsurgery/:uniqueId', (req, res) => {
  const uniqueId = parseInt(req.params.uniqueId); // Convert the uniqueId to an integer

  // Call the contract method to retrieve report data
  surcontract.methods.getSurgeryCount(uniqueId).call((error, count) => {
    if (error) {
      console.error('Error retrieving report data from blockchain:', error);
      res.status(500).send('Error retrieving report data from blockchain');
    } else {
      const imagePromises = [];
      for (let i = 0; i < count; i++) {
        imagePromises.push(surcontract.methods.getSurgeryByIndex(uniqueId, i).call());
      }

      Promise.all(imagePromises)
        .then((results) => {
          // Parse the retrieved data
          const surgery = results.map((result) => {
            const imageDate = result[0];
            const sname = result[1];
            const dname = result[2];
            const hname = result[3];
            return {
              uniqueId,
              imageDate,
              sname,
              dname,
              hname,
            };
          });

          // Send the report data as the response
          res.json(surgery);
        })
        .catch((error) => {
          console.error('Error retrieving report data from blockchain:', error);
          res.status(500).send('Error retrieving report data from blockchain');
        });
    }
  });
});

///////////////////////////////////////////Surgeries Portion End//////////////////////////////

//////////////////////////////////////////Record Portion Start///////////////////////////////

app.post('/recordhistory', (req, res) => {
  // Extract the data from the request body
  const { uniqueId, recdate, recdr, recdisease, recmedicine, rectest } = req.body;

  // Store the data in your desired manner (e.g., database, file, etc.)
  // Replace this example with your own data storage logic
  const recordData = {
    uniqueId,
    recdate,
    recdr,
    recdisease,
    recmedicine,
    rectest
  };
  // Print the received data on the console
  console.log('Received surgery data:', recordData);
  // Replace this example with your own data storage logic
  const senderAddress = '0xfA2a889E17Fae5F4bDe0F2AaBf7C4cE344c62689'; // Update with your sender address

  // Send the report data to the blockchain
  reccontract.methods
  .set(uniqueId, recdate, recdr, recdisease, recmedicine, rectest)
  .send({ from: senderAddress, gas: 3000000 })
    .then((receipt) => {
      // Transaction successful
      console.log('Transaction receipt:', receipt);
      // Handle the data saving logic here (e.g., save the hash, uniqueId, date, and fileName to a database)

      // Send a response back to the client
      res.json({ message: 'Surgery data received and stored successfully' });
    })
    .catch((error) => {
      // Transaction failed
      console.error('Error sending report data to blockchain:', error);

      // Return an error response
      res.status(500).send('Error sending report data to blockchain');
    });
});


//API that get the surgeries Data
app.get('/getrecord/:uniqueId', (req, res) => {
  const uniqueId = parseInt(req.params.uniqueId); // Convert the uniqueId to an integer

  // Call the contract method to retrieve report data
  reccontract.methods.getRecordCount(uniqueId).call((error, count) => {
    if (error) {
      console.error('Error retrieving report data from blockchain:', error);
      res.status(500).send('Error retrieving report data from blockchain');
    } else {
      const imagePromises = [];
      for (let i = 0; i < count; i++) {
        imagePromises.push(reccontract.methods.getRecordByIndex(uniqueId, i).call());
      }

      Promise.all(imagePromises)
        .then((results) => {
          // Parse the retrieved data
          const record = results.map((result) => {
            const recdate = result[0];
            const recdr = result[1];
            const recdisease = result[2];
            const recmedicine = result[3];
            const rectest = result[4];
            return {
              uniqueId,
              recdate,
              recdr,
              recdisease,
              recmedicine,
              rectest
            };
          });

          // Send the report data as the response
          res.json(record);
        })
        .catch((error) => {
          console.error('Error retrieving report data from blockchain:', error);
          res.status(500).send('Error retrieving report data from blockchain');
        });
    }
  });
});




//Server Port
app.listen(5000, function () {
  console.log("Backend listening on port 5000!");
});