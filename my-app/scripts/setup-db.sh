#!/bin/bash

# Push schema to database
echo "Pushing Prisma schema to database..."
npx prisma db push

# Seed the database
echo "Seeding the database..."
npx prisma db seed

echo "Database setup complete!" 