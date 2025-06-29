const multer = require('multer')
const path = require('path')
const fs = require('fs/promises')
const sharp = require('sharp')

// Storage destination and filename setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'))
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext
    cb(null, uniqueName)
  },
})

const multerUpload = multer({ storage })

// --- Helper: Convert to WebP ---
const convertToWebP = async (filePath) => {
  const ext = path.extname(filePath)
  const dir = path.dirname(filePath)
  const base = path.basename(filePath, ext)
  const outputPath = path.join(dir, base + '.webp')

  try {
    await sharp(filePath)
      .webp({ quality: 80 })
      .toFile(outputPath)

    // Delete original
    await fs.unlink(filePath)
    return outputPath
  } catch (err) {
    console.error('Error converting to WebP:', err)
    return filePath // fallback to original
  }
}

// --- Middleware: Auto convert uploaded images ---
const handleWebPConversion = async (req, res, next) => {
  const convertAndReplace = async (file) => {
    const newPath = await convertToWebP(file.path)
    file.filename = path.basename(newPath)
    file.path = newPath
  }

  try {
    if (req.file) {
      await convertAndReplace(req.file)
    }

    if (req.files) {
      for (const key in req.files) {
        await Promise.all(req.files[key].map(convertAndReplace))
      }
    }

    next()
  } catch (err) {
    console.error('Image processing failed:', err)
    res.status(500).json({ message: 'Image processing failed' })
  }
}

// --- Export ready-to-use upload with WebP support ---
const uploadWithWebP = {
  single: (field) => [multerUpload.single(field), handleWebPConversion],
  fields: (fieldsArray) => [multerUpload.fields(fieldsArray), handleWebPConversion],
}

module.exports = uploadWithWebP
