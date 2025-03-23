
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { TaskData, SubTask } from '@/types/task';
import TaskDetailsHeader from './task-details/TaskDetailsHeader';
import TaskBasicFields from './task-details/TaskBasicFields';
import TaskMetaFields from './task-details/TaskMetaFields';
import TaskStatusField from './task-details/TaskStatusField';
import SubtasksSection from './task-details/SubtasksSection';
import TaskActionButtons from './task-details/TaskActionButtons';
import { toast } from 'sonner';

interface TaskDetailsProps {
  task: TaskData;
  darkMode: boolean;
  onTaskUpdate?: (updatedTask: TaskData) => Promise<boolean>;
  onClose?: () => void;
}

const TaskDetails = ({ task, darkMode, onTaskUpdate, onClose }: TaskDetailsProps) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState(task.priority);
  const [status, setStatus] = useState(task.status);
  const [dueDate, setDueDate] = useState<string>('2025-03-08');
  const [subtasks, setSubtasks] = useState<SubTask[]>(task.subtasks || []);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || '');
    setPriority(task.priority);
    setStatus(task.status);
    setSubtasks(task.subtasks || []);
    setIsDirty(false);
    setValidationErrors({});
    setIsSaving(false);
  }, [task]);

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!title.trim()) {
      errors.title = 'Title is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSubtask = (title: string) => {
    const newSubtask: SubTask = {
      id: `subtask-${Date.now()}`,
      title: title,
      completed: false
    };
    
    const updatedSubtasks = [...subtasks, newSubtask];
    setSubtasks(updatedSubtasks);
    setIsDirty(true);
  };

  const toggleSubtaskCompletion = (id: string) => {
    const updatedSubtasks = subtasks.map(subtask => 
      subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask
    );
    
    setSubtasks(updatedSubtasks);
    setIsDirty(true);
  };

  const deleteSubtask = (id: string) => {
    const updatedSubtasks = subtasks.filter(subtask => subtask.id !== id);
    setSubtasks(updatedSubtasks);
    setIsDirty(true);
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description || '');
    setPriority(task.priority);
    setStatus(task.status);
    setSubtasks(task.subtasks || []);
    setIsDirty(false);
    setValidationErrors({});
    
    if (onClose) {
      onClose();
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before saving");
      return;
    }
    
    setIsSaving(true);
    
    const updatedTask: TaskData = {
      ...task,
      title,
      description,
      priority,
      status,
      subtasks,
    };
    
    if (onTaskUpdate) {
      try {
        const success = await onTaskUpdate(updatedTask);
        if (success) {
          setIsDirty(false);
        }
      } catch (error) {
        console.error("Error updating task:", error);
        toast.error("Failed to save changes. Please try again.");
      } finally {
        setIsSaving(false);
      }
    } else {
      console.warn("No onTaskUpdate handler provided to TaskDetails");
      toast.error("Could not save changes");
      setIsSaving(false);
    }
  };

  const isFormValid = Object.keys(validationErrors).length === 0;

  const getPriorityColor = () => {
    switch (priority) {
      case 'High': return 'from-red-500/20 to-transparent';
      case 'Medium': return 'from-yellow-500/20 to-transparent';
      default: return 'from-blue-500/20 to-transparent';
    }
  };

  return (
    <div 
      className={cn(
        "mt-4 p-4 rounded-xl text-sm transition-all duration-300 origin-top animate-expand overflow-hidden relative",
        darkMode 
          ? 'bg-gray-900/40 backdrop-blur-md border border-gray-800/70' 
          : 'bg-white/40 backdrop-blur-md border border-gray-200/50'
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -bottom-8 -right-8 w-16 h-16 rounded-full bg-gradient-to-tl ${getPriorityColor()} opacity-40 blur-xl`}></div>
        <div className="absolute top-1/4 right-1/4 w-0.5 h-0.5 bg-white/70 rounded-full"></div>
        <div className="absolute bottom-1/3 left-1/5 w-0.5 h-0.5 bg-white/60 rounded-full"></div>
        <div className="absolute top-2/3 right-1/3 w-0.5 h-0.5 bg-white/50 rounded-full"></div>
      </div>
      
      <div className="relative z-10">
        <TaskDetailsHeader darkMode={darkMode} />
        
        <div className="space-y-4">
          <TaskBasicFields 
            task={{...task, title, description}} 
            darkMode={darkMode} 
            onTitleChange={(value) => { 
              setTitle(value); 
              setIsDirty(true); 
              if (value.trim()) {
                setValidationErrors({...validationErrors, title: ''});
              }
            }}
            onDescriptionChange={(value) => { 
              setDescription(value); 
              setIsDirty(true); 
            }}
            validationErrors={validationErrors}
          />
          
          <TaskMetaFields 
            task={{...task, priority}} 
            darkMode={darkMode} 
            onPriorityChange={(value) => { 
              setPriority(value as 'High' | 'Medium' | 'Low'); 
              setIsDirty(true); 
            }}
            onDueDateChange={(value) => { 
              setDueDate(value); 
              setIsDirty(true); 
            }}
          />
          
          <TaskStatusField 
            task={{...task, status}} 
            darkMode={darkMode} 
            onStatusChange={(value) => { 
              setStatus(value as 'Todo' | 'In Progress' | 'Completed'); 
              setIsDirty(true); 
            }}
          />
          
          <SubtasksSection
            subtasks={subtasks}
            toggleSubtaskCompletion={toggleSubtaskCompletion}
            deleteSubtask={deleteSubtask}
            onAddSubtask={handleAddSubtask}
            darkMode={darkMode}
          />

          <TaskActionButtons 
            darkMode={darkMode} 
            onSave={handleSave}
            onCancel={handleCancel}
            isDirty={isDirty}
            isValid={isFormValid}
            isSaving={isSaving}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
