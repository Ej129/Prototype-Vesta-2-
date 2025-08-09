
import React from 'react';
import { UserProfileIcon, ExportIcon } from './Icons';

interface HeaderProps {
  title: string;
  showUserProfile?: boolean;
  showExportButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, showUserProfile, showExportButton }) => {
  return (
    <header className="bg-white dark:bg-gray-800 p-6 border-b border-vesta-border dark:border-gray-700 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-vesta-primary dark:text-vesta-secondary">{title}</h1>
      <div className="flex items-center space-x-4">
        {showExportButton && (
          <button className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-vesta-border dark:border-gray-600 rounded-lg text-vesta-text-light dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition">
            <ExportIcon className="w-5 h-5 mr-2" />
            Export
          </button>
        )}
        {showUserProfile && (
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 bg-vesta-secondary rounded-full flex items-center justify-center text-white font-bold">
               JD
             </div>
          </div>
        )}
      </div>
    </header>
  );
};