import { Todo } from './store'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class TodoApi {
  static async getTodos(): Promise<Todo[]> {
    const response = await fetch(`${API_BASE_URL}/api/todos/`, {
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      throw new ApiError('Failed to fetch todos', response.status)
    }

    return response.json()
  }

  static async createTodo(todo: Omit<Todo, 'id' | 'created_at' | 'updated_at'>): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/api/todos/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new ApiError(`Failed to create todo: ${error}`, response.status)
    }

    return response.json()
  }

  static async updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/api/todos/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new ApiError(`Failed to update todo: ${error}`, response.status)
    }

    return response.json()
  }

  static async deleteTodo(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/todos/${id}/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new ApiError(`Failed to delete todo: ${error}`, response.status)
    }
  }
}

// Real-time WebSocket connection
export class TodoWebSocket {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  connect() {
    if (typeof window === 'undefined') return

    const wsUrl = API_BASE_URL.replace('http', 'ws').replace('https', 'ws') + '/ws/todos/'
    
    try {
      this.ws = new WebSocket(wsUrl)
      
      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.reconnectAttempts = 0
      }
      
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        this.handleMessage(data)
      }
      
      this.ws.onclose = () => {
        console.log('WebSocket disconnected')
        this.attemptReconnect()
      }
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
      this.attemptReconnect()
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
        this.connect()
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }

  private handleMessage(data: any) {
    switch (data.type) {
      case 'todo_created':
      case 'todo_updated':
      case 'todo_deleted':
        // Handle real-time updates
        window.dispatchEvent(new CustomEvent('todo-update', { detail: data }))
        break
      default:
        console.log('Unknown message type:', data.type)
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

export const todoWebSocket = new TodoWebSocket()
