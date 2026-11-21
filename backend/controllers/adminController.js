import crypto from 'node:crypto'
import { issueToken } from '../middleware/adminAuth.js'

export function login(req, res) {
  const password = req.body.password || ''
  const expected = Buffer.from(process.env.ADMIN_PASSWORD)
  const supplied = Buffer.from(password)
  const valid = expected.length === supplied.length && crypto.timingSafeEqual(expected, supplied)
  if (!valid) return res.status(401).json({ message: 'That password is not correct.' })
  res.json({ token: issueToken() })
}
