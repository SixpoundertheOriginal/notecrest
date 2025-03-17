
import React from 'react';
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

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
          className={highlight ? "text-red-400 hover:text-red-300" : ""}
        >
          <Icon size={18} />
          <span>{label}</span>
          {count !== undefined && count > 0 && (
            <span className="ml-auto text-xs opacity-60">{count}</span>
          )}
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton 
          asChild 
          isActive={isActive}
          tooltip={label}
        >
          <div className="cursor-pointer">
            <Icon size={18} />
            <span>{label}</span>
            {count !== undefined && count > 0 && (
              <span className="ml-auto text-xs opacity-60">{count}</span>
            )}
          </div>
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  );
};

export default SidebarNavItem;
