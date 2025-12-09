import multer from 'multer'
import fs from 'fs'
import path from 'path'
import type { Request } from 'express'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const absenceId = req.params.id
    const baseDir = path.resolve('files')
    const targetDir = path.join(baseDir, String(absenceId))

    try {
      fs.mkdirSync(targetDir, { recursive: true })
    } catch (err) {
      return cb(err as Error, targetDir)
    }

    cb(null, targetDir)
  },
  filename(req, file, cb) {
    const timestamp = Date.now()
    const safeOriginal = file.originalname.replace(/\s+/g, '_')
    cb(null, `${timestamp}_${safeOriginal}`)
  },
})

function fileFilter(req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const allowedMimeTypes = ['application/pdf', 'image/png', 'image/jpeg']

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Ungültiger Dateityp'))
  }

  cb(null, true)
}

export const uploadAbsenceDocuments = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 10,
  },
}).array('files', 10)
