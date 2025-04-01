"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import TodoList from "./components/TodoList";
import {
  TodoItem,
  loadTodos,
  addTodo,
  toggleTodoComplete,
  deleteTodo,
} from "./actions";

// Simple Toast component
const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      } text-white flex items-center gap-2 transition-opacity duration-300`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-white hover:text-gray-200"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default function TodoApp() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Load todos from database on initial render
  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const loadedTodos = await loadTodos();
        setTodos(loadedTodos);
      } catch (error) {
        console.error("Failed to load todos", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const handleAddTodo = async () => {
    if (inputValue.trim() === "") return;

    try {
      const updatedTodos = await addTodo(todos, inputValue);
      setTodos(updatedTodos);
      setInputValue("");
      showToast("Todo added successfully!", "success");
    } catch (error) {
      console.error("Failed to add todo", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  const handleToggleComplete = async (id: number) => {
    try {
      const todoToUpdate = todos.find((todo) => todo.id === id);
      if (!todoToUpdate) return;

      const updatedTodos = await toggleTodoComplete(todos, id);
      setTodos(updatedTodos);

      // Show congratulatory message only when completing a task (not when un-completing)
      if (!todoToUpdate.completed) {
        showToast("Great job! Task completed! 🎉", "success");
      }
    } catch (error) {
      console.error("Failed to toggle todo", error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      const updatedTodos = await deleteTodo(todos, id);
      setTodos(updatedTodos);
      showToast("Todo deleted successfully!", "success");
    } catch (error) {
      console.error("Failed to delete todo", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8 bg-white">
      <main className="flex flex-col gap-10 items-center w-full max-w-lg mt-10">
        {/* Header */}
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/icons/todo-icon.svg"
            alt="Todo App Icon"
            width={60}
            height={60}
          />
          <h1 className="text-4xl font-bold font-[Helvetica] tracking-wider text-[#262626]">
            My Todo List
          </h1>
        </div>

        {/* Input & Add Button */}
        <div className="flex w-full gap-3 items-center">
          <div className="flex-grow relative bg-[#F5F5F5] rounded-3xl px-4 py-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add your task"
              className="w-full bg-transparent border-none focus:outline-none font-[Helvetica] text-lg text-[#525252] placeholder-[#A1A1A1]"
              aria-label="New todo text"
            />
          </div>
          <button
            onClick={handleAddTodo}
            className="rounded-full bg-[#FF2056] text-white p-3 hover:opacity-90 transition-opacity"
            aria-label="Add todo"
          >
            <Image src="/icons/plus.svg" alt="Add" width={24} height={24} />
          </button>
        </div>

        {/* Todo List */}
        <div className="w-full">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF2056]"></div>
            </div>
          ) : (
            <TodoList
              todos={todos}
              onToggle={handleToggleComplete}
              onDelete={handleDeleteTodo}
            />
          )}
        </div>
      </main>

      <footer className="mt-auto py-6">
        <Link
          href="/"
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-[#525252]"
        >
          ← Back to Home
        </Link>
      </footer>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
