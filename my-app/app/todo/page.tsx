import Image from "next/image";
import TodoList from "./_components/TodoList";

export default function TodoPage() {
  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-8">
          <Image
            src="/images/todo/todo-illustration-1.svg"
            alt="Todo List Illustration"
            width={64}
            height={64}
            priority
          />
          <h1 className="text-4xl font-bold text-[#262626] tracking-[0.15em]">
            My Todo List
          </h1>
        </div>
        <TodoList />
      </div>
    </main>
  );
}
