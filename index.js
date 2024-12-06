const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const upload = multer({
  dest: 'uploads/',
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

  const imageUrl = `https://api-blush-zeta.vercel.app/uploads/${file.filename}`;
res.send({ imageUrl });


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(5000, () => console.log('Server running on port 5000'));
