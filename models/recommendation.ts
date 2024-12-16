import mongoose from 'mongoose'

const recommendationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  text: { type: String, required: true },
  category: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  impact: { type: Number }, // Estimated savings impact
})

export const Recommendation = mongoose.models.Recommendation || 
  mongoose.model('Recommendation', recommendationSchema) 