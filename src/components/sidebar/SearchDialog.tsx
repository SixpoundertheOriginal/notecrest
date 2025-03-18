
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { TaskData } from '@/types/task';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

const SearchDialog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { tasks } = useTasks();
  const [searchResults, setSearchResults] = useState<TaskData[]>([]);
  const { isMobile } = useIsMobile();

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = tasks.filter(task => 
      task.title.toLowerCase().includes(query) || 
      (task.description && task.description.toLowerCase().includes(query))
    );
    
    setSearchResults(filtered);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-3 px-2 bg-blue-500/10 hover:bg-blue-500/20 transition-colors">
          <Search size={18} className="text-blue-400" />
          <span>Search tasks...</span>
          <span className="ml-auto opacity-60 text-xs">⌘K</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Search Tasks</DialogTitle>
          <DialogDescription>
            Search through your tasks by title or description
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 py-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10"
              autoFocus
            />
          </div>
          <Button 
            type="button" 
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((task) => (
                <div 
                  key={task.id} 
                  className="rounded-md border p-3 hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => {
                    console.log("Selected task:", task);
                    setIsOpen(false);
                  }}
                >
                  <div className="font-medium">{task.title}</div>
                  {task.description && (
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {task.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="py-6 text-center text-muted-foreground">
              No results found
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
