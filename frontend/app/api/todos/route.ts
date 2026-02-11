import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/todos/`, {
      headers: {
        'Content-Type': 'application/json',
        // In a real app, you'd pass the session token here
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch todos')
    }

    const todos = await response.json()
    return NextResponse.json(todos)
  } catch (error) {
    console.error('Error fetching todos:', error)
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, completed } = await request.json()

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const response = await fetch(`${API_BASE_URL}/api/todos/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // In a real app, you'd pass the session token here
      },
      body: JSON.stringify({ title, completed: completed || false }),
    })

    if (!response.ok) {
      throw new Error('Failed to create todo')
    }

    const newTodo = await response.json()
    return NextResponse.json(newTodo, { status: 201 })
  } catch (error) {
    console.error('Error creating todo:', error)
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 })
  }
}
