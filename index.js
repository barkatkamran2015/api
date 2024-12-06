const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());  // Allow all domains by default (for testing)

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;  // Allow specific image formats
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed'));
  },
});

// Define your upload route
app.post('/api/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded');
  }
  const imageUrl = `https://api-omega-gules.vercel.app/uploads/${file.filename}`;  // Ensure correct URL
  res.send({ imageUrl });
});

app.listen(5000, () => console.log('Server running on port 5000'));
