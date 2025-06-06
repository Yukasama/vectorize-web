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
import type { Model } from '../services/model-service';
import { deleteModel } from '../services/model-service';
import { ConfirmDeleteDialog } from './confirm-delete-dialog';

interface ModelListItemProps {
  model: Model;
  onDeleted?: (id: string) => void;
  onDetails?: (model_tag: string) => void;
}

// ModelListItem displays a single model entry with options menu
export const ModelListItem = ({
  model,
  onDeleted,
  onDetails,
}: ModelListItemProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [edit, setEdit] = useState(false);
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
      await import('../services/model-service').then(async (svc) => {
        await svc.updateModelName(model.id, newName.trim(), model.version);
        return true;
      });
      toast.success('Model name updated', { position: 'bottom-right' });
      setEdit(false);
    } catch {
      toast.error(messages.model.general.unknownError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="hover:bg-muted/70 flex h-8 cursor-pointer items-center justify-between rounded px-2 text-sm"
      onClick={() => {
        if (!deleteDialogOpen && !recentlyDeleted.current) {
          onDetails?.(model.model_tag);
        }
      }}
      onKeyDown={(e) => {
        if (
          (e.key === 'Enter' || e.key === ' ') &&
          !deleteDialogOpen &&
          !recentlyDeleted.current
        ) {
          onDetails?.(model.model_tag);
        }
      }}
      role="button"
      tabIndex={0}
    >
      {/* Name only, no inline edit */}
      <span className="flex items-center gap-2">
        <span>{model.name}</span>
      </span>
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
        <DropdownMenuContent>
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

      {/* Rename Dialog */}
      {edit && (
        <div className="absolute top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/30">
          <div className="flex min-w-[260px] flex-col gap-2 rounded bg-white p-4 shadow-lg">
            <label className="text-sm font-medium" htmlFor="model-rename-input">
              Rename model
            </label>
            <input
              autoFocus
              className="rounded border px-2 py-1 text-sm"
              disabled={saving}
              id="model-rename-input"
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  await handleSave();
                }
                if (e.key === 'Escape') {
                  setEdit(false);
                  setNewName(model.name);
                }
              }}
              value={newName}
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                className="bg-muted rounded px-3 py-1 text-xs hover:bg-gray-200"
                disabled={saving}
                onClick={() => {
                  setEdit(false);
                  setNewName(model.name);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-primary rounded px-3 py-1 text-xs text-white disabled:opacity-60"
                disabled={saving || !newName.trim() || newName === model.name}
                onClick={handleSave}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
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
