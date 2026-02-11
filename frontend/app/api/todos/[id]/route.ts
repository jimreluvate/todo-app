import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Temporarily skip session check for testing
  try {
    const { id } = await params
    const body = await request.json()
    console.log('PUT request body:', body)
    console.log('PUT params id:', id)
    
    const { title, completed } = body

    const response = await fetch(`${API_BASE_URL}/api/todos/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, completed }),
    })

    console.log('Backend response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend error response:', errorText)
      throw new Error(`Failed to update todo: ${errorText}`)
    }

    const updatedTodo = await response.json()
    return NextResponse.json(updatedTodo)
  } catch (error) {
    console.error('Error updating todo:', error)
    return NextResponse.json({ error: 'Failed to update todo', details: (error as Error).message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Temporarily skip session check for testing
  try {
    const { id } = await params
    const response = await fetch(`${API_BASE_URL}/api/todos/${id}/`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete todo')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting todo:', error)
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 })
  }
}
