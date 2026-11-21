import Employee from '../models/Employee.js'

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])

export async function createEmployee(req, res, next) {
  try {
    const fullName = req.body.fullName?.trim()
    const designation = req.body.designation?.trim()
    const email = req.body.email?.trim() || ''
    const linkedin = req.body.linkedin?.trim() || ''
    if (!fullName || !designation) return res.status(400).json({ message: 'Name and designation are required.' })
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'Enter a valid email address.' })
    if (linkedin) {
      try {
        const url = new URL(linkedin)
        if (url.protocol !== 'https:' || !['linkedin.com', 'www.linkedin.com'].includes(url.hostname)) throw new Error()
      } catch { return res.status(400).json({ message: 'Enter a valid LinkedIn profile URL.' }) }
    }
    if (!req.file) return res.status(400).json({ message: 'A profile photo is required.' })
    if (!allowedTypes.has(req.file.mimetype)) return res.status(400).json({ message: 'Upload a JPEG, PNG, WebP, or AVIF image.' })
    const employee = await Employee.create({
      fullName, designation, email, linkedin,
      image: { data: req.file.buffer, contentType: req.file.mimetype, originalName: req.file.originalname.replace(/[\r\n"\\]/g, '_') },
    })
    res.status(201).json({ message: 'Your profile has been submitted. Thank you!', employee: { id: employee.id } })
  } catch (error) { next(error) }
}

export async function listEmployees(_req, res, next) {
  try {
    const employees = await Employee.find().select('-image.data').sort({ createdAt: -1 }).lean()
    res.json(employees.map(({ _id, image, ...employee }) => ({ ...employee, id: _id, image: { contentType: image.contentType, originalName: image.originalName } })))
  } catch (error) { next(error) }
}

export async function getEmployeeImage(req, res, next) {
  try {
    const employee = await Employee.findById(req.params.id).select('image')
    if (!employee) return res.status(404).json({ message: 'Employee not found.' })
    res.set('Content-Type', employee.image.contentType)
    res.set('Content-Disposition', `attachment; filename="${employee.image.originalName}"`)
    res.set('Cache-Control', 'private, no-store')
    res.send(employee.image.data)
  } catch (error) { next(error) }
}

export async function deleteEmployee(req, res, next) {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id)
    if (!employee) return res.status(404).json({ message: 'Employee not found.' })
    res.json({ message: 'Employee submission deleted.' })
  } catch (error) { next(error) }
}
