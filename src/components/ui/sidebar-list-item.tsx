import { MoreVertical } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

interface SidebarListItemProps {
  confirmDeleteDialog: React.ReactElement<{
    datasetName?: string;
    modelName?: string;
    onCancel?: () => void;
    onConfirm?: () => void;
    open?: boolean;
  }>;
  deleteLabel?: string;
  name: string;
  onDelete: () => Promise<void>;
  onRename: (newName: string) => Promise<void>;
  onTrain?: () => void;
  renameLabel?: string;
  trainLabel?: string;
  version?: number;
}

export const SidebarListItem = ({
  confirmDeleteDialog,
  deleteLabel = 'Delete',
  name,
  onDelete,
  onRename,
  onTrain,
  renameLabel = 'Rename',
  trainLabel = 'Train',
}: SidebarListItemProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [newName, setNewName] = useState(name);
  const [saving, setSaving] = useState(false);

  const handleDelete = async () => {
    await onDelete();
    setDeleteDialogOpen(false);
  };

  const handleSave = async () => {
    if (!newName.trim() || newName === name) {
      setEdit(false);
      setNewName(name);
      return;
    }
    setSaving(true);
    try {
      await onRename(newName.trim());
      setEdit(false);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (edit) {
      inputRef.current?.select();
    }
  }, [edit]);

  return {
    confirmDeleteDialog: React.cloneElement(confirmDeleteDialog, {
      onCancel: () => setDeleteDialogOpen(false),
      onConfirm: () => {
        void handleDelete();
      },
      open: deleteDialogOpen,
    }),
    nameArea: (
      <SidebarListItemName
        edit={edit}
        handleSave={handleSave}
        inputRef={inputRef as React.RefObject<HTMLInputElement>}
        name={name}
        newName={newName}
        saving={saving}
        setEdit={setEdit}
        setNewName={setNewName}
      />
    ),
    optionsButton: (
      <SidebarListItemOptions
        deleteLabel={deleteLabel}
        onTrain={onTrain}
        renameLabel={renameLabel}
        setDeleteDialogOpen={setDeleteDialogOpen}
        setEdit={setEdit}
        trainLabel={trainLabel}
      />
    ),
  };
};

export const SidebarListItemName = ({
  edit,
  handleSave,
  inputRef,
  name,
  newName,
  saving,
  setEdit,
  setNewName,
}: {
  edit: boolean;
  handleSave: () => Promise<void>;
  inputRef: React.RefObject<HTMLInputElement>;
  name: string;
  newName: string;
  saving: boolean;
  setEdit: (v: boolean) => void;
  setNewName: (v: string) => void;
}) => {
  return (
    <span
      className={
        (edit
          ? 'bg-muted/70 flex items-center gap-2 rounded'
          : 'hover:bg-muted/70 flex items-center gap-2 rounded transition-colors duration-100') +
        ' h-7 min-h-0 min-w-0 flex-1 pr-2'
      }
      style={{ maxWidth: '100%', minWidth: 0 }}
    >
      {edit ? (
        <div className="relative flex w-full items-center">
          <input
            className="w-full max-w-full min-w-0 rounded border px-1 py-0.5 pr-8 text-sm"
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
                setNewName(name);
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
        <span
          className={
            'text-sidebar-foreground block w-full truncate text-sm font-normal'
          }
          style={{ maxWidth: 'calc(100% - 0.5rem)', minWidth: 0 }}
        >
          {name}
        </span>
      )}
    </span>
  );
};

export const SidebarListItemOptions = ({
  deleteLabel,
  onTrain,
  renameLabel,
  setDeleteDialogOpen,
  setEdit,
  trainLabel,
}: {
  deleteLabel?: string;
  onTrain?: () => void;
  renameLabel?: string;
  setDeleteDialogOpen: (v: boolean) => void;
  setEdit: (v: boolean) => void;
  trainLabel?: string;
}) => (
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
      {onTrain && (
        <DropdownMenuItem onClick={onTrain}>
          {trainLabel ?? 'Train'}
        </DropdownMenuItem>
      )}
      <DropdownMenuItem onClick={() => setEdit(true)}>
        {renameLabel}
      </DropdownMenuItem>
      <DropdownMenuItem
        className="text-red-600 focus:text-red-600"
        onClick={(e) => {
          e.stopPropagation();
          setDeleteDialogOpen(true);
        }}
      >
        {deleteLabel}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
