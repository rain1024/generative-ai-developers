import React from "react";
import Todo from "./Todo";

type TodoItem = {
  id: number;
  text: string;
  completed: boolean;
};

type TodoListProps = {
  todos: TodoItem[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
};

const TodoList = ({ todos, onToggle, onDelete }: TodoListProps) => {
  if (todos.length === 0) {
    return (
      <ul className="w-full space-y-2">
        <li className="text-center py-4 text-gray-500 dark:text-gray-400">
          No tasks yet. Add one above!
        </li>
      </ul>
    );
  }

  return (
    <ul className="w-full space-y-2">
      {todos.map((todo) => (
        <Todo
          key={todo.id}
          id={todo.id}
          text={todo.text}
          completed={todo.completed}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default TodoList;
