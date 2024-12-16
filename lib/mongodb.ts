import mongoose from 'mongoose'

// Extend the global interface to include mongoose
declare global {
  var mongoose: {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
  } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI!
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

// Ensure cached is always defined
let cached: {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
} = global.mongoose ?? { conn: null, promise: null }

// Always assign to global to ensure consistency
global.mongoose = cached

export async function connectToDatabase() {
  if (cached.conn) {
    console.log('Using cached MongoDB connection')
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }
    console.log('Connecting to MongoDB...')
    cached.promise = mongoose.connect(MONGODB_URI, opts)
  }

  try {
    cached.conn = await cached.promise
    console.log('MongoDB connected successfully')
    return cached.conn
  } catch (e) {
    cached.promise = null
    console.error('MongoDB connection error:', e)
    throw e
  }
}