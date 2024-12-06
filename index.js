const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name with timestamp
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/; // Allow specific image formats
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed'));
  }
});

// CORS configuration
app.use(cors({
  origin: 'https://blog-5ys9lkrtk-barkatkamran2015s-projects.vercel.app', // Update with the correct frontend URL
}));

// File upload route
app.post('/api/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded');
  }

  // Adjust this URL based on your hosting setup
  const imageUrl = `https://api-ss5e.onrender.com/uploads/${file.filename}`;
  res.send({ imageUrl });
});

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handler for multer or general errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).send(err.message);
  }
  res.status(500).send('Internal server error');
});

// Listen on a dynamic port for deployment
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
