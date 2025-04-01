import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Delete all existing todos
    await prisma.todo.deleteMany({});

    // Create default todos
    const defaultTodos = [
        {
            text: "Breathe in, out. 🌬️",
            completed: true,
        },
        {
            text: "I'm alive! 🙌",
            completed: true,
        },
        {
            text: "Make sun smile. 😊",
            completed: false,
        },
        {
            text: "Teach fish singing. 🐠",
            completed: false,
        },
        {
            text: "Draw silly monster. 👹",
            completed: false,
        },
    ];

    console.log(`Start seeding...`);

    for (const todo of defaultTodos) {
        const result = await prisma.todo.create({
            data: todo,
        });
        console.log(`Created todo with id: ${result.id}`);
    }

    console.log(`Seeding finished.`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    }); 