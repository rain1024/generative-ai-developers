"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import TodoList from "../components/TodoList";

type TodoItem = {
  id: number;
  text: string;
  completed: boolean;
};

export default function TodoApp() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputValue, setInputValue] = useState("");

  // Load todos from localStorage on initial render
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      try {
        setTodos(JSON.parse(storedTodos));
      } catch (error) {
        console.error("Failed to parse stored todos", error);
      }
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (inputValue.trim() === "") return;

    const newTodo: TodoItem = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  const handleToggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-full max-w-lg">
        <div className="flex flex-col items-center gap-4 w-full">
          <h1 className="text-2xl font-bold">Todo App</h1>

          <div className="flex w-full gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a new task..."
              className="flex-grow p-2 rounded-md border border-black/[.08] dark:border-white/[.145] bg-transparent focus:outline-none focus:ring-2 focus:ring-foreground"
              aria-label="New todo text"
            />
            <button
              onClick={handleAddTodo}
              className="rounded-md bg-foreground text-background px-4 py-2 hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
              aria-label="Add todo"
            >
              Add
            </button>
          </div>

          <TodoList
            todos={todos}
            onToggle={handleToggleComplete}
            onDelete={handleDeleteTodo}
          />
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <Link
          href="/"
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        >
          ← Back to Home
        </Link>
      </footer>
    </div>
  );
}
