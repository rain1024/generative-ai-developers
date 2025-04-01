"use client";

import { useState } from "react";
import Image from "next/image";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: "1", text: "Breathe in, out. 🌬️", completed: true },
    { id: "2", text: "I'm alive! 🙌", completed: true },
    { id: "3", text: "Make sun smile. 😊", completed: false },
    { id: "4", text: "Teach fish singing. 🐠", completed: false },
    { id: "5", text: "Draw silly monster. 👹", completed: false },
  ]);
  const [newTodo, setNewTodo] = useState("");

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now().toString(),
          text: newTodo.trim(),
          completed: false,
        },
      ]);
      setNewTodo("");
    }
  };

  const handleToggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add your task"
            className="w-full h-[60px] bg-[#F5F5F5] rounded-[24px] px-6 text-lg text-[#525252] placeholder-[#A1A1A1] focus:outline-none focus:ring-2 focus:ring-[#FF2056] focus:ring-opacity-50"
          />
        </div>
        <button
          onClick={handleAddTodo}
          className="w-[60px] h-[60px] bg-[#FF2056] rounded-[60px] flex items-center justify-center hover:bg-[#E01C4C] transition-colors"
          aria-label="Add todo"
        >
          <Image
            src="/images/todo/plus.svg"
            alt="Add"
            width={24}
            height={24}
            className="text-white"
          />
        </button>
      </div>

      <div className="space-y-8">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between gap-4 group"
          >
            <button
              onClick={() => handleToggleTodo(todo.id)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                todo.completed
                  ? "bg-[#FF2056] border-[#FF2056]"
                  : "border-[#D4D4D4] hover:border-[#FF2056]"
              }`}
              aria-label={`Mark "${todo.text}" as ${
                todo.completed ? "incomplete" : "complete"
              }`}
            >
              {todo.completed && (
                <Image
                  src="/images/todo/check.svg"
                  alt="Completed"
                  width={12}
                  height={12}
                  className="text-white"
                />
              )}
            </button>
            <span
              className={`flex-1 text-sm text-[#525252] ${
                todo.completed ? "line-through" : ""
              }`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => handleDeleteTodo(todo.id)}
              className="w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Delete "${todo.text}"`}
            >
              <Image
                src="/images/todo/x-mark.svg"
                alt="Delete"
                width={12}
                height={12}
                className="text-[#A1A1A1]"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
