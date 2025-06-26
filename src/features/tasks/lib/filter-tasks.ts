import { TASKS_TYPE_MAP } from '@/features/tasks/config/mappers';
import { Task, TaskStatus } from '@/features/tasks/types/task';

export interface TaskFilterOptions {
  maxHours?: number;
  searchQuery?: string;
  selectedStatuses?: TaskStatus[];
}

/**
 * Filters tasks based on search query, status selection, and time constraints.
 */
export const filterTasks = (
  tasks: Task[],
  options: TaskFilterOptions = {},
): Task[] => {
  const { maxHours = 1, searchQuery = '', selectedStatuses = [] } = options;

  return tasks.filter((task) => {
    if (
      selectedStatuses.length > 0 &&
      !selectedStatuses.includes(task.task_status)
    ) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTag = task.tag?.toLowerCase().includes(query);
      const matchesId = task.id.toLowerCase().includes(query);
      const matchesType = TASKS_TYPE_MAP[task.task_type]
        .toLowerCase()
        .includes(query);

      if (!matchesTag && !matchesId && !matchesType) {
        return false;
      }
    }

    if (
      ['C', 'D', 'F'].includes(task.task_status) &&
      task.end_date &&
      selectedStatuses.length === 0
    ) {
      const endTime = new Date(task.end_date).getTime();
      const cutoffTime = Date.now() - maxHours * 60 * 60 * 1000;

      if (endTime < cutoffTime) {
        return false;
      }
    }

    return true;
  });
};
