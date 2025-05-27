'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  fetchModelById,
  Model,
  updateModelName,
} from '@/features/sidebar/services/model-service';
import { Pencil, Save } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Props {
  modelId: string | undefined;
  onClose: () => void;
  open: boolean;
}

export const ModelDetailsDialog: React.FC<Props> = ({
  modelId,
  onClose,
  open,
}) => {
  const [model, setModel] = useState<Model | null>();
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && modelId) {
      setLoading(true);
      setEdit(false);
      void (async () => {
        const m = await fetchModelById(modelId);
        setModel(m);
        setNewName(m?.name ?? '');
        setLoading(false);
      })();
    }
  }, [open, modelId]);

  const handleSave = async () => {
    if (!model || !newName.trim()) {
      return;
    }
    setSaving(true);
    try {
      await updateModelName(model.id, newName.trim(), model.version);
      const updated = await fetchModelById(model.model_tag);
      setModel(updated);
      setEdit(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog onOpenChange={onClose} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Model Details</DialogTitle>
          <DialogDescription>{loading && 'Loading data...'}</DialogDescription>
          {!loading && model && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                {edit ? (
                  <>
                    <Input
                      className="w-auto"
                      disabled={saving}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          void handleSave();
                        }
                      }}
                      value={newName}
                    />
                    <Button
                      aria-label="Save"
                      disabled={saving}
                      onClick={handleSave}
                      size="icon"
                      variant="ghost"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <span>
                      <b>Name:</b> {model.name}
                    </span>
                    <Button
                      aria-label="Edit"
                      onClick={() => setEdit(true)}
                      size="icon"
                      variant="ghost"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              <div>
                <b>ID:</b> {model.id}
              </div>
              <div>
                <b>Tag:</b> {model.model_tag}
              </div>
              <div>
                <b>Source:</b> {model.source}
              </div>
              <div>
                <b>Version:</b> {model.version}
              </div>
              <div>
                <b>Created at:</b> {new Date(model.created_at).toLocaleString()}
              </div>
              <div>
                <b>Updated at:</b> {new Date(model.updated_at).toLocaleString()}
              </div>
            </div>
          )}
          {!loading && !model && <div>No data found.</div>}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
