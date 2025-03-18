
import React from 'react';
import { Calendar } from 'lucide-react';
import SidebarNavItem from '../sidebar/SidebarNavItem';

const CalendarNavItem = () => {
  return (
    <SidebarNavItem
      to="/settings/calendar"
      icon={<Calendar size={18} />}
      label="Calendar"
    />
  );
};

export default CalendarNavItem;
