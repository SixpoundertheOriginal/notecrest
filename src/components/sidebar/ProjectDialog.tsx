
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { projectColorOptions } from '@/lib/projectColors';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';

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
              <ScrollArea className="h-20">
                <div className="flex flex-wrap gap-2 p-1">
                  {projectColorOptions.map(c => (
                    <button
                      key={c.value}
                      type="button"
                      className={cn(
                        "w-8 h-8 rounded-full ring-offset-2 transition-all",
                        c.class,
                        color === c.value ? "ring-2 ring-white scale-110" : "hover:scale-105"
                      )}
                      onClick={() => setColor(c.value)}
                      title={c.label}
                    />
                  ))}
                </div>
              </ScrollArea>
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
