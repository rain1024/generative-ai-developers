'use server';

import { prisma } from '@/lib/prisma';
import { Todo } from '@prisma/client';

export type TodoItem = Todo;

// Load todos from the database
export const loadTodos = async (): Promise<TodoItem[]> => {
    try {
        const todos = await prisma.todo.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return todos;
    } catch (error) {
        console.error('Failed to load todos from database', error);
        return [];
    }
};

// No-op function for backward compatibility
export const saveTodos = async (_todos: TodoItem[]): Promise<void> => {
    return;
};

// Add a new todo
export const addTodo = async (todos: TodoItem[], text: string): Promise<TodoItem[]> => {
    if (text.trim() === "") return todos;

    try {
        const newTodo = await prisma.todo.create({
            data: {
                text: text.trim(),
                completed: false
            }
        });

        return [...todos, newTodo];
    } catch (error) {
        console.error('Failed to add todo to database', error);
        return todos;
    }
};

// Toggle todo completion status
export const toggleTodoComplete = async (todos: TodoItem[], id: number): Promise<TodoItem[]> => {
    const todoToUpdate = todos.find(todo => todo.id === id);

    if (!todoToUpdate) return todos;

    try {
        const updatedTodo = await prisma.todo.update({
            where: { id },
            data: { completed: !todoToUpdate.completed }
        });

        return todos.map((todo) =>
            todo.id === id ? updatedTodo : todo
        );
    } catch (error) {
        console.error('Failed to update todo in database', error);
        return todos;
    }
};

// Delete a todo
export const deleteTodo = async (todos: TodoItem[], id: number): Promise<TodoItem[]> => {
    try {
        await prisma.todo.delete({
            where: { id }
        });

        return todos.filter((todo) => todo.id !== id);
    } catch (error) {
        console.error('Failed to delete todo from database', error);
        return todos;
    }
}; 