'use client'

import React, { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTodoStore, Todo } from '@/lib/store'
import { TodoApi } from '@/lib/api'
import { TodoList } from '@/components/todos/todo-list'
import { TodoForm } from '@/components/todos/todo-form'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// Simple cn function for now
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function TodosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const {
    todos,
    isLoading,
    error,
    optimisticAdd,
    optimisticUpdate,
    optimisticDelete,
    confirmOptimistic,
    rollbackOptimistic,
    setLoading,
    setError
  } = useTodoStore()

  const [isOnline, setIsOnline] = useState(true)

  // Initialize WebSocket connection (disabled for now)
  // useEffect(() => {
  //   todoWebSocket.connect()
  //   
  //   const handleRealTimeUpdate = (event: CustomEvent) => {
  //     const { detail } = event
  //     confirmOptimistic(detail.data.id, detail.data.todo)
  //   }
  // 
  //   window.addEventListener('todo-update', handleRealTimeUpdate as EventListener)
  //   
  //   return () => {
  //     window.removeEventListener('todo-update', handleRealTimeUpdate as EventListener)
  //     todoWebSocket.disconnect()
  //   }
  // }, [])

  // Load initial todos
  useEffect(() => {
    if (status === 'loading') return
    
    const loadTodos = async () => {
      try {
        setLoading(true)
        const todos = await TodoApi.getTodos()
        useTodoStore.setState({ todos })
      } catch (error) {
        setError('Failed to load todos')
      } finally {
        setLoading(false)
      }
    }

    loadTodos()
  }, [status])

  // Network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleAddTodo = async (todo: Omit<Todo, 'id'>) => {
    try {
      setLoading(true)
      optimisticAdd(todo)
      
      const newTodo = await TodoApi.createTodo(todo)
      confirmOptimistic(newTodo.id, newTodo)
    } catch (error) {
      // Get the optimistic todo ID from the store
      const optimisticTodo = todos.find(t => t.isOptimistic && t.title === todo.title)
      if (optimisticTodo) {
        rollbackOptimistic(optimisticTodo.id)
      }
      setError('Failed to create todo')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      optimisticUpdate(id, updates)
      const updatedTodo = await TodoApi.updateTodo(id, updates)
      confirmOptimistic(id, updatedTodo)
    } catch (error) {
      rollbackOptimistic(id)
      setError('Failed to update todo')
    }
  }

  const handleDeleteTodo = async (id: string) => {
    try {
      optimisticDelete(id)
      await TodoApi.deleteTodo(id)
      // Remove from state after successful deletion
      useTodoStore.setState({ todos: todos.filter(todo => todo.id !== id && !todo.id.startsWith('temp-')) })
    } catch (error) {
      rollbackOptimistic(id)
      setError('Failed to delete todo')
    }
  }

  const handleSignOut = () => {
    signOut({ redirect: false })
    router.push('/auth/signin')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const completedCount = todos.filter(todo => todo.completed && !todo.isOptimistic).length
  const totalCount = todos.filter(todo => !todo.isOptimistic).length
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Todos</h1>
              <p className="text-sm text-gray-600 mt-1">
                {completionRate}% complete • {completedCount} of {totalCount} tasks
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  isOnline ? 'bg-green-500' : 'bg-red-500'
                )} />
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </div>
              
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Add Todo Form */}
          <TodoForm onAdd={handleAddTodo} isLoading={isLoading} />
          
          {/* Error Display */}
          {error && (
            <Card className="p-4 border-red-200 bg-red-50">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0H5a1 1 0 00-2 0v12a1 1 0 002 0h6a1 1 0 002-0V5a1 1 0 00-2-2H8a1 1 0 00-2 2v6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-red-800">Something went wrong</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                  <Button variant="ghost" size="sm" onClick={() => setError(null)} className="mt-2">
                    Dismiss
                  </Button>
                </div>
              </div>
            </Card>
          )}
          
          {/* Todo List */}
          <TodoList
            todos={todos}
            onUpdate={handleUpdateTodo}
            onDelete={handleDeleteTodo}
          />
        </div>
      </div>
    </div>
  )
}
