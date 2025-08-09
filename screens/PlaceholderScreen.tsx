
import React from 'react';
import { NavigateTo, Screen, User } from '../types';
import { SidebarMainLayout } from '../components/Layout';
import { Header } from '../components/Header';

interface PlaceholderScreenProps {
  navigateTo: NavigateTo;
  activeScreen: Screen;
  title: string;
  currentUser: User;
  onLogout: () => void;
}

const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ navigateTo, activeScreen, title, currentUser, onLogout }) => {
  return (
    <SidebarMainLayout navigateTo={navigateTo} activeScreen={activeScreen} currentUser={currentUser} onLogout={onLogout}>
      <Header title={title} />
      <div className="p-8">
        <div className="bg-white dark:bg-gray-800 p-20 rounded-lg shadow-md text-center border border-vesta-border dark:border-gray-700">
          <h2 className="text-2xl font-bold text-vesta-primary dark:text-gray-200">Coming Soon</h2>
          <p className="mt-4 text-vesta-text-light dark:text-gray-400">
            The "{title}" feature is currently under development.
          </p>
        </div>
      </div>
    </SidebarMainLayout>
  );
};

export default PlaceholderScreen;