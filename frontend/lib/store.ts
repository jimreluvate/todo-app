import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface Todo {
  id: string
  title: string
  completed: boolean
  created_at: string
  updated_at: string
  isOptimistic?: boolean
}

interface TodoStore {
  todos: Todo[]
  isLoading: boolean
  error: string | null
  
  // Actions
  setTodos: (todos: Todo[]) => void
  addTodo: (todo: Omit<Todo, 'id'>) => void
  updateTodo: (id: string, updates: Partial<Todo>) => void
  deleteTodo: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Real-time actions
  optimisticAdd: (todo: Omit<Todo, 'id'>) => void
  optimisticUpdate: (id: string, updates: Partial<Todo>) => void
  optimisticDelete: (id: string) => void
  rollbackOptimistic: (id: string) => void
  confirmOptimistic: (id: string, realTodo: Todo) => void
}

export const useTodoStore = create<TodoStore>()(
  devtools(
    (set, get) => ({
      todos: [],
      isLoading: false,
      error: null,
      
      setTodos: (todos) => set({ todos }),
      
      addTodo: (todo) => {
        const newTodo: Todo = {
          ...todo,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        set({ todos: [newTodo, ...get().todos] })
      },
      
      updateTodo: (id, updates) => {
        set({
          todos: get().todos.map(todo =>
            todo.id === id ? { ...todo, ...updates, updated_at: new Date().toISOString() } : todo
          )
        })
      },
      
      deleteTodo: (id) => {
        set({ todos: get().todos.filter(todo => todo.id !== id) })
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      
      // Optimistic actions
      optimisticAdd: (todo) => {
        const optimisticTodo: Todo = {
          ...todo,
          id: `temp-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          isOptimistic: true,
        }
        set({ todos: [optimisticTodo, ...get().todos] })
      },
      
      optimisticUpdate: (id, updates) => {
        set({
          todos: get().todos.map(todo =>
            todo.id === id 
              ? { ...todo, ...updates, updated_at: new Date().toISOString(), isOptimistic: true }
              : todo
          )
        })
      },
      
      optimisticDelete: (id) => {
        set({
          todos: get().todos.map(todo =>
            todo.id === id ? { ...todo, isOptimistic: true } : todo
          )
        })
      },
      
      rollbackOptimistic: (id) => {
        set({
          todos: get().todos.filter(todo => todo.id !== id && !todo.id.startsWith('temp-'))
        })
      },
      
      confirmOptimistic: (id, realTodo) => {
        set({
          todos: get().todos.map(todo =>
            todo.id === id || todo.id === `temp-${id}` ? realTodo : todo
          )
        })
      },
    }),
    {
      name: 'todo-store',
    }
  )
)
