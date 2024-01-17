const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const EmployeeModel = require('./models/Employee');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Blockchain } = require('./blockchain');

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
mongoose.connect('mongodb://localhost:27017/employee', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const blockchain = new Blockchain();

app.post('/google-signin', async (req, res) => {
  try {
    res.json({ success: true, message: 'Google Sign-In successful' });
  } catch (error) {
    console.error('Error handling Google Sign-In:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

const sendResetPasswordEmail = async (email,userId, token,user) => {
  try {
    // Define email content
    const mailOptions = {
      from: 'altumohd007@gmail.com',
      to: email,
      subject: 'Reset Your Password',
      text: `Click on the following link to reset your password: http://localhost:5173/reset-password/${userId}/${token}`,
    };

    // Send the email using the Nodemailer transporter
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending reset password email:', error.message);
  }
};

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'altumohd007@gmail.com',
    pass:'hwpw wing mdpm kprd',
  },
});

const generateSecretKey = () => {
  return "JWT_SECRET"
};

app.get('/home', (req, res) => {
  res.json({ message: 'Welcome to the home page!' });
});

app.post('/register', async (req, res) => {
  try {
    const {  Name, loginId, password ,email} = req.body;
    console.log(req.body.email)
    const user = await EmployeeModel.findOne({ loginId: loginId });

    if (user) {
      return res.json({ error: 'User already exists!' });
    }

    const hash = await bcrypt.hash(password, 10);
    const employee = await EmployeeModel.create({ loginId: loginId, password: hash, Name: Name,email:email });
    // const userDocument = employee.toObject(); // Convert Mongoose document to plain JavaScript object
    // const serializedData = JSON.stringify(userDocument); // Serialize the document
    // const hashToAddToBlockchain = crypto.createHash('sha256').update(serializedData).digest('hex'); // Calculate the hash

    // // Add the hash to your blockchain
    // blockchain.addBlock(hashToAddToBlockchain);
    res.json(employee);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { loginId, password } = req.body;
    const user = await EmployeeModel.findOne({ loginId: loginId }).exec();

    if (user) {
      const secretKey = generateSecretKey();
      const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1d' });
      res.cookie('token', token);
      res.json('Success');
    } else {
      res.json('No record exists');
    }
  } catch (error) {
    console.error(error.message);
    res.json({ error: 'Internal Server Error' });
  }
});

app.post('/forgotpassword', async (req, res) => {
  try {
    console.log(req.body)
    const { email } = req.body;
    const user = await EmployeeModel.findOne({ email: email }).exec();
    console.log(user)
    if (!user) {
      return res.send({ Status: 'User does not exist' });
    }
    
    const secretKey = generateSecretKey();
    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });

    await sendResetPasswordEmail(email, user._id, token, user);
    console.log('Generated Token:', token);

    console.log({ Status: 'Reset password email sent successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/reset-password', async (req, res) => {
  //const { id, token } = req.params;
  const { password, id, token } = req.body;
  //console.log("Required params:", req.params);
  console.log('Received Token:', req.body);

  try {
    const secretKey = generateSecretKey();
    //const decoded = jwt.verify(token, secretKey);
    //console.log('Decoded Payload:', decoded);

    if (id) {
      const hash = await bcrypt.hash(password, 10);
      console.log(hash)
      const updatedUser = await EmployeeModel.findByIdAndUpdate(id, { password: hash }).exec();

      if (updatedUser) {
        res.json({ Status: 'Success' });
      } else {
        res.json({ Status: 'Error updating user' });
      }
    } else {
      res.json({ Status: 'Error with token' });
    }
  } catch (error) {
    console.error("Catch",error.message);
    res.json({ Status: 'Error', error: 'Internal Server Error' });
  }
});

// app.get('/verify-data/:userId', async (req, res) => {
//   try {
//       const userId = req.params.userId;
      
//       // Fetch data from MongoDB based on the userId
//       const user = await EmployeeModel.findById(userId).exec();

//       if (!user) {
//           return res.json({ success: false, message: 'User not found' });
//       }

//       // Hash the fetched data
//       const hashedData = crypto.createHash('sha256').update(JSON.stringify(user)).digest('hex');

//       // Verify the hash against the blockchain
//       const isVerified = blockchain.verifyData(hashedData);

//       if (isVerified) {
//           return res.json({ success: true, message: 'Data integrity verified' });
//       } else {
//           return res.json({ success: false, message: 'Data integrity verification failed' });
//       }
//   } catch (error) {
//       console.error(error.message);
//       res.status(500).json({ error: 'Internal Server Error' });
//   }
// });



app.listen(3002, () => {
  console.log('Server is running on port 3002');
});

