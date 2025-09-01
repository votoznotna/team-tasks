import type { Column, Task } from '@/lib/db/schema';
import { LoadingProvider } from './loading-context';
import { KanbanBoardContent } from './kanban-board-content';

interface KanbanBoardProps {
  columns: (Column & { tasks: Task[] })[];
}

export function KanbanBoard({ columns }: KanbanBoardProps) {
  return (
    <LoadingProvider>
      <KanbanBoardContent columns={columns} />
    </LoadingProvider>
  );
}
