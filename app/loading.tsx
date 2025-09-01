import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='border-b'>
        <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Loader2 className='h-6 w-6 animate-spin text-primary' />
            <h1 className='text-2xl font-bold text-muted-foreground'>
              Loading...
            </h1>
          </div>
          <Skeleton className='h-10 w-10' />
        </div>
      </header>

      {/* Loading Kanban Board */}
      <main className='h-[calc(100vh-80px)]'>
        <div className='h-full p-6 bg-background/50'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <div className='flex items-center gap-3 mb-2'>
                <Loader2 className='h-8 w-8 animate-spin text-primary' />
                <Skeleton className='h-8 w-64' />
              </div>
              <Skeleton className='h-4 w-48' />
            </div>
            <Skeleton className='h-10 w-24' />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]'>
            {[1, 2, 3].map((columnIndex) => (
              <div key={columnIndex} className='flex flex-col'>
                {/* Column Header */}
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center gap-2'>
                    <Skeleton className='h-6 w-20' />
                    <Skeleton className='h-5 w-6' />
                  </div>
                  <Skeleton className='h-8 w-8' />
                </div>

                {/* Column Content */}
                <div className='flex-1 bg-muted/5 border border-border/50 rounded-lg p-4 overflow-y-auto'>
                  <div className='space-y-3'>
                    {[1, 2, 3].map((taskIndex) => (
                      <Card
                        key={taskIndex}
                        className='border border-border/60 bg-card'
                      >
                        <CardHeader className='pb-3'>
                          <div className='flex items-start justify-between gap-2'>
                            <div className='flex-1 min-w-0'>
                              <Skeleton className='h-4 w-full mb-2' />
                              <Skeleton className='h-3 w-3/4' />
                            </div>
                            <Skeleton className='h-6 w-6' />
                          </div>
                        </CardHeader>
                        <CardContent className='pt-0 space-y-3'>
                          <Skeleton className='h-3 w-full' />
                          <div className='flex items-center justify-between'>
                            <Skeleton className='h-5 w-20' />
                          </div>
                          <div className='flex items-center gap-2'>
                            <Skeleton className='h-6 w-6 rounded-full' />
                            <Skeleton className='h-3 w-16' />
                          </div>
                          <div className='flex items-center gap-2'>
                            <Skeleton className='h-3 w-3' />
                            <Skeleton className='h-3 w-16' />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
