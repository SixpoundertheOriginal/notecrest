
import React from 'react';

interface WelcomeHeaderProps {
  username?: string;
  isLoggedIn: boolean;
}

const WelcomeHeader = ({ username, isLoggedIn }: WelcomeHeaderProps) => {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-3xl font-light mb-2">
        Welcome to <span className="font-bold text-gradient">Taskify</span>
      </h2>
      <p className="text-sm text-gray-400">
        {isLoggedIn 
          ? `Manage your tasks, ${username || 'User'}`
          : "Log in to save your tasks across devices"
        }
      </p>
    </div>
  );
};

export default WelcomeHeader;
