import mongoose from 'mongoose'

const employeeSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, maxlength: 100 },
  designation: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, trim: true, lowercase: true, maxlength: 254, default: '' },
  linkedin: { type: String, trim: true, maxlength: 500, default: '' },
  image: {
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
    originalName: { type: String, required: true },
  },
}, { timestamps: true })

export default mongoose.model('Employee', employeeSchema)
