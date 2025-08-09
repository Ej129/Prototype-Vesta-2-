
import React, { useState, useEffect } from 'react';
import { NavigateTo, Screen, User } from '../types';
import { SidebarMainLayout } from '../components/Layout';
import { Header } from '../components/Header';
import { UserProfileIcon, BellIcon, BriefcaseIcon, ShieldIcon, LinkIcon, KeyIcon, MoonIcon, SunIcon, UploadCloudIcon, PaletteIcon, PlusIcon, TrashIcon } from '../components/Icons';

interface SettingsScreenProps {
  navigateTo: NavigateTo;
  currentUser: User;
  onLogout: () => void;
}

const SettingsCard = ({ title, subtitle, children }: { title: string, subtitle: string, children: React.ReactNode }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-vesta-border dark:border-gray-700">
        <div className="p-6 border-b border-vesta-border dark:border-gray-700">
            <h3 className="text-lg font-bold text-vesta-primary dark:text-gray-100">{title}</h3>
            <p className="text-sm text-vesta-text-light dark:text-gray-400 mt-1">{subtitle}</p>
        </div>
        <div className="p-6 space-y-6">
            {children}
        </div>
    </div>
);

const SettingsInput = ({ label, type, id, value, onChange, placeholder }: { label: string, type: string, id: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-vesta-text dark:text-gray-300 mb-2">{label}</label>
        <input type={type} id={id} value={value} onChange={onChange} placeholder={placeholder} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-vesta-secondary bg-white dark:bg-gray-700 text-vesta-text dark:text-gray-100" />
    </div>
);

const SettingsToggle = ({ label, enabled, setEnabled }: { label: string, enabled: boolean, setEnabled: (enabled: boolean) => void }) => (
    <div className="flex items-center justify-between">
        <span className="text-vesta-text dark:text-gray-300">{label}</span>
        <button
            onClick={() => setEnabled(!enabled)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-vesta-secondary' : 'bg-gray-200 dark:bg-gray-600'}`}
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

const ProfileSettings = ({ user }: { user: User }) => {
    const [theme, setTheme] = useState(localStorage.getItem('vesta-theme') || 'light');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('vesta-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('vesta-theme', 'light');
        }
    }, [theme]);

    return (
        <div className="space-y-8">
            <SettingsCard title="Personal Information" subtitle="Update your photo and personal details here.">
                <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <UploadCloudIcon className="w-10 h-10 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                         <button className="px-4 py-2 text-sm font-semibold text-white bg-vesta-secondary rounded-lg hover:bg-opacity-90">Upload new picture</button>
                         <button className="px-4 py-2 text-sm font-semibold text-vesta-text-light dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Remove</button>
                    </div>
                </div>
                <SettingsInput label="Full Name" id="name" type="text" value={user.name} onChange={() => {}} />
                <SettingsInput label="Job Title" id="jobTitle" type="text" value="Financial Analyst" placeholder="e.g. Project Manager" onChange={() => {}} />
            </SettingsCard>

             <SettingsCard title="Password Management" subtitle="Manage your password for added security.">
                <SettingsInput label="Current Password" id="currentPassword" type="password" value="" onChange={() => {}} />
                <SettingsInput label="New Password" id="newPassword" type="password" value="" onChange={() => {}} />
                <SettingsInput label="Confirm New Password" id="confirmPassword" type="password" value="" onChange={() => {}} />
                 <div className="flex justify-end">
                    <button className="px-6 py-2 font-semibold text-white bg-vesta-primary rounded-lg hover:bg-opacity-90">Update Password</button>
                </div>
            </SettingsCard>
            
            <SettingsCard title="Appearance & Theme" subtitle="Customize how Vesta looks for you.">
                <div className="flex items-center justify-between">
                    <span className="text-vesta-text dark:text-gray-300">Theme</span>
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg p-1">
                        <button onClick={() => setTheme('light')} className={`px-3 py-1 rounded-md text-sm flex items-center ${theme === 'light' ? 'bg-vesta-secondary text-white' : 'text-vesta-text-light'}`}>
                            <SunIcon className="w-4 h-4 mr-2" /> Light
                        </button>
                         <button onClick={() => setTheme('dark')} className={`px-3 py-1 rounded-md text-sm flex items-center ${theme === 'dark' ? 'bg-vesta-secondary text-white' : 'text-vesta-text-light'}`}>
                            <MoonIcon className="w-4 h-4 mr-2" /> Dark
                        </button>
                    </div>
                </div>
                 <SettingsInput label="Language" id="language" type="text" value="English (United States)" onChange={() => {}} />
                 <SettingsInput label="Time Zone" id="timezone" type="text" value="(GMT+08:00) Manila" onChange={() => {}} />
            </SettingsCard>
        </div>
    );
};

const WorkspaceSettings = () => (
    <div className="space-y-8">
        <p className="text-sm bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 p-3 rounded-lg">These settings are workspace-wide and can only be modified by an administrator.</p>
        <SettingsCard title="User Management" subtitle="Invite new users and manage their roles.">
            <button className="flex items-center justify-center px-4 py-2 bg-vesta-primary text-white font-bold rounded-lg hover:bg-opacity-90">
                <PlusIcon className="w-5 h-5 mr-2" /> Invite User
            </button>
            <table className="w-full text-left">
              <thead className="border-b border-vesta-border dark:border-gray-700">
                <tr>
                  <th className="p-2 font-semibold text-vesta-text-light dark:text-gray-400 text-sm">Name</th>
                  <th className="p-2 font-semibold text-vesta-text-light dark:text-gray-400 text-sm">Role</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-vesta-border dark:border-gray-700">
                    <td className="p-2 text-vesta-text dark:text-gray-300">John Doe (You)</td>
                    <td className="p-2 text-vesta-text-light dark:text-gray-400">Administrator</td>
                    <td className="p-2 text-right"><TrashIcon className="w-5 h-5 text-gray-400 hover:text-vesta-accent-critical cursor-pointer" /></td>
                </tr>
                 <tr className="border-b border-vesta-border dark:border-gray-700">
                    <td className="p-2 text-vesta-text dark:text-gray-300">Jane Smith</td>
                    <td className="p-2 text-vesta-text-light dark:text-gray-400">Legal Reviewer</td>
                    <td className="p-2 text-right"><TrashIcon className="w-5 h-5 text-gray-400 hover:text-vesta-accent-critical cursor-pointer" /></td>
                </tr>
              </tbody>
            </table>
        </SettingsCard>
        <SettingsCard title="Custom Risk Models" subtitle="Upload internal policy documents for analysis.">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 cursor-pointer bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition block text-center">
                <UploadCloudIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-vesta-text-light dark:text-gray-400 font-semibold">Drag & Drop Your Policy File Here</p>
            </div>
        </SettingsCard>
        <SettingsCard title="Report Branding" subtitle="Customize exported reports with your company's branding.">
             <div className="flex items-center space-x-4">
                <PaletteIcon className="w-6 h-6 text-vesta-secondary" />
                <p className="font-medium text-vesta-text dark:text-gray-300">Company Logo & Primary Color</p>
             </div>
             {/* Simple UI for branding */}
        </SettingsCard>
    </div>
);

const NotificationsSettings = () => {
    const [email, setEmail] = useState(true);
    const [inApp, setInApp] = useState(true);
    const [slack, setSlack] = useState(false);
    return (
        <div className="space-y-8">
            <SettingsCard title="Notification Channels" subtitle="Choose how you receive alerts from Vesta.">
                <SettingsToggle label="Email Notifications" enabled={email} setEnabled={setEmail} />
                <SettingsToggle label="In-App Notifications" enabled={inApp} setEnabled={setInApp} />
                <SettingsToggle label="Slack Integration" enabled={slack} setEnabled={setSlack} />
            </SettingsCard>
            <SettingsCard title="Event Alerts" subtitle="Select which events you want to be notified about.">
                <SettingsToggle label="When my document analysis is complete" enabled={true} setEnabled={() => {}} />
                <SettingsToggle label="When a team member assigns a finding to me" enabled={true} setEnabled={() => {}} />
                <SettingsToggle label="When a comment is made on my report" enabled={false} setEnabled={() => {}} />
                <SettingsToggle label="A weekly summary of all unresolved critical issues" enabled={true} setEnabled={() => {}} />
            </SettingsCard>
        </div>
    );
};

const SecuritySettings = () => (
    <div className="space-y-8">
        <SettingsCard title="Two-Factor Authentication (2FA)" subtitle="Add an extra layer of security to your account.">
            <button className="px-4 py-2 font-semibold text-white bg-vesta-accent-success rounded-lg hover:bg-opacity-90">Enable 2FA</button>
        </SettingsCard>
        <SettingsCard title="Active Sessions" subtitle="You are currently logged in on these devices.">
             <div className="flex items-center justify-between text-vesta-text dark:text-gray-300">
                 <p>Chrome on Windows - Manila, PH <span className="text-vesta-accent-success font-semibold">(current session)</span></p>
                 <button className="text-sm font-medium text-vesta-secondary hover:underline">Log out</button>
             </div>
        </SettingsCard>
        <SettingsCard title="Data Retention Policy (Admin)" subtitle="Define how long data is stored on Vesta's servers.">
             <p className="text-sm bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 p-3 rounded-lg">This is an administrator-only setting.</p>
             <SettingsInput label="Retention Period (in days)" id="retention" type="number" value="365" onChange={() => {}} />
        </SettingsCard>
    </div>
);

const IntegrationsSettings = () => (
    <div className="space-y-8">
        <SettingsCard title="Project Management" subtitle="Connect to your team's project management tool.">
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-vesta-border dark:border-gray-700 rounded-lg">
                    <span className="font-bold text-lg">Jira</span>
                    <button className="px-4 py-2 font-semibold text-white bg-vesta-secondary rounded-lg hover:bg-opacity-90">Connect</button>
                </div>
                <div className="flex items-center justify-between p-4 border border-vesta-border dark:border-gray-700 rounded-lg">
                    <span className="font-bold text-lg">Asana</span>
                    <button className="px-4 py-2 font-semibold text-white bg-vesta-secondary rounded-lg hover:bg-opacity-90">Connect</button>
                </div>
                 <div className="flex items-center justify-between p-4 border border-vesta-border dark:border-gray-700 rounded-lg">
                    <span className="font-bold text-lg">Trello</span>
                    <button className="px-4 py-2 font-semibold text-gray-500 bg-gray-200 dark:bg-gray-600 dark:text-gray-300 rounded-lg cursor-not-allowed">Coming Soon</button>
                </div>
            </div>
        </SettingsCard>
         <SettingsCard title="API Access (Admin)" subtitle="Generate API keys for custom integrations.">
             <p className="text-sm bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 p-3 rounded-lg">This is an administrator-only setting.</p>
             <div className="flex items-center space-x-4">
                <KeyIcon className="w-6 h-6 text-vesta-secondary" />
                <p className="font-medium text-vesta-text dark:text-gray-300">Manage your API keys</p>
             </div>
             <button className="px-4 py-2 font-semibold text-white bg-vesta-primary rounded-lg hover:bg-opacity-90">Generate New Key</button>
        </SettingsCard>
    </div>
);


const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigateTo, currentUser, onLogout }) => {
    const [activeTab, setActiveTab] = useState('profile');

    const TABS = [
        { id: 'profile', label: 'Profile', icon: <UserProfileIcon className="w-5 h-5 mr-3" /> },
        { id: 'workspace', label: 'Workspace', icon: <BriefcaseIcon className="w-5 h-5 mr-3" /> },
        { id: 'notifications', label: 'Notifications', icon: <BellIcon className="w-5 h-5 mr-3" /> },
        { id: 'security', label: 'Security', icon: <ShieldIcon className="w-5 h-5 mr-3" /> },
        { id: 'integrations', label: 'Integrations', icon: <LinkIcon className="w-5 h-5 mr-3" /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'profile': return <ProfileSettings user={currentUser} />;
            case 'workspace': return <WorkspaceSettings />;
            case 'notifications': return <NotificationsSettings />;
            case 'security': return <SecuritySettings />;
            case 'integrations': return <IntegrationsSettings />;
            default: return <ProfileSettings user={currentUser} />;
        }
    };

    return (
        <SidebarMainLayout navigateTo={navigateTo} activeScreen={Screen.Settings} currentUser={currentUser} onLogout={onLogout}>
            <Header title="Settings" />
            <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <nav className="space-y-1">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                        activeTab === tab.id
                                            ? 'bg-vesta-secondary/10 dark:bg-vesta-secondary/20 text-vesta-secondary'
                                            : 'text-vesta-text-light dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </aside>
                    <div className="flex-1">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </SidebarMainLayout>
    );
};

export default SettingsScreen;
