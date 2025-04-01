export type TodoItem = {
    id: number;
    text: string;
    completed: boolean;
};

// Load todos from localStorage
export const loadTodos = (): TodoItem[] => {
    if (typeof window === 'undefined') return [];

    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
        try {
            return JSON.parse(storedTodos);
        } catch (error) {
            console.error("Failed to parse stored todos", error);
            return getDefaultTodos();
        }
    }
    return getDefaultTodos();
};

// Save todos to localStorage
export const saveTodos = (todos: TodoItem[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem("todos", JSON.stringify(todos));
};

// Get default todos
export const getDefaultTodos = (): TodoItem[] => {
    return [
        {
            id: 1,
            text: "Breathe in, out. 🌬️",
            completed: true,
        },
        {
            id: 2,
            text: "I'm alive! 🙌",
            completed: true,
        },
        {
            id: 3,
            text: "Make sun smile. 😊",
            completed: false,
        },
        {
            id: 4,
            text: "Teach fish singing. 🐠",
            completed: false,
        },
        {
            id: 5,
            text: "Draw silly monster. 👹",
            completed: false,
        },
    ];
};

// Add a new todo
export const addTodo = (todos: TodoItem[], text: string): TodoItem[] => {
    if (text.trim() === "") return todos;

    const newTodo: TodoItem = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
    };

    return [...todos, newTodo];
};

// Toggle todo completion status
export const toggleTodoComplete = (todos: TodoItem[], id: number): TodoItem[] => {
    return todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
};

// Delete a todo
export const deleteTodo = (todos: TodoItem[], id: number): TodoItem[] => {
    return todos.filter((todo) => todo.id !== id);
}; 