// routes/projectRoutes.js
const express = require('express');
const prisma = require('../models/client');
const router = express.Router();
const {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { trackProjectView } = require('../controllers/viewController')
const { authenticate } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware')

// 🚀 Upload standalone image (optional use)
router.post('/upload', authenticate, upload.single('image'), async (req, res) => {
  const sharp = require('sharp');
  const fs = require('fs');
  const path = require('path');

  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const extName = path.parse(req.file.originalname).name;
  const webpName = extName + '-' + Date.now() + '.webp';
  const outputPath = path.join(__dirname, '../public/uploads', webpName);

  await sharp(req.file.path).webp({ quality: 70 }).toFile(outputPath);
  fs.unlinkSync(req.file.path); // delete temp

  const imageUrl = `/uploads/${webpName}`;
  res.json({ imageUrl });
});

// 🧠 Project CRUD
router.get('/', getProjects);
router.get('/:slug', getProjectBySlug);

// ✅ Accepts cover + gallery files with compression
// For single image upload
router.post('/upload', authenticate, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
  const imageUrl = `/uploads/${req.file.filename}`
  res.json({ imageUrl })
})

// For cover + gallery
router.post(
  '/',
  authenticate,
  upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
  ]),
  createProject
);


router.put(
  '/:slug',
  authenticate,
  upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
  ]),
  updateProject
);
router.delete('/:id', authenticate, deleteProject);

router.get('/check-slug/:slug', async (req, res) => {
  const { slug } = req.params;
  const existing = await prisma.project.findUnique({ where: { slug } });
  res.json({ available: !existing });
});



module.exports = router;
