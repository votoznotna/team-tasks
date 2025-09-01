import { ThemeToggle } from '@/components/theme-toggle';
import { KanbanBoard } from '@/components/kanban-board';
import { getKanbanBoardData } from '@/lib/db/queries';
import { Suspense } from 'react';
import Loading from './loading';

// Artificial delay function
async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function KanbanBoardData() {
  // Add artificial delay to simulate data loading
  await delay(2000);

  try {
    // Fetch data from database
    const columns = await getKanbanBoardData();

    return <KanbanBoard columns={columns} />;
  } catch (error) {
    console.error('Error fetching data:', error);

    return (
      <div className='flex items-center justify-center h-full'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-destructive mb-4'>
            Database Connection Error
          </h2>
          <p className='text-muted-foreground mb-4'>
            Unable to fetch data from the database. Please check your database
            connection.
          </p>
          <pre className='bg-muted p-4 rounded text-sm text-left max-w-2xl overflow-auto'>
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
      </div>
    );
  }
}

export default function Home() {
  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='border-b'>
        <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Team Tasks</h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Kanban Board */}
      <main className='h-[calc(100vh-80px)]'>
        <Suspense fallback={<Loading />}>
          <KanbanBoardData />
        </Suspense>
      </main>
    </div>
  );
}
