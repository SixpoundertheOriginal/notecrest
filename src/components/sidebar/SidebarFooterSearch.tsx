
import React from 'react';
import { SidebarFooter } from "@/components/ui/sidebar";
import SearchDialog from './SearchDialog';

const SidebarFooterSearch = () => {
  return (
    <SidebarFooter className="border-t border-white/5">
      <div className="p-2">
        <SearchDialog />
      </div>
    </SidebarFooter>
  );
};

export default SidebarFooterSearch;
