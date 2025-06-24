import {
  SidebarListItemName,
  SidebarListItemOptions,
} from '@/components/ui/sidebar-list-item';
import { messages } from '@/lib/messages';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import type { Dataset } from '../services/dataset-service';
import { updateDataset } from '../services/dataset-service';
import { ConfirmDeleteDialog } from './confirm-delete-dialog';

interface DatasetListItemProps {
  dataset: Dataset;
  onDeleted?: (id: string) => void;
  onDetails?: (dataset_name: string) => void;
}

// DatasetListItem displays a single dataset entry with options menu
export const DatasetListItem = ({
  dataset,
  onDeleted,
}: DatasetListItemProps) => {
  const queryClient = useQueryClient();
  const [edit, setEdit] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [newName, setNewName] = React.useState(dataset.name);
  const [saving, setSaving] = React.useState(false);

  const handleSave = async () => {
    if (!newName.trim() || newName === dataset.name) {
      setEdit(false);
      setNewName(dataset.name);
      return;
    }
    setSaving(true);
    try {
      if (dataset.version === undefined) {
        throw new Error('Missing dataset version');
      }
      await updateDataset(dataset.id, newName.trim(), dataset.version);
      setEdit(false);
      void queryClient.invalidateQueries({ queryKey: ['datasets'] });
      await fetch('/api/revalidate-datasets', { method: 'POST' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <SidebarListItemName
        edit={edit}
        handleSave={handleSave}
        inputRef={inputRef as React.RefObject<HTMLInputElement>}
        name={dataset.name}
        newName={newName}
        saving={saving}
        setEdit={setEdit}
        setNewName={setNewName}
      />
      <DatasetListOptions
        dataset={dataset}
        onDeleted={onDeleted}
        setEdit={setEdit}
      />
    </div>
  );
};

interface DatasetListOptionsProps {
  dataset: Dataset;
  onDeleted?: (id: string) => void;
  setEdit: (v: boolean) => void;
}

export const DatasetListOptions = ({
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
      toast.success(messages.dataset.delete.success(dataset.name), {
        position: 'bottom-right',
      });
      void queryClient.invalidateQueries({ queryKey: ['datasets'] });
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
