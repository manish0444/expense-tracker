import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '@/lib/mongodb'
import { Recommendation } from '@/models/recommendation'
import { authOptions } from '@/app/api/auth/auth.config'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    
    const recommendations = await Recommendation.find({ 
      userId: session.user.email 
    }).sort({ createdAt: -1 })

    const stats = {
      total: recommendations.length,
      completed: recommendations.filter(r => r.completed).length,
      pending: recommendations.filter(r => !r.completed).length
    }

    return NextResponse.json({ recommendations, stats })
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, completed } = await req.json()
    
    await connectToDatabase()
    
    const recommendation = await Recommendation.findOneAndUpdate(
      { _id: id, userId: session.user.email },
      { 
        completed,
        completedAt: completed ? new Date() : null
      },
      { new: true }
    )

    if (!recommendation) {
      return NextResponse.json({ error: 'Recommendation not found' }, { status: 404 })
    }

    return NextResponse.json(recommendation)
  } catch (error) {
    console.error('Error updating recommendation:', error)
    return NextResponse.json({ error: 'Failed to update recommendation' }, { status: 500 })
  }
} 