import { SidebarListItemOptions } from '@/components/ui/sidebar-list-item';
import { messages } from '@/lib/messages';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import type { Dataset } from '../services/dataset-service';
import { ConfirmDeleteDialog } from './confirm-delete-dialog';

interface DatasetListOptionsProps {
  dataset: Dataset;
  onDeleted?: (id: string) => void;
  setEdit: (v: boolean) => void;
}

export const DatasetOptions = ({
  dataset,
  onDeleted,
  setEdit,
}: DatasetListOptionsProps) => {
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleDelete = async () => {
    const success = await import('../services/dataset-service').then((m) =>
      m.deleteDataset(dataset.id),
    );
    setDeleteDialogOpen(false);
    if (success) {
      toast.success(messages.dataset.delete.success(dataset.name));
      void queryClient.invalidateQueries({
        exact: false,
        queryKey: ['datasets'],
      });
      onDeleted?.(dataset.id);
    } else {
      toast.error(messages.dataset.delete.error);
    }
  };

  return (
    <>
      <SidebarListItemOptions
        deleteLabel="Delete"
        renameLabel="Rename"
        setDeleteDialogOpen={setDeleteDialogOpen}
        setEdit={setEdit}
      />
      <ConfirmDeleteDialog
        datasetName={dataset.name}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        open={deleteDialogOpen}
      />
    </>
  );
};
