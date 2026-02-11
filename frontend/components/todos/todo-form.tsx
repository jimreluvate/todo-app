'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Todo } from '@/lib/store'
import { cn } from '@/lib/utils'

interface TodoFormProps {
  onAdd: (todo: Omit<Todo, 'id'>) => void
  isLoading?: boolean
}

export function TodoForm({ onAdd, isLoading = false }: TodoFormProps) {
  const [title, setTitle] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (title.trim()) {
      try {
        const now = new Date().toISOString()
        await onAdd({ 
          title: title.trim(), 
          completed: false,
          created_at: now,
          updated_at: now
        })
        setTitle('')
      } catch (error) {
        console.error('Failed to add todo:', error)
      }
    }
  }

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="flex space-x-3">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="What needs to be done?"
          className={cn(
            'flex-1',
            isFocused && 'placeholder-gray-400'
          )}
        />
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={!title.trim()}
          className="whitespace-nowrap"
        >
          Add Todo
        </Button>
      </form>
    </Card>
  )
}
