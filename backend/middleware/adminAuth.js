import crypto from 'node:crypto'

export function issueToken() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + 8 * 60 * 60 * 1000 })).toString('base64url')
  const signature = crypto.createHmac('sha256', process.env.ADMIN_TOKEN_SECRET).update(payload).digest('base64url')
  return `${payload}.${signature}`
}

export function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '')
  if (!token) return res.status(401).json({ message: 'Admin sign in required.' })
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return res.status(401).json({ message: 'Invalid admin session.' })
  const expected = crypto.createHmac('sha256', process.env.ADMIN_TOKEN_SECRET).update(payload).digest()
  let supplied
  try { supplied = Buffer.from(signature, 'base64url') } catch { return res.status(401).json({ message: 'Invalid admin session.' }) }
  if (expected.length !== supplied.length || !crypto.timingSafeEqual(expected, supplied)) {
    return res.status(401).json({ message: 'Invalid admin session.' })
  }
  try {
    if (JSON.parse(Buffer.from(payload, 'base64url').toString()).exp < Date.now()) {
      return res.status(401).json({ message: 'Admin session expired.' })
    }
  } catch { return res.status(401).json({ message: 'Invalid admin session.' }) }
  next()
}
