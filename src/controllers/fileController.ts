// src/controllers/fileController.ts
import type { Request, Response, NextFunction } from 'express'
import path from 'node:path'
import fs from 'node:fs'

import type { Express } from 'express'



const imagesDir = path.join(process.cwd(), 'uploads', 'images')

// GET /api/files  → Liste aller Dateien
export function listFiles(_req: Request, res: Response, next: NextFunction) {
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      // wenn Ordner noch nicht existiert → leere Liste zurückgeben
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        return res.status(200).json([])
      }
      return next(err)
    }

    // nur reguläre Dateien zurückgeben
    const result = files.filter((name) => !name.startsWith('.'))
    return res.status(200).json(result)
  })
}


// POST-Handler: Antwort nach erfolgreichem Upload
export function uploadFile(req: Request, res: Response, _next: NextFunction) {
  if (!req.file) {
    return res.status(400).json({ fehler: 'Keine Datei hochgeladen' })
  }

  const file = req.file as Express.Multer.File
  const { filename, mimetype, size } = req.file

  return res.status(201).json({
    message: 'Datei erfolgreich hochgeladen',
    filename,
    mimetype,
    size,
  })
}

// GET-Handler: Datei herunterladen/ausliefern
export function downloadFile(req: Request, res: Response, _next: NextFunction) {
  const { filename } = req.params
  const filePath = path.join(imagesDir, filename)

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ fehler: 'Datei nicht gefunden' })
    }

    return res.sendFile(filePath)
  })
}

// PUT /api/files/:filename → vorhandene Datei ersetzen (nur Admin)
export function updateFile(req: Request, res: Response, next: NextFunction) {
  const { filename: oldFilename } = req.params

  if (!req.file) {
    return res.status(400).json({ fehler: 'Keine neue Datei hochgeladen' })
  }

  const file = req.file as Express.Multer.File // 👈 Typ festlegen

  const oldPath = path.join(imagesDir, oldFilename)

  fs.unlink(oldPath, (err) => {
    if (err && (err as NodeJS.ErrnoException).code !== 'ENOENT') {
      return next(err)
    }

    const { filename, mimetype, size } = file

    return res.status(200).json({
      message: 'Datei erfolgreich ersetzt',
      oldFilename,
      newFilename: filename,
      mimetype,
      size,
    })
  })
}


// DELETE-Handler: Datei löschen
export function deleteFile(req: Request, res: Response, next: NextFunction) {
  const { filename } = req.params
  const filePath = path.join(imagesDir, filename)

  fs.unlink(filePath, (err) => {
    if (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        return res.status(404).json({ fehler: 'Datei nicht gefunden' })
      }
      return next(err)
    }

    return res.status(204).send()
  })
}
