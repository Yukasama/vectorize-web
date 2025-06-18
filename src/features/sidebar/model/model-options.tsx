import { SidebarListItemOptions } from '@/components/ui/sidebar-list-item';
import { messages } from '@/lib/messages';
import React from 'react';
import { toast } from 'sonner';
import type { Model } from '../services/model-service';
import { deleteModel } from '../services/model-service';
import { ConfirmDeleteDialog } from './confirm-delete-dialog';

interface ModelListOptionsProps {
  model: Model;
  onDeleted?: (id: string) => void;
  onSelectForTraining?: (model: Model) => void;
  setEdit: (v: boolean) => void;
}

export const ModelListOptions = ({
  model,
  onDeleted,
  onSelectForTraining,
  setEdit,
}: ModelListOptionsProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleDelete = async () => {
    const success = await deleteModel(model.id);
    setDeleteDialogOpen(false);
    if (success) {
      toast.success(messages.model.delete.success(model.name), {
        position: 'bottom-right',
      });
      onDeleted?.(model.id);
    } else {
      toast.error(messages.model.delete.error);
    }
  };

  return (
    <>
      <SidebarListItemOptions
        deleteLabel="Delete"
        onTrain={
          onSelectForTraining ? () => onSelectForTraining(model) : undefined
        }
        renameLabel="Rename"
        setDeleteDialogOpen={setDeleteDialogOpen}
        setEdit={setEdit}
        trainLabel="Train"
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
