
import React from 'react';
import { User } from 'lucide-react';
import { SidebarHeader } from "@/components/ui/sidebar";

interface SidebarUserHeaderProps {
  username: string;
}

const SidebarUserHeader = ({ username }: SidebarUserHeaderProps) => {
  return (
    <SidebarHeader className="px-3 py-2">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User size={16} className="text-blue-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{username}</span>
          <span className="text-xs text-muted-foreground">Free Plan</span>
        </div>
      </div>
    </SidebarHeader>
  );
};

export default SidebarUserHeader;
