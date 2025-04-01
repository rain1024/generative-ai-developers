import React from "react";

type TodoProps = {
  id: number;
  text: string;
  completed: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
};

const Todo = ({ id, text, completed, onToggle, onDelete }: TodoProps) => {
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      action();
    }
  };

  return (
    <li className="flex items-center justify-between p-3 rounded-md border border-black/[.08] dark:border-white/[.145]">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(id)}
          onKeyDown={(e) => handleKeyDown(e, () => onToggle(id))}
          className={`w-5 h-5 rounded-full border ${
            completed
              ? "bg-green-500 border-green-500"
              : "border-black/[.2] dark:border-white/[.2]"
          } flex items-center justify-center transition-colors`}
          aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
          tabIndex={0}
        >
          {completed && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}
        </button>
        <span
          className={`${
            completed ? "line-through text-gray-500 dark:text-gray-400" : ""
          }`}
        >
          {text}
        </span>
      </div>
      <button
        onClick={() => onDelete(id)}
        onKeyDown={(e) => handleKeyDown(e, () => onDelete(id))}
        className="text-red-500 hover:text-red-700 transition-colors"
        aria-label="Delete todo"
        tabIndex={0}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
      </button>
    </li>
  );
};

export default Todo;
