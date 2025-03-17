
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import DatePicker from '../DatePicker';

interface TaskExpandedOptionsProps {
  description: string;
  setDescription: (value: string) => void;
  dueDate: Date | null;
  setDueDate: (date: Date | null) => void;
}

const TaskExpandedOptions = ({
  description,
  setDescription,
  dueDate,
  setDueDate
}: TaskExpandedOptionsProps) => {
  return (
    <div className="space-y-4 animate-in fade-in-50 duration-200">
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={3}
      />
      
      <div>
        <Label>Due Date</Label>
        <DatePicker date={dueDate} setDate={setDueDate} />
      </div>
    </div>
  );
};

export default TaskExpandedOptions;
