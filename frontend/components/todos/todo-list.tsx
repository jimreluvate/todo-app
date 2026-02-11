'use client'

import React from 'react'
import { Todo } from '@/lib/store'
import { TodoItem } from './todo-item'
import { Card } from '@/components/ui/card'

interface TodoListProps {
  todos: Todo[]
  onUpdate: (id: string, updates: Partial<Todo>) => void
  onDelete: (id: string) => void
}

export function TodoList({ todos, onUpdate, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2v4a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2h2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No todos yet</h3>
          <p className="text-sm text-gray-600 max-w-sm mx-auto">
            Add your first todo to get started. Stay organized and productive with your clean, minimalist todo list.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
