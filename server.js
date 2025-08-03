const express = require('express');
const cors = require('cors');
const multer = require('multer');
const uuid = require('uuid').v4;
const path = require('path');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const Image = require('./models/Image');
const User = require('./models/user');
require('dotenv').config();

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(express.static('public')); // Serve static files like HTML/CSS/JS from public folder

// Multer Setup for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, uuid() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Upload Route for Images
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { details } = req.body;
    const file = req.file;

    if (!file || !details) {
      return res.status(400).json({ msg: 'Please provide both image and details' });
    }

    const imageEntry = new Image({
      id: uuid(),
      filename: file.filename,
      details: details
    });

    await imageEntry.save();

    return res.status(201).json({
      msg: 'Image uploaded successfully',
      id: imageEntry.id
    });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// Retrieve Image and Details Route
app.get('/get/:id', async (req, res) => {
  try {
    const image = await Image.findOne({ id: req.params.id });
    if (!image) return res.status(404).json({ msg: "Image not found" });

    res.json({
      imageURL: `/uploads/${image.filename}`,
      details: image.details
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});


// Register Route with confirmPassword
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;

    if (!username || !password || !confirmPassword) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      msg: 'User registered successfully'
    });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// Catch-all route for undefined routes (404 Not Found)
app.use((req, res, next) => {
  res.status(404).json({ msg: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  return res.status(500).json({ msg: 'Server error' });
});

// Start Server on port 8000
const PORT = 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
