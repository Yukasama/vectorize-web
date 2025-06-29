import { SidebarListItemOptions } from '@/components/ui/sidebar-list-item';
import { messages } from '@/lib/messages';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import type { Model } from '../services/model-service';
import { ConfirmDeleteDialog } from './confirm-delete-dialog';

interface ModelListOptionsProps {
  model: Model;
  onDeleted?: (id: string) => void;
  setEdit: (v: boolean) => void;
}

export const ModelOptions = ({
  model,
  onDeleted,
  setEdit,
}: ModelListOptionsProps) => {
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleDelete = async () => {
    const success = await import('../services/model-service').then((m) =>
      m.deleteModel(model.id),
    );
    setDeleteDialogOpen(false);
    if (success) {
      toast.success(messages.model.delete.success(model.name));
      void queryClient.invalidateQueries({ queryKey: ['models'] });
      onDeleted?.(model.id);
    } else {
      toast.error(messages.model.delete.error);
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
        modelName={model.name}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        open={deleteDialogOpen}
      />
    </>
  );
};

export { ModelOptions as ModelListOptions };
