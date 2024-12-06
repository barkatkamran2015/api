const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const upload = multer({
  dest: '/tmp/uploads/', // Use tmp directory for Vercel serverless functions
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/; // Allow specific image formats
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed'));
  },
});

app.use(cors());

app.post('/api/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded');
  }

  // The image URL should be the one pointing to the Vercel domain
  const imageUrl = `https://api-omega-gules.vercel.app/uploads/${file.filename}`;
  res.send({ imageUrl });
});

app.use('/uploads', express.static(path.join(__dirname, '/tmp/uploads'))); // Serve from tmp directory

// Vercel only allows the serverless functions to listen on the default port, so it listens on port 3000
app.listen(3000, () => console.log('Server running on port 3000')); // Default for Vercel
