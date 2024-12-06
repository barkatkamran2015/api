const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());

// Use Vercel's temp directory for uploads
const upload = multer({
  dest: '/tmp/uploads/', // Use /tmp for serverless functions
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/; // Allow specific image formats
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed'));
  },
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded');
  }

  // Return a URL to the uploaded file
  const imageUrl = `https://api-blush-zeta.vercel.app/uploads/${file.filename}`;
  res.send({ imageUrl });
});

// Serve files from the temp directory
app.use('/uploads', express.static('/tmp/uploads'));

// Vercel automatically handles ports
app.listen(5000, () => console.log('Server running on port 5000')); // Use this only for local testing
