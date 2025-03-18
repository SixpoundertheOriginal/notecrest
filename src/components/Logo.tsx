
import React from 'react';
import { CheckSquare } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2 font-medium">
      <CheckSquare className="h-5 w-5 text-primary" />
      <span className="text-lg">Taskify</span>
    </div>
  );
};

export default Logo;
