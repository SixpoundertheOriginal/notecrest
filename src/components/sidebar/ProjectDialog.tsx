
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface ProjectDialogProps {
  onCreateProject: (data: { name: string, color: string }) => void;
}

const ProjectDialog = ({ onCreateProject }: ProjectDialogProps) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('blue');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreateProject({ name, color });
      setName('');
    }
  };
  
  const colors = [
    { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
    { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
    { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
    { value: 'green', label: 'Green', class: 'bg-green-500' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
  ];
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Plus size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create new project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Project name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Select color
              </label>
              <div className="flex gap-2">
                {colors.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    className={cn(
                      "w-6 h-6 rounded-full ring-offset-2",
                      c.class,
                      color === c.value && "ring-2 ring-white"
                    )}
                    onClick={() => setColor(c.value)}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" disabled={!name.trim()}>Create</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;
