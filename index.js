const multer = require('multer');
const path = require('path');

// Use Multer for file handling
const upload = multer({
  dest: '/tmp/uploads/',  // Temporary folder for Vercel (it’s ephemeral storage)
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed'));
  },
});

// The handler for the /api/upload route on Vercel
module.exports = (req, res) => {
  if (req.method === 'POST') {
    // Use multer to handle the file upload
    upload.single('file')(req, res, function (err) {
      if (err) {
        return res.status(400).send(err.message);  // Error handling
      }

      const file = req.file;
      if (!file) {
        return res.status(400).send('No file uploaded');
      }

      // The file is temporarily stored in /tmp/uploads/
      // Now return the image URL based on the current Vercel deployment
      const imageUrl = `https://${process.env.https://api-mk43ccxuz-barkatkamran2015s-projects.vercel.app/}/api/uploads/${file.filename}`;
      return res.status(200).send({ imageUrl });
    });
  } else {
    res.status(405).send('Method Not Allowed'); // Handle invalid methods
  }
};

// Serve static files (not recommended for Vercel's serverless functions, but possible)
// Note: Vercel’s filesystem is read-only, so files can't persist across requests
