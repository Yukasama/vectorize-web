import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { messages } from '@/lib/messages';
import { MoreVertical } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { deleteDataset } from '../services/dataset-service';
import { ConfirmDeleteDialog } from './confirm-delete-dialog';

interface Dataset {
  id: string;
  name: string;
}

interface DatasetListItemProps {
  dataset: Dataset;
  onDeleted?: (id: string) => void;
  onDetails: (id: string) => void;
}

export const DatasetListItem = ({
  dataset,
  onDeleted,
  onDetails,
}: DatasetListItemProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const recentlyDeleted = useRef(false);

  // Handles dataset deletion and notifies parent
  const handleDelete = async () => {
    const success = await deleteDataset(dataset.id);
    if (success) {
      recentlyDeleted.current = true;
      setDeleteDialogOpen(false);
      toast.success(messages.dataset.delete.success(dataset.name), {
        position: 'bottom-right',
      });
      onDeleted?.(dataset.id);
      setTimeout(() => {
        recentlyDeleted.current = false;
      }, 100);
    } else {
      toast.error(messages.dataset.delete.error);
    }
  };

  return (
    <div
      className="hover:bg-muted/70 flex h-8 cursor-pointer items-center justify-between rounded px-2 text-sm"
      onClick={() => {
        if (!deleteDialogOpen && !recentlyDeleted.current) {
          onDetails(dataset.id);
        }
      }}
      onKeyDown={(e) => {
        if (
          (e.key === 'Enter' || e.key === ' ') &&
          !deleteDialogOpen &&
          !recentlyDeleted.current
        ) {
          onDetails(dataset.id);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <span>{dataset.name}</span>
      {/* Dropdown menu for dataset actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            onClick={(e) => e.stopPropagation()}
            size="icon"
            tabIndex={-1}
            variant="ghost"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => alert(`Edit ${dataset.name}`)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert(`Train ${dataset.name}`)}>
            Train
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert(`Evaluate ${dataset.name}`)}>
            Evaluate
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteDialogOpen(true);
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        datasetName={dataset.name}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        open={deleteDialogOpen}
      />
    </div>
  );
};
