import React from "react";
import Image from "next/image";

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
    <li className="flex items-center justify-between py-3 w-full">
      <div className="flex items-center gap-3 w-full">
        <button
          onClick={() => onToggle(id)}
          onKeyDown={(e) => handleKeyDown(e, () => onToggle(id))}
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
            completed
              ? "bg-[#FF2056]"
              : "bg-white border-[3px] border-[#D4D4D4]"
          }`}
          aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
          tabIndex={0}
        >
          {completed && (
            <Image
              src="/icons/check.svg"
              alt="Completed"
              width={14}
              height={14}
              className="text-white"
            />
          )}
        </button>
        <span
          className={`font-[Helvetica] text-[14px] text-[#525252] ${
            completed ? "line-through opacity-70" : ""
          }`}
        >
          {text}
        </span>
      </div>
      <button
        onClick={() => onDelete(id)}
        onKeyDown={(e) => handleKeyDown(e, () => onDelete(id))}
        className="hover:opacity-80 transition-opacity"
        aria-label="Delete todo"
        tabIndex={0}
      >
        <Image
          src="/icons/x-mark.svg"
          alt="Delete"
          width={16}
          height={16}
          className="text-[#A1A1A1]"
        />
      </button>
    </li>
  );
};

export default Todo;
