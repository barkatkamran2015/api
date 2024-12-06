const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const os = require('os');

const upload = multer({
  dest: os.tmpdir(),  // Use the temporary directory in the serverless environment
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/; // Allow specific image formats
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed'));
  },
});

module.exports = (req, res) => {
  cors()(req, res, () => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        return res.status(400).send(err.message);
      }
      const file = req.file;
      if (!file) {
        return res.status(400).send('No file uploaded');
      }

      // Simulating an upload URL (change this to actual cloud storage if needed)
      const imageUrl = `https://your-project-name.vercel.app/api/uploads/${file.filename}`;
      res.send({ imageUrl });
    });
  });
};
