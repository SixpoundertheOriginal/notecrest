
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from '@/components/ui/sheet';
import { useToast } from '@/components/ui/use-toast';
import TaskQuickOptions from './task-creation/TaskQuickOptions';
import TaskExpandedOptions from './task-creation/TaskExpandedOptions';
import { useTaskInputNLP } from './task-creation/TaskInputNLP';

interface TaskCreationSheetProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onSubmit: (task: {
    title: string;
    description: string;
    priority: string;
    dueDate: Date | null;
  }) => void;
}

const TaskCreationSheet = ({ isOpen, onClose, onSubmit }: TaskCreationSheetProps) => {
  // State for the form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [sheetOpenState, setSheetOpenState] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Synchronize the external open state with internal state
  useEffect(() => {
    console.log('TaskCreationSheet: External isOpen changed to:', isOpen);
    if (isOpen !== sheetOpenState) {
      setSheetOpenState(isOpen);
    }
  }, [isOpen]);

  // Focus title input when sheet opens
  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      // Reduced timeout for faster focus
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Use the NLP hook
  const { handleTitleInput } = useTaskInputNLP(setTitle, setDueDate, setPriority);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('TaskCreationSheet: Form submitted');
    onSubmit({ title, description, priority, dueDate });
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setDueDate(null);
    setIsExpanded(false);
  };

  const handleCancel = () => {
    console.log('TaskCreationSheet: Canceling form');
    resetForm();
    onClose(false);
  };
  
  const handleOpenChange = (open: boolean) => {
    console.log('TaskCreationSheet: Sheet open state changing to:', open);
    setSheetOpenState(open);
    onClose(open);
    
    if (!open) {
      resetForm();
    }
  };

  return (
    <Sheet open={sheetOpenState} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="h-auto max-h-[90vh] rounded-t-xl">
        <SheetHeader>
          <SheetTitle>New Task</SheetTitle>
          <SheetDescription>Create a new task with details.</SheetDescription>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="pt-2">
          <div className="space-y-4 py-2">
            {/* Title input - always visible */}
            <div>
              <Input
                ref={titleInputRef}
                value={title}
                onChange={(e) => handleTitleInput(e.target.value)}
                placeholder="What do you need to do?"
                className="text-base py-6"
                required
                autoComplete="off"
                autoFocus
              />
            </div>
            
            {/* Quick options row and toggle */}
            <TaskQuickOptions
              priority={priority}
              setPriority={setPriority}
              setDueDate={setDueDate}
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
            />
            
            {/* Additional options - conditionally visible */}
            {isExpanded && (
              <TaskExpandedOptions
                description={description}
                setDescription={setDescription}
                dueDate={dueDate}
                setDueDate={setDueDate}
              />
            )}
          </div>
          
          <SheetFooter className="mt-4">
            <Button type="button" variant="ghost" onClick={handleCancel}>Cancel</Button>
            <Button type="submit" disabled={!title.trim()}>Create Task</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default TaskCreationSheet;
