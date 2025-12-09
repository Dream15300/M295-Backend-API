import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'
import type { ErrorRequestHandler } from 'express'

// Basisordner für Uploads
const uploadRoot = path.join(process.cwd(), 'uploads')
const imagesDir = path.join(uploadRoot, 'images')

// Ordner sicherstellen
fs.mkdirSync(imagesDir, { recursive: true })

// Speicherstrategie: Dateien im Ordner "uploads/images" mit sicherem Namen
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, imagesDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
    cb(null, safeName)
  },
})

// Nur JPG/JPEG erlauben
const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const mimeOk = file.mimetype === 'image/jpeg'
  const ext = path.extname(file.originalname).toLowerCase()
  const extOk = ext === '.jpg' || ext === '.jpeg'

  if (mimeOk && extOk) {
    cb(null, true)
  } else {
    cb(new Error('Nur JPG/JPEG-Dateien sind erlaubt'))
  }
}

// Multer-Instanz: Einzeldatei-Feldname "file", max. 2 MB
export const uploadImage = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter,
}).single('file')

// Fehler-Handler speziell für Upload-Probleme
export const uploadErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  // zu gross
  if ((err as any)?.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ fehler: 'Datei zu gross (max. 2 MB)' })
  }

  // falscher Typ
  if (err instanceof Error && err.message.startsWith('Nur JPG')) {
    return res.status(400).json({ fehler: err.message })
  }

  // alles andere → globaler errorHandler
  return next(err)
}
