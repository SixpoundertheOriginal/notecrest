
import React from 'react';
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface SidebarNavItemProps {
  icon: React.ElementType;
  label: string;
  to?: string;
  action?: () => void;
  isActive?: boolean;
  count?: number;
  highlight?: boolean;
}

const SidebarNavItem = ({ 
  icon: Icon, 
  label, 
  to, 
  action, 
  isActive, 
  count, 
  highlight 
}: SidebarNavItemProps) => {
  return (
    <SidebarMenuItem>
      {action ? (
        <SidebarMenuButton 
          onClick={action}
          isActive={isActive}
          tooltip={label}
          className={cn(
            highlight ? "text-red-400 hover:text-red-300" : "text-gray-100 hover:text-white", 
            "min-h-[44px] font-medium"
          )}
        >
          <Icon size={18} />
          <span>{label}</span>
          {count !== undefined && count > 0 && (
            <span className="ml-auto text-xs opacity-90 bg-white/10 px-1.5 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton 
          asChild 
          isActive={isActive}
          tooltip={label}
          className="min-h-[44px] text-gray-100 hover:text-white font-medium"
        >
          <div className="cursor-pointer">
            <Icon size={18} />
            <span>{label}</span>
            {count !== undefined && count > 0 && (
              <span className="ml-auto text-xs opacity-90 bg-white/10 px-1.5 py-0.5 rounded-full">
                {count}
              </span>
            )}
          </div>
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  );
};

export default SidebarNavItem;
