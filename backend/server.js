import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import mongoose from 'mongoose'
import employeeRoutes from './routes/employeeRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

const app = express()
const port = process.env.PORT || 5000

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json({ limit: '1mb' }))
app.use(morgan('dev'))
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/employees', employeeRoutes)
app.use('/api/admin', adminRoutes)
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong.' })
})

if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required')
if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_TOKEN_SECRET) {
  throw new Error('ADMIN_PASSWORD and ADMIN_TOKEN_SECRET are required')
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(port, () => console.log(`Albotech API listening on port ${port}`))
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1)
  })
