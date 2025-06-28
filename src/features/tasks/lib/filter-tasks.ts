import { TASKS_TYPE_MAP } from '@/features/tasks/config/mappers';
import { Task, TaskStatus, TaskType } from '@/features/tasks/types/task';

export interface TaskFilterOptions {
  searchQuery?: string;
  selectedStatuses?: TaskStatus[];
  selectedTypes?: TaskType[];
}

/**
 * Filters tasks based on search query, status selection, type selection, and time constraints.
 */
export const filterTasks = (
  tasks: Task[],
  options: TaskFilterOptions = {},
): Task[] => {
  const {
    searchQuery = '',
    selectedStatuses = [],
    selectedTypes = [],
  } = options;

  return tasks.filter((task) => {
    if (
      selectedStatuses.length > 0 &&
      !selectedStatuses.includes(task.task_status)
    ) {
      return false;
    }

    if (selectedTypes.length > 0 && !selectedTypes.includes(task.task_type)) {
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

    return true;
  });
};
