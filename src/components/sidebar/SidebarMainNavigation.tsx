
import React from 'react';
import { SidebarGroup, SidebarGroupContent, SidebarMenu } from "@/components/ui/sidebar";
import SidebarNavItem from './SidebarNavItem';

interface NavItem {
  icon: React.ElementType;
  label: string;
  action?: () => void;
  isActive?: boolean;
  highlight?: boolean;
  component?: React.ReactNode;
}

interface SidebarMainNavigationProps {
  navItems: NavItem[];
}

const SidebarMainNavigation = ({ navItems }: SidebarMainNavigationProps) => {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {navItems.map((item, index) => (
            <SidebarNavItem key={item.label} {...item} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarMainNavigation;
