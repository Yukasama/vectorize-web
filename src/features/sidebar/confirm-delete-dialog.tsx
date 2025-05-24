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

export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  datasetName,
  onCancel,
  onConfirm,
  open,
}) => (
  <Dialog onOpenChange={onCancel} open={open}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete dataset</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete{' '}
          <span className="font-semibold text-red-600">{datasetName}</span>?
          This action cannot be undone.
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
