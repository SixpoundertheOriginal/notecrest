
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
  
  // Internal open state to ensure we have full control
  const [internalOpen, setInternalOpen] = useState(false);
  
  const titleInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Explicitly log the props and state for debugging
  useEffect(() => {
    console.log(`TaskCreationSheet: Props isOpen=${isOpen}, internalOpen=${internalOpen}`);
  }, [isOpen, internalOpen]);

  // Synchronize the external and internal state
  useEffect(() => {
    console.log('TaskCreationSheet: External isOpen changed to:', isOpen);
    
    // Important: only update internal state if it differs from external state
    if (isOpen !== internalOpen) {
      console.log('TaskCreationSheet: Updating internal open state to match props:', isOpen);
      setInternalOpen(isOpen);
    }
  }, [isOpen, internalOpen]);

  // Focus title input when sheet opens with a delay to ensure DOM is ready
  useEffect(() => {
    if (internalOpen && titleInputRef.current) {
      console.log('TaskCreationSheet: Sheet opened, focusing input after delay');
      const timer = setTimeout(() => {
        titleInputRef.current?.focus();
        console.log('TaskCreationSheet: Input focused');
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [internalOpen]);

  // Use the NLP hook
  const { handleTitleInput } = useTaskInputNLP(setTitle, setDueDate, setPriority);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('TaskCreationSheet: Form submitted with data:', { title, description, priority, dueDate });
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
    handleSheetOpenChange(false);
  };
  
  const handleSheetOpenChange = (open: boolean) => {
    console.log('TaskCreationSheet: handleSheetOpenChange called with:', open);
    
    // Update internal state first
    setInternalOpen(open);
    
    // Then notify parent component
    console.log('TaskCreationSheet: Calling onClose with:', open);
    onClose(open);
    
    // Reset form if closing
    if (!open) {
      console.log('TaskCreationSheet: Sheet closing, resetting form');
      resetForm();
    }
  };

  return (
    <Sheet 
      open={internalOpen} 
      onOpenChange={handleSheetOpenChange}
    >
      <SheetContent side="bottom" className="h-auto max-h-[90vh] rounded-t-xl">
        <SheetHeader>
          <SheetTitle>New Task</SheetTitle>
          <SheetDescription>
            Create a new task with title, priority, and due date.
          </SheetDescription>
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
