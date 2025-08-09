
import React from 'react';
import { UserProfileIcon, ExportIcon } from './Icons';

interface HeaderProps {
  title: string;
  showUserProfile?: boolean;
  showExportButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, showUserProfile, showExportButton }) => {
  return (
    <header className="bg-white p-6 border-b border-border-color flex justify-between items-center">
      <h1 className="text-2xl font-bold text-vesta-primary">{title}</h1>
      <div className="flex items-center space-x-4">
        {showExportButton && (
          <button className="flex items-center px-4 py-2 bg-white border border-border-color rounded-lg text-vesta-text-light hover:bg-gray-50 transition">
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
