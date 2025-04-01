# Database Setup for Todo App

This application uses PostgreSQL with Prisma ORM to store and manage todos.

## Prerequisites

- PostgreSQL installed and running
- Node.js and npm installed

## Setup Instructions

1. **Configure the database URL**

   Edit the `.env` file in the root directory and update the `DATABASE_URL` with your PostgreSQL connection details:

   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/todos?schema=public"
   ```

   Replace `username` and `password` with your PostgreSQL credentials.

2. **Create the database**

   Make sure you have a PostgreSQL database named `todos` (or the name you specified in your connection string).
   
   You can create it using the PostgreSQL command line:
   
   ```bash
   createdb todos
   ```
   
   Or using SQL:
   
   ```sql
   CREATE DATABASE todos;
   ```

3. **Push the schema and seed the database**

   Run the setup script:

   ```bash
   ./scripts/setup-db.sh
   ```

   This will:
   - Create the required tables in your database based on the Prisma schema
   - Seed the database with default todo items

## Prisma Studio (Optional)

You can use Prisma Studio to view and edit your data:

```bash
npx prisma studio
```

This will open a web interface at http://localhost:5555 where you can manage your data.

## Manual Schema Update

If you make changes to the schema in `prisma/schema.prisma`, you can update your database with:

```bash
npx prisma db push
``` 