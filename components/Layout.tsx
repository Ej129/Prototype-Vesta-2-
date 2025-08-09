

import React from 'react';
import { NavigateTo, Screen, User } from '../types';
import { VestaLogo, DashboardIcon, HistoryIcon, LibraryIcon, SettingsIcon, UserProfileIcon, LogoutIcon } from './Icons';

interface NavItemProps {
  text: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ text, icon, active, onClick }) => {
  return (
    <li
      onClick={onClick}
      className={`flex items-center px-4 py-3 cursor-pointer rounded-lg transition-colors duration-200 ${
        active
          ? 'bg-black/20 text-white font-semibold'
          : 'text-gray-300 hover:bg-black/10 hover:text-white'
      }`}
    >
      <div className="w-6 h-6 mr-4">{icon}</div>
      <span className="font-medium">{text}</span>
    </li>
  );
};

interface SidebarProps {
  navigateTo: NavigateTo;
  activeScreen: Screen;
  currentUser: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ navigateTo, activeScreen, currentUser, onLogout }) => {
  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, screen: Screen.Dashboard },
    { text: 'Audit Trail', icon: <HistoryIcon />, screen: Screen.AuditTrail },
    { text: 'Knowledge Base', icon: <LibraryIcon />, screen: Screen.KnowledgeBase },
    { text: 'Settings', icon: <SettingsIcon />, screen: Screen.Settings },
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <aside className="w-64 bg-light-sidebar dark:bg-dark-sidebar text-white flex flex-col min-h-screen">
      <div 
        className="flex items-center justify-center p-6 border-b border-gray-200 dark:border-white/10 cursor-pointer"
        onClick={() => navigateTo(Screen.Dashboard)}
        aria-label="Go to Dashboard"
      >
        <VestaLogo className="w-10 h-10" />
        <h1 className="text-2xl font-bold ml-3 text-gray-800 dark:text-white">Vesta</h1>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => (
             <li
              key={item.text}
              onClick={() => navigateTo(item.screen)}
              className={`flex items-center px-4 py-3 cursor-pointer rounded-lg transition-colors duration-200 ${
                activeScreen === item.screen
                  ? 'bg-primary-blue text-white font-semibold'
                  : 'text-secondary-text-light dark:text-secondary-text-dark hover:bg-gray-200 dark:hover:bg-dark-main'
              }`}
            >
              <div className="w-6 h-6 mr-4">{item.icon}</div>
              <span className="font-medium">{item.text}</span>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-white/10 space-y-2">
          <div className="flex items-center p-2 rounded-lg">
              <div className="w-10 h-10 bg-primary-blue rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    getInitials(currentUser.name)
                  )}
              </div>
              <div className="ml-3">
                  <p className="font-semibold text-primary-text-light dark:text-primary-text-dark text-sm">{currentUser.name}</p>
                  <p className="text-secondary-text-light dark:text-secondary-text-dark text-xs">{currentUser.email}</p>
              </div>
          </div>
          <button
              onClick={onLogout}
              className="flex items-center w-full px-4 py-3 cursor-pointer rounded-lg transition-colors duration-200 text-secondary-text-light dark:text-secondary-text-dark hover:bg-gray-200 dark:hover:bg-dark-main"
          >
              <LogoutIcon className="w-6 h-6 mr-4"/>
              <span className="font-medium">Logout</span>
          </button>
      </div>
    </aside>
  );
};

interface SidebarMainLayoutProps {
  children: React.ReactNode;
  navigateTo: NavigateTo;
  activeScreen: Screen;
  currentUser: User;
  onLogout: () => void;
}

export const SidebarMainLayout: React.FC<SidebarMainLayoutProps> = ({ children, navigateTo, activeScreen, currentUser, onLogout }) => {
  return (
    <div className="flex h-screen bg-light-sidebar dark:bg-dark-sidebar">
      <Sidebar navigateTo={navigateTo} activeScreen={activeScreen} currentUser={currentUser} onLogout={onLogout} />
      <main className="flex-1 h-screen overflow-y-auto bg-light-main dark:bg-dark-main">{children}</main>
    </div>
  );
};

interface CenteredLayoutProps {
    children: React.ReactNode;
}

export const CenteredLayout: React.FC<CenteredLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-light-main dark:bg-dark-main p-4">
        {children}
    </div>
  );
};