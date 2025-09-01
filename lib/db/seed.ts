import { db } from './index';
import { columns, tasks } from './schema';

export async function seedDatabase() {
  console.log('🌱 Seeding database...');

  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await db.delete(tasks);
    await db.delete(columns);
    console.log('✅ Existing data cleared');

    // Create initial columns

    // Create initial columns
    const todoColumn = await db
      .insert(columns)
      .values({
        title: 'Todo',
        order: 0,
      })
      .returning();

    const inProgressColumn = await db
      .insert(columns)
      .values({
        title: 'In Progress',
        order: 1,
      })
      .returning();

    const doneColumn = await db
      .insert(columns)
      .values({
        title: 'Done',
        order: 2,
      })
      .returning();

    // Create initial tasks
    await db.insert(tasks).values([
      {
        title: 'Design user interface',
        description: 'Create wireframes and mockups for the new feature',
        priority: 'high',
        assignee: 'Alice Johnson',
        dueDate: new Date('2024-01-15'),
        columnId: todoColumn[0].id,
        order: 0,
      },
      {
        title: 'Set up database',
        description: 'Configure the database schema and migrations',
        priority: 'medium',
        assignee: 'Bob Smith',
        dueDate: new Date('2024-01-20'),
        columnId: todoColumn[0].id,
        order: 1,
      },
      {
        title: 'Implement authentication',
        description: 'Add user authentication and authorization',
        priority: 'high',
        assignee: 'Charlie Brown',
        dueDate: new Date('2024-01-18'),
        columnId: inProgressColumn[0].id,
        order: 0,
      },
      {
        title: 'Project setup',
        description: 'Initialize the project with Next.js and dependencies',
        priority: 'low',
        assignee: 'David Wilson',
        dueDate: new Date('2024-01-10'),
        columnId: doneColumn[0].id,
        order: 0,
      },
    ]);

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
