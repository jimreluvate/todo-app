import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001' || 'http://localhost:8000'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const id = params.id
    const { completed } = await request.json()

    const response = await fetch(`${API_BASE_URL}/api/todos/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // In a real app, you'd pass the session token here
      },
      body: JSON.stringify({ completed }),
    })

    if (!response.ok) {
      throw new Error('Failed to update todo')
    }

    const updatedTodo = await response.json()
    return NextResponse.json(updatedTodo)
  } catch (error) {
    console.error('Error updating todo:', error)
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const id = params.id

    const response = await fetch(`${API_BASE_URL}/api/todos/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // In a real app, you'd pass the session token here
      },
    })

    if (!response.ok) {
      throw new Error('Failed to delete todo')
    }

    return NextResponse.json({ message: 'Todo deleted successfully' })
  } catch (error) {
    console.error('Error deleting todo:', error)
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 })
  }
}
