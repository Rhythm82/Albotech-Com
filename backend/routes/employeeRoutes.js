import { Router } from 'express'
import multer from 'multer'
import { createEmployee, deleteEmployee, getEmployeeImage, listEmployees } from '../controllers/employeeController.js'
import { requireAdmin } from '../middleware/adminAuth.js'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => callback(null, ['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.mimetype)),
})

router.post('/', (req, res, next) => upload.single('photo')(req, res, (error) => {
  if (error) return res.status(400).json({ message: error.code === 'LIMIT_FILE_SIZE' ? 'Image must be 12 MB or smaller.' : 'Choose a supported image file.' })
  next()
}), createEmployee)
router.get('/', requireAdmin, listEmployees)
router.get('/:id/image', requireAdmin, getEmployeeImage)
router.delete('/:id', requireAdmin, deleteEmployee)

export default router
