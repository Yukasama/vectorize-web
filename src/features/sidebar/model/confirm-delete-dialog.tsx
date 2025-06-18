import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import * as React from 'react';

interface ConfirmDeleteDialogProps {
  modelName: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  open?: boolean;
}

/**
 * Dialog component to confirm deletion of a model.
 */
export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  modelName,
  onCancel,
  onConfirm,
  open,
}) => (
  <Dialog onOpenChange={onCancel} open={open}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete model</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete{' '}
          <span className="font-semibold text-red-600">{modelName}</span>? This
          action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost">Cancel</Button>
        </DialogClose>
        <Button onClick={onConfirm} variant="destructive">
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
