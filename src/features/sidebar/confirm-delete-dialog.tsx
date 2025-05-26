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
import React from 'react';

interface ConfirmDeleteDialogProps {
  datasetName: string;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
}

/**
 * Dialog component to confirm deletion of a dataset.
 */
export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  datasetName,
  onCancel,
  onConfirm,
  open,
}) => (
  <Dialog onOpenChange={onCancel} open={open}>
    <DialogContent>
      <DialogHeader>
        {/* Dialog title */}
        <DialogTitle>Delete dataset</DialogTitle>
        {/* Dialog description with warning */}
        <DialogDescription>
          Are you sure you want to delete{' '}
          <span className="font-semibold text-red-600">{datasetName}</span>?
          This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        {/* Cancel button */}
        <DialogClose asChild>
          <Button variant="ghost">Cancel</Button>
        </DialogClose>
        {/* Confirm delete button */}
        <Button onClick={onConfirm} variant="destructive">
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
