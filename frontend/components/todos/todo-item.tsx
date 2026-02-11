'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Todo } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { cn, formatDate, debounce } from '@/lib/utils'

interface TodoItemProps {
  todo: Todo
  onUpdate: (id: string, updates: Partial<Todo>) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSave = debounce(async () => {
    if (editValue.trim() !== todo.title) {
      try {
        await onUpdate(todo.id, { title: editValue.trim() })
        setIsEditing(false)
      } catch (error) {
        // Revert on error
        setEditValue(todo.title)
        setIsEditing(false)
      }
    } else {
      setIsEditing(false)
    }
  }, 300)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setEditValue(todo.title)
      setIsEditing(false)
    }
  }

  const handleToggle = async () => {
    try {
      await onUpdate(todo.id, { completed: !todo.completed })
    } catch (error) {
      console.error('Failed to toggle todo:', error)
    }
  }

  const handleDelete = async () => {
    try {
      await onDelete(todo.id)
    } catch (error) {
      console.error('Failed to delete todo:', error)
    }
  }

  return (
    <Card hover className="p-4 mb-3">
      <div className="flex items-center space-x-3">
        <button
          onClick={handleToggle}
          className={cn(
            'w-5 h-5 rounded-md border-2 transition-all duration-150',
            'flex items-center justify-center',
            todo.completed 
              ? 'bg-gray-900 border-gray-900 hover:bg-gray-800' 
              : 'border-gray-300 hover:border-gray-400 bg-white'
          )}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {todo.completed && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-8-8a1 1 0 00-1.414-1.414L10 10.586 7.707 7.293a1 1 0 00-1.414 1.414l-4 4a1 1 0 001.414 1.414l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              className="text-sm"
              placeholder="Todo title..."
              // name='getitdonw-comment on thispls'
            />
          ) : (
            <p
              onClick={() => setIsEditing(true)}
              className={cn(
                'text-sm text-gray-900 cursor-pointer hover:text-gray-700 transition-colors duration-150',
                todo.completed && 'line-through text-gray-500'
              )}
            >
              {todo.title}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {formatDate(todo.created_at)}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            aria-label="Delete todo"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </div>
      </div>
    </Card>
  )
}
