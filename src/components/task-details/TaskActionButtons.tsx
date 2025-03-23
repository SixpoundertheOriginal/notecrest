
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useState } from 'react';

interface TaskActionButtonsProps {
  darkMode: boolean;
  onSave: () => void;
  onCancel: () => void;
  isDirty: boolean;
  isValid: boolean;
}

const TaskActionButtons = ({ 
  darkMode, 
  onSave, 
  onCancel, 
  isDirty, 
  isValid 
}: TaskActionButtonsProps) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleCancel = () => {
    if (isDirty) {
      setConfirmDialogOpen(true);
    } else {
      onCancel();
    }
  };

  const handleConfirmCancel = () => {
    setConfirmDialogOpen(false);
    onCancel();
  };

  return (
    <>
      <div className="flex justify-end space-x-2 pt-2 border-t border-dashed">
        <Button
          variant="outline"
          onClick={handleCancel}
          className={cn(
            "text-xs min-h-[44px] min-w-[44px]",
            darkMode
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
          )}
        >
          Cancel
        </Button>
        <Button
          onClick={onSave}
          disabled={!isDirty || !isValid}
          className={cn(
            "text-xs min-h-[44px] min-w-[44px] text-white",
            !isDirty || !isValid 
              ? "opacity-60 cursor-not-allowed"
              : "hover:shadow-md"
          )}
        >
          Save Changes
        </Button>
      </div>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className={darkMode ? "bg-gray-900 border-gray-800 text-white" : ""}>
          <DialogHeader>
            <DialogTitle>Discard changes?</DialogTitle>
            <DialogDescription className={darkMode ? "text-gray-400" : ""}>
              You have unsaved changes that will be lost if you continue.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setConfirmDialogOpen(false)}
              className={darkMode ? "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700" : ""}
            >
              Keep Editing
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmCancel}
            >
              Discard Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskActionButtons;
