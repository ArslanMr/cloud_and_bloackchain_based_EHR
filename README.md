# Cloud and Blockchain-Based Electronic Health Record (EHR)

This Electronic Health Record (EHR) application is built using React.js and leverages cloud and blockchain technologies for secure and efficient healthcare data management. It combines the power of cloud storage and the immutability of blockchain for a robust EHR system. Below are instructions for running the complete program and setting up various components of the application.

## Instructions

### Backend Setup

1. **Gmail and Authentication**:
   - In the `backend/app.js` file, you need to provide Gmail and authentication details for various features, such as the Forget Password link, Hospital verification, and sending the doctor's password to a Gmail account.

2. **Blockchain**:
   - Download [Ganache](https://www.trufflesuite.com/ganache) to emulate a local blockchain environment.
   - Link Ganache with the project and compile the contracts located in the `/backend/contracts` folder.

   - In the `backend/app.js` file, set the following blockchain configurations:
     - `senderAddress`: Provide the sender's address for the blockchain process.
     - `repcontractAddress`, `surcontractAddress`, `reccontractAddress`: Provide the contract addresses that were compiled and migrated.

3. **MongoDB**:
   - Create a `.env` file in the `/ehr_backend` directory.
   - Inside the `.env` file, provide the MongoDB connection URL:
     ```
     DB_URL=Your_mongodb_link_to_connect
     SECRET_KEY=SecretKey
     ```

4. **Message Authentication**:
   - In the `/ehr_frontend/firebase.config.js` file, provide the Firebase configuration details. You can obtain these details from the [Firebase Console](https://firebase.google.com/):
     ```javascript
     apiKey: "YourAPI_key",
     authDomain: "otp-ehr.firebaseapp.com",
     ```

### Frontend Setup

1. Navigate to the `/ehr_frontend` directory:
   ```
   cd ehr_frontend
   ```

2. Install the required dependencies:
   ```
   npm install
   ```

3. Start the React application:
   ```
   npm start
   ```

   The EHR application will be accessible in your web browser at `http://localhost:3000`.

## Disclaimer

Please use this application responsibly, especially when dealing with sensitive healthcare data. Make sure to comply with all relevant regulations and privacy laws when handling patient information. Always ensure the security and privacy of the data stored and transmitted within the system.

