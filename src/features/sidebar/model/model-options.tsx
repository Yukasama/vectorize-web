import {
  SidebarListItemName,
  SidebarListItemOptions,
} from '@/components/ui/sidebar-list-item';
import { messages } from '@/lib/messages';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import type { Model } from '../services/model-service';
import { deleteModel, updateModelName } from '../services/model-service';
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
}: ModelListOptionsProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const [edit, setEditState] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [newName, setNewName] = React.useState(model.name);
  const [saving, setSaving] = React.useState(false);

  const handleSave = async () => {
    if (!newName.trim() || newName === model.name) {
      setEditState(false);
      setNewName(model.name);
      return;
    }
    setSaving(true);
    try {
      await updateModelName(model.id, newName.trim(), model.version);
      setEditState(false);
      void queryClient.invalidateQueries({ queryKey: ['models'] });
      await fetch('/api/revalidate-models', { method: 'POST' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const success = await deleteModel(model.id);
    setDeleteDialogOpen(false);
    if (success) {
      toast.success(messages.model.delete.success(model.name), {
        position: 'bottom-right',
      });
      onDeleted?.(model.id);
      void queryClient.invalidateQueries({ queryKey: ['models'] });
      await fetch('/api/revalidate-models', { method: 'POST' });
    } else {
      toast.error(messages.model.delete.error);
    }
  };

  return (
    <>
      <SidebarListItemName
        edit={edit}
        handleSave={handleSave}
        inputRef={inputRef as React.RefObject<HTMLInputElement>}
        name={model.name}
        newName={newName}
        saving={saving}
        setEdit={setEditState}
        setNewName={setNewName}
      />
      <SidebarListItemOptions
        deleteLabel="Delete"
        onTrain={
          onSelectForTraining ? () => onSelectForTraining(model) : undefined
        }
        renameLabel="Rename"
        setDeleteDialogOpen={setDeleteDialogOpen}
        setEdit={setEditState}
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
