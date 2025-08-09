

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavigateTo, Screen, User, WorkspaceUser, UserRole } from '../types';
import { SidebarMainLayout } from '../components/Layout';
import { Header } from '../components/Header';
import { UserProfileIcon, BellIcon, BriefcaseIcon, ShieldIcon, LinkIcon, KeyIcon, MoonIcon, SunIcon, UploadCloudIcon, PaletteIcon, PlusIcon, TrashIcon } from '../components/Icons';
import InviteUserModal from '../components/InviteUserModal';


interface SettingsScreenProps {
  navigateTo: NavigateTo;
  currentUser: User;
  onLogout: () => void;
}

const SettingsCard = ({ title, subtitle, children, footer }: { title: string, subtitle: string, children: React.ReactNode, footer?: React.ReactNode }) => (
    <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-sm border border-border-light dark:border-border-dark">
        <div className="p-6">
            <h3 className="text-lg font-bold text-primary-text-light dark:text-primary-text-dark">{title}</h3>
            <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark mt-1">{subtitle}</p>
        </div>
        <div className="p-6 pt-0 space-y-6">
            {children}
        </div>
        {footer && (
          <div className="bg-gray-50 dark:bg-dark-main px-6 py-4 rounded-b-lg border-t border-border-light dark:border-border-dark text-right">
              {footer}
          </div>
        )}
    </div>
);

const SettingsInput = ({ label, type, id, value, onChange, placeholder, disabled = false }: { label: string, type: string, id: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string, disabled?: boolean }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-primary-text-light dark:text-primary-text-dark mb-2">{label}</label>
        <input type={type} id={id} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue bg-light-card dark:bg-dark-card text-primary-text-light dark:text-primary-text-dark disabled:bg-gray-100 dark:disabled:bg-gray-800" />
    </div>
);

const SettingsSelect = ({ label, id, value, onChange, children }: { label: string, id: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, children: React.ReactNode }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-primary-text-light dark:text-primary-text-dark mb-2">{label}</label>
        <select id={id} value={value} onChange={onChange} className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue bg-light-card dark:bg-dark-card text-primary-text-light dark:text-primary-text-dark appearance-none bg-no-repeat" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em'}}>
            {children}
        </select>
    </div>
);


const SettingsToggle = ({ label, enabled, setEnabled }: { label: string, enabled: boolean, setEnabled: (enabled: boolean) => void }) => (
    <div className="flex items-center justify-between">
        <span className="text-primary-text-light dark:text-primary-text-dark">{label}</span>
        <button
            onClick={() => setEnabled(!enabled)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-primary-blue' : 'bg-gray-200 dark:bg-gray-600'}`}
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

const ProfileSettings = ({ user }: { user: User }) => {
    const [theme, setTheme] = useState(localStorage.getItem('vesta-theme') || 'light');
    const [name, setName] = useState(user.name);
    const [jobTitle, setJobTitle] = useState('Financial Analyst');
    const [language, setLanguage] = useState('en-US');
    const [timezone, setTimezone] = useState('Asia/Manila');
    const [profilePic, setProfilePic] = useState<string | null>(user.avatar || null);
    const profilePicInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('vesta-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('vesta-theme', 'light');
        }
    }, [theme]);
    
    const handlePictureUpload = () => profilePicInputRef.current?.click();
    
    const onProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setProfilePic(event.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-8">
            <SettingsCard title="Personal Information" subtitle="Update your photo and personal details here.">
                <input type="file" accept="image/*" ref={profilePicInputRef} onChange={onProfilePicChange} className="hidden" />
                <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                        {profilePic ? <img src={profilePic} alt="Profile" className="w-full h-full object-cover" /> : <UserProfileIcon className="w-12 h-12 text-gray-400" />}
                    </div>
                    <div className="space-x-2">
                         <button onClick={handlePictureUpload} className="px-4 py-2 text-sm font-semibold text-white bg-primary-blue rounded-lg hover:bg-opacity-90">Upload new picture</button>
                         <button onClick={() => setProfilePic(null)} className="px-4 py-2 text-sm font-semibold text-secondary-text-light dark:text-secondary-text-dark bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Remove</button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SettingsInput label="Full Name" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    <SettingsInput label="Job Title" id="jobTitle" type="text" value={jobTitle} placeholder="e.g. Project Manager" onChange={(e) => setJobTitle(e.target.value)} />
                </div>
            </SettingsCard>

             <SettingsCard title="Password Management" subtitle="Manage your password for added security.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SettingsInput label="New Password" id="newPassword" type="password" value="" onChange={() => {}} />
                    <SettingsInput label="Confirm New Password" id="confirmPassword" type="password" value="" onChange={() => {}} />
                </div>
                 <div className="flex justify-end">
                    <button className="px-6 py-2 font-semibold text-white bg-primary-blue rounded-lg hover:bg-opacity-90">Update Password</button>
                </div>
            </SettingsCard>
            
            <SettingsCard title="Appearance & Theme" subtitle="Customize how Vesta looks for you.">
                <div className="flex items-center justify-between">
                    <span className="text-primary-text-light dark:text-primary-text-dark">Theme</span>
                    <div className="flex items-center border border-border-light dark:border-border-dark rounded-lg p-1">
                        <button onClick={() => setTheme('light')} className={`px-3 py-1 rounded-md text-sm flex items-center ${theme === 'light' ? 'bg-primary-blue text-white' : 'text-primary-text-light dark:text-primary-text-dark'}`}>
                            <SunIcon className="w-4 h-4 mr-2" /> Light
                        </button>
                         <button onClick={() => setTheme('dark')} className={`px-3 py-1 rounded-md text-sm flex items-center ${theme === 'dark' ? 'bg-primary-blue text-white' : 'text-primary-text-light dark:text-primary-text-dark'}`}>
                            <MoonIcon className="w-4 h-4 mr-2" /> Dark
                        </button>
                    </div>
                </div>
            </SettingsCard>

             <div className="flex justify-end space-x-3">
                <button className="px-6 py-2 font-semibold text-secondary-text-light dark:text-secondary-text-dark bg-light-card dark:bg-dark-card border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-200 dark:hover:bg-dark-sidebar">Cancel</button>
                <button className="px-6 py-2 font-semibold text-white bg-primary-blue rounded-lg hover:bg-opacity-90">Save Changes</button>
            </div>
        </div>
    );
};

interface WorkspaceSettingsProps {
    users: WorkspaceUser[];
    onInviteClick: () => void;
    onDeleteUser: (id: string) => void;
    onRoleChange: (id: string, newRole: UserRole) => void;
}

const WorkspaceSettings: React.FC<WorkspaceSettingsProps> = ({ users, onInviteClick, onDeleteUser, onRoleChange }) => {
    return (
        <div className="space-y-8">
            <p className="text-sm bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 p-3 rounded-lg">These settings are workspace-wide and can only be modified by an administrator.</p>
            <SettingsCard 
              title="User Management" 
              subtitle="Invite new users and manage their roles."
              footer={
                <button onClick={onInviteClick} className="flex items-center justify-center px-4 py-2 bg-primary-blue text-white font-bold rounded-lg hover:bg-opacity-90">
                    <PlusIcon className="w-5 h-5 mr-2" /> Invite User
                </button>
              }
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="border-b border-border-light dark:border-border-dark">
                        <tr>
                          <th className="p-2 font-semibold text-secondary-text-light dark:text-secondary-text-dark text-sm">Name</th>
                          <th className="p-2 font-semibold text-secondary-text-light dark:text-secondary-text-dark text-sm">Role</th>
                          <th className="p-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => (
                             <tr key={user.id} className="border-b border-border-light dark:border-border-dark last:border-b-0">
                                <td className="p-2 text-primary-text-light dark:text-primary-text-dark">
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-xs text-secondary-text-light dark:text-secondary-text-dark">{user.email}</p>
                                </td>
                                <td className="p-2 text-secondary-text-light dark:text-secondary-text-dark">
                                     <SettingsSelect id={`role-${user.id}`} value={user.role} onChange={e => onRoleChange(user.id, e.target.value as UserRole)} label="">
                                        <option value="Administrator">Administrator</option>
                                        <option value="Legal Reviewer">Legal Reviewer</option>
                                        <option value="Member">Member</option>
                                     </SettingsSelect>
                                </td>
                                <td className="p-2 text-right">
                                    <button onClick={() => onDeleteUser(user.id)} disabled={user.name.includes('(You)')} className="disabled:opacity-50 disabled:cursor-not-allowed">
                                        <TrashIcon className="w-5 h-5 text-gray-400 hover:text-accent-critical cursor-pointer" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                      </tbody>
                    </table>
                </div>
            </SettingsCard>
        </div>
    );
};

const NotificationsSettings = () => {
    const [email, setEmail] = useState(true);
    const [inApp, setInApp] = useState(true);
    const [analysisComplete, setAnalysisComplete] = useState(true);
    const [assignedFinding, setAssignedFinding] = useState(true);
    const [reportComment, setReportComment] = useState(false);
    const [weeklySummary, setWeeklySummary] = useState(true);

    return (
        <div className="space-y-8">
            <SettingsCard title="Notification Channels" subtitle="Choose how you receive alerts from Vesta.">
                <SettingsToggle label="Email Notifications" enabled={email} setEnabled={setEmail} />
                <SettingsToggle label="In-App Notifications" enabled={inApp} setEnabled={setInApp} />
            </SettingsCard>
            <SettingsCard title="Event Alerts" subtitle="Select which events you want to be notified about.">
                <SettingsToggle label="When my document analysis is complete" enabled={analysisComplete} setEnabled={setAnalysisComplete} />
                <SettingsToggle label="When a team member assigns a finding to me" enabled={assignedFinding} setEnabled={setAssignedFinding} />
                <SettingsToggle label="When a comment is made on my report" enabled={reportComment} setEnabled={setReportComment} />
                <SettingsToggle label="A weekly summary of all unresolved critical issues" enabled={weeklySummary} setEnabled={setWeeklySummary} />
            </SettingsCard>
        </div>
    );
};

const SecuritySettings = () => {
    const [is2faEnabled, setIs2faEnabled] = useState(false);

    const handle2faToggle = () => {
        if (!is2faEnabled) {
            alert("This would begin the 2FA setup process, likely involving a QR code scan.");
        }
        setIs2faEnabled(!is2faEnabled);
    };

    return (
        <div className="space-y-8">
            <SettingsCard title="Two-Factor Authentication (2FA)" subtitle="Add an extra layer of security to your account.">
                <div className="flex items-center justify-between">
                    <p className="text-primary-text-light dark:text-primary-text-dark">{is2faEnabled ? "2FA is currently enabled." : "2FA is currently disabled."}</p>
                    <button onClick={handle2faToggle} className={`px-4 py-2 font-semibold text-white rounded-lg hover:bg-opacity-90 ${is2faEnabled ? 'bg-accent-critical' : 'bg-accent-success'}`}>
                        {is2faEnabled ? "Disable 2FA" : "Enable 2FA"}
                    </button>
                </div>
            </SettingsCard>
        </div>
    );
}

const IntegrationsSettings = () => (
    <div className="space-y-8">
        <SettingsCard title="Project Management" subtitle="Connect to your team's project management tool.">
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border-light dark:border-border-dark rounded-lg">
                    <span className="font-bold text-lg text-primary-text-light dark:text-primary-text-dark">Jira</span>
                    <button className="px-4 py-2 font-semibold text-white bg-primary-blue rounded-lg hover:bg-opacity-90">Connect</button>
                </div>
                <div className="flex items-center justify-between p-4 border border-border-light dark:border-border-dark rounded-lg">
                    <span className="font-bold text-lg text-primary-text-light dark:text-primary-text-dark">Asana</span>
                    <button className="px-4 py-2 font-semibold text-white bg-primary-blue rounded-lg hover:bg-opacity-90">Connect</button>
                </div>
                 <div className="flex items-center justify-between p-4 border border-border-light dark:border-border-dark rounded-lg">
                    <span className="font-bold text-lg text-primary-text-light dark:text-primary-text-dark">Trello</span>
                    <button className="px-4 py-2 font-semibold text-gray-500 bg-gray-200 dark:bg-gray-600 dark:text-gray-300 rounded-lg cursor-not-allowed">Coming Soon</button>
                </div>
            </div>
        </SettingsCard>
    </div>
);


const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigateTo, currentUser, onLogout }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isInviteModalOpen, setInviteModalOpen] = useState(false);
    
    const [workspaceUsers, setWorkspaceUsers] = useState<WorkspaceUser[]>([
        { id: currentUser.email, name: `${currentUser.name} (You)`, email: currentUser.email, role: 'Administrator' },
        { id: 'jane.smith@example.com', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Legal Reviewer' },
    ]);
    
    const handleInviteUser = (email: string, role: UserRole) => {
        if (!email || workspaceUsers.some(u => u.email === email)) {
            alert('Please enter a valid, unique email address.');
            return;
        }
        const newUser: WorkspaceUser = {
            id: email,
            name: 'New User (Pending)',
            email,
            role,
        };
        setWorkspaceUsers(prev => [...prev, newUser]);
        setInviteModalOpen(false);
    };

    const handleDeleteUser = (id: string) => {
        if (id === currentUser.email) {
            alert("You cannot remove yourself from the workspace.");
            return;
        }
        setWorkspaceUsers(prev => prev.filter(u => u.id !== id));
    };

    const handleRoleChange = (id: string, newRole: UserRole) => {
        if (id === currentUser.email) {
            alert("You cannot change your own role.");
            return;
        }
        setWorkspaceUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
    };


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
            case 'workspace': return <WorkspaceSettings users={workspaceUsers} onInviteClick={() => setInviteModalOpen(true)} onDeleteUser={handleDeleteUser} onRoleChange={handleRoleChange} />;
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
                {isInviteModalOpen && <InviteUserModal onClose={() => setInviteModalOpen(false)} onInvite={handleInviteUser} />}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <aside className="lg:col-span-1">
                        <nav className="space-y-1">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                        activeTab === tab.id
                                            ? 'bg-primary-blue text-white'
                                            : 'text-secondary-text-light dark:text-secondary-text-dark hover:bg-gray-200 dark:hover:bg-dark-card'
                                    }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </aside>
                    <div className="lg:col-span-3">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </SidebarMainLayout>
    );
};

export default SettingsScreen;