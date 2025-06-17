import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { messages } from '@/lib/messages';
import { MoreVertical } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import type { Model } from '../services/model-service';
import { deleteModel, updateModelName } from '../services/model-service';
import { ConfirmDeleteDialog } from './confirm-delete-dialog';

interface ModelListItemProps {
  model: Model;
  onDeleted?: (id: string) => void;
  onDetails?: (model_tag: string) => void;
}

// ModelListItem displays a single model entry with options menu
export const ModelListItem = ({
  hideName,
  model,
  onDeleted,
}: ModelListItemProps & { hideName?: boolean }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [newName, setNewName] = useState(model.name);
  const [saving, setSaving] = useState(false);
  const recentlyDeleted = useRef(false);

  // Handles model deletion and notifies parent
  const handleDelete = async () => {
    const success = await deleteModel(model.id);
    if (success) {
      recentlyDeleted.current = true;
      setDeleteDialogOpen(false);
      toast.success(messages.model.delete.success(model.name), {
        position: 'bottom-right',
      });
      onDeleted?.(model.id);
      setTimeout(() => {
        recentlyDeleted.current = false;
      }, 100);
    } else {
      toast.error(messages.model.delete.error);
    }
  };

  // Handles model name update
  const handleSave = async () => {
    if (!newName.trim() || newName === model.name) {
      setEdit(false);
      setNewName(model.name);
      return;
    }
    setSaving(true);
    try {
      await updateModelName(model.id, newName.trim(), model.version);
      toast.success('Model name updated', { position: 'bottom-right' });
      setEdit(false);
    } catch {
      toast.error(messages.model.general.unknownError);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (edit) {
      inputRef.current?.focus();
    }
  }, [edit]);

  return (
    <div className="hover:bg-muted/70 flex h-8 items-center justify-between rounded px-2 text-sm">
      {!hideName && (
        <span className="group flex items-center gap-2">
          {edit ? (
            <div className="relative flex w-full items-center">
              <input
                className="w-32 rounded border px-1 py-0.5 pr-8 text-sm"
                disabled={saving}
                onBlur={handleSave}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (!saving) {
                      await handleSave();
                    }
                  }
                  if (e.key === 'Escape') {
                    setEdit(false);
                    setNewName(model.name);
                  }
                }}
                ref={inputRef}
                value={newName}
              />
              <button
                aria-label="Save"
                className="text-muted-foreground hover:text-primary absolute top-1/2 right-1 -translate-y-1/2 p-1"
                disabled={saving}
                onClick={handleSave}
                tabIndex={-1}
                type="button"
              >
                {/* Floppy Disk Icon */}
                <svg
                  fill="none"
                  height="16"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4z" />
                  <path d="M17 3v4H7V3" />
                  <rect height="4" rx="1" width="6" x="9" y="13" />
                </svg>
              </button>
            </div>
          ) : (
            <span>{model.name}</span>
          )}
        </span>
      )}
      {/* Dropdown menu for model actions */}
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
        <DropdownMenuContent align="start" side="right">
          <DropdownMenuItem onClick={() => setEdit(true)}>
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert(`Train ${model.name}`)}>
            Train
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert(`Evaluate ${model.name}`)}>
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
        modelName={model.name}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        open={deleteDialogOpen}
      />
    </div>
  );
};
