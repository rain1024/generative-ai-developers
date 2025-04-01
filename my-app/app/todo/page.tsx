"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import TodoList from "./components/TodoList";
import {
  TodoItem,
  loadTodos,
  saveTodos,
  addTodo,
  toggleTodoComplete,
  deleteTodo,
} from "./actions";

export default function TodoApp() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputValue, setInputValue] = useState("");

  // Load todos from localStorage on initial render
  useEffect(() => {
    setTodos(loadTodos());
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const handleAddTodo = () => {
    if (inputValue.trim() === "") return;
    setTodos(addTodo(todos, inputValue));
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  const handleToggleComplete = (id: number) => {
    setTodos(toggleTodoComplete(todos, id));
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(deleteTodo(todos, id));
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
          <TodoList
            todos={todos}
            onToggle={handleToggleComplete}
            onDelete={handleDeleteTodo}
          />
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
    </div>
  );
}
