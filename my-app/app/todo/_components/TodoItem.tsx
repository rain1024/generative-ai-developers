"use client";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-colors">
      <button
        onClick={onToggle}
        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all
          ${
            todo.completed
              ? "bg-[#31C897] border-[#31C897] scale-105"
              : "border-gray-300 hover:border-[#31C897] hover:scale-105"
          }`}
      >
        {todo.completed && (
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>
      <span
        className={`flex-1 text-lg transition-all ${
          todo.completed
            ? "text-gray-400 line-through"
            : "text-gray-700 group-hover:text-gray-900"
        }`}
      >
        {todo.text}
      </span>
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all hover:scale-110 focus:opacity-100 focus:outline-none"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}
