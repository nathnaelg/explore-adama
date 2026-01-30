'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthProvider'; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select } from './ui/select';
import { 
  User, Lock, Palette, Shield,
  Upload, Loader2, CheckCircle, 
  Moon, Sun, Laptop, LogOut, AlertTriangle, Trash2, AlertCircle
} from 'lucide-react';
import { cn } from '../utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';

interface SettingsPageProps {
  isDarkMode: boolean;
  searchTerm?: string;
  toggleTheme?: () => void;
}

const TABS = [
  { id: 'profile', label: 'My Profile', icon: User, description: 'Manage your personal information' },
  { id: 'security', label: 'Security', icon: Shield, description: 'Password and account actions' },
  { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Theme and language settings' },
];

const SettingsPage: React.FC<SettingsPageProps> = ({ isDarkMode, searchTerm, toggleTheme }) => {
  const { updateUser } = useAuth(); 
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'delete', message: string } | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRevokeOpen, setIsRevokeOpen] = useState(false);
  
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    country: '',
    locale: '',
    gender: 'Male',
  });

  const [passwordData, setPasswordData] = useState({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
  });

  const showFeedback = (type: 'success' | 'error' | 'delete', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const loggedInUser = api.getUser();
        if (loggedInUser && loggedInUser.id) {
            const u = await api.get<any>(`/users/${loggedInUser.id}`);
            if (u) {
                setUser(u);
                setFormData(prev => ({
                    ...prev,
                    name: u.profile?.name || u.name || '',
                    email: u.email || '',
                    role: u.role || '',
                    country: u.profile?.country || '',
                    gender: u.profile?.gender || 'Male',
                    phone: u.profile?.phone || '',
                    locale: u.profile?.locale || '',
                }));
            }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setFileToUpload(e.target.files[0]);
      }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    
    try {
        if (fileToUpload) {
            const uploadData = new FormData();
            uploadData.append('avatar', fileToUpload);
            const res = await api.post<{ message: string, profile: any }>('/users/profile/avatar', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res && res.profile) {
                const updatedUser = { ...user, profile: res.profile };
                setUser(updatedUser);
                updateUser(updatedUser);
            }
        }

        const updatePayload = {
            name: formData.name,
            email: formData.email,
            gender: formData.gender,
            phone: formData.phone,
            country: formData.country,
            locale: formData.locale,
        };

        const res = await api.put<any>('/users/profile', updatePayload);
        if (res) {
             const updatedProfile = res.profile || res;
             const updatedUser = { ...user, email: formData.email, profile: updatedProfile };
             setUser(updatedUser);
             updateUser(updatedUser);
             showFeedback('success', "Profile updated successfully!");
        }

    } catch (error) {
        console.error("Error saving profile:", error);
        showFeedback('error', "Failed to save profile changes.");
    } finally {
        setIsSaving(false);
        setFileToUpload(null);
    }
  };

  const handleUpdatePassword = async () => {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
          showFeedback('error', "New passwords do not match.");
          return;
      }
      if (!passwordData.oldPassword) {
          showFeedback('error', "Please enter your current password.");
          return;
      }

      setIsSaving(true);
      try {
          await api.put('/users/change-password', {
              oldPassword: passwordData.oldPassword,
              newPassword: passwordData.newPassword
          });
          showFeedback('success', "Password changed successfully.");
          setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } catch (error: any) {
          console.error(error);
          showFeedback('error', error.response?.data?.message || "Failed to change password.");
      } finally {
          setIsSaving(false);
      }
  };

  const handleRevokeSessions = async () => {
      setIsRevoking(true);
      try {
          await api.post('/auth/revoke-sessions', {});
          showFeedback('delete', "Other active sessions revoked.");
      } catch (error) {
          console.error("Failed to revoke sessions", error);
          showFeedback('error', "Failed to revoke sessions.");
      } finally {
          setIsRevoking(false);
          setIsRevokeOpen(false);
      }
  };

  const handleDeleteAccount = async () => {
      if (!user || !user.id) return;
      try {
          await api.delete(`/users/${user.id}`);
          api.removeToken();
          showFeedback('delete', "Account deactivated.");
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
      } catch (error) {
          console.error("Delete failed", error);
          showFeedback('error', "Account deletion failed.");
      } finally {
          setIsDeleteOpen(false);
      }
  };

  const renderProfile = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <Card>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your photo and personal details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100 dark:border-zinc-800">
                    <div className="relative group cursor-pointer">
                        <img 
                            src={fileToUpload ? URL.createObjectURL(fileToUpload) : (user?.profile?.avatar || `https://ui-avatars.com/api/?name=${formData.name || 'User'}&background=random`)} 
                            alt="Profile" 
                            className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-md transition-transform group-hover:scale-105"
                        />
                        <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Upload className="text-white w-6 h-6" />
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                    </div>
                    <div className="text-center sm:text-left space-y-2">
                        <div className="flex gap-3 justify-center sm:justify-start">
                            <label className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-white transition-colors border border-gray-200 bg-white hover:bg-gray-100 h-9 px-3 dark:bg-zinc-900 dark:border-zinc-700">
                                Change Photo
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>
                        <p className="text-xs text-gray-400">Allowed: JPG, GIF or PNG. Max size of 800K</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label>Full Name</Label><Input name="name" value={formData.name} onChange={handleInputChange} /></div>
                    <div className="space-y-2"><Label>Email Address</Label><Input name="email" value={formData.email} onChange={handleInputChange} /></div>
                    <div className="space-y-2"><Label>Phone Number</Label><Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+251..." /></div>
                    <div className="space-y-2"><Label>Role</Label><Input value={formData.role} disabled className="bg-gray-50 dark:bg-zinc-900 text-gray-500" /></div>
                    <div className="space-y-2"><Label>Country</Label><Input name="country" value={formData.country} onChange={handleInputChange} /></div>
                    <div className="space-y-2"><Label>City</Label><Input name="locale" value={formData.locale} onChange={handleInputChange} /></div>
                    <div className="space-y-2"><Label>Gender</Label><Select name="gender" value={formData.gender} onChange={handleInputChange}><option value="Male">Male</option><option value="Female">Female</option></Select></div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-gray-100 dark:border-zinc-800 pt-6">
                 <Button onClick={handleSaveProfile} disabled={isSaving} className="min-w-[120px]">
                     {isSaving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Save Changes'}
                 </Button>
            </CardFooter>
        </Card>
    </div>
  );

  const renderSecurity = () => (
     <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
         <Card>
             <CardHeader><CardTitle>Account Security</CardTitle><CardDescription>Manage your password and session access.</CardDescription></CardHeader>
             <CardContent className="space-y-6">
                 <div className="space-y-4">
                     <h3 className="font-medium text-sm text-gray-900 dark:text-zinc-100 flex items-center gap-2"><Lock size={16} /> Change Password</h3>
                     <input type="text" name="username" value={formData.email} autoComplete="username" className="hidden" readOnly />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="space-y-2"><Label>Current Password</Label><Input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} placeholder="••••••••" autoComplete="current-password" /></div></div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-2"><Label>New Password</Label><Input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} placeholder="••••••••" autoComplete="new-password" /></div>
                         <div className="space-y-2"><Label>Confirm Password</Label><Input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} placeholder="••••••••" autoComplete="new-password" /></div>
                     </div>
                     <div className="flex justify-end"><Button variant="outline" size="sm" onClick={handleUpdatePassword} disabled={isSaving}>Update Password</Button></div>
                 </div>
                 <div className="h-px bg-gray-100 dark:bg-zinc-800" />
                 <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900/20 gap-4">
                     <div><div className="font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2"><LogOut size={16} /> Revoke Sessions</div><div className="text-sm text-gray-500">Log out from all other devices.</div></div>
                     <Button variant="outline" className="border-orange-200 text-orange-700" onClick={handleRevokeSessions} disabled={isRevoking}>{isRevoking ? <Loader2 className="animate-spin h-4 w-4" /> : 'Revoke All'}</Button>
                 </div>
             </CardContent>
         </Card>
         <Card className="border-red-100 dark:border-red-900/30">
             <CardHeader><CardTitle className="text-red-600 flex items-center gap-2"><AlertTriangle size={20} /> Danger Zone</CardTitle><CardDescription>Irreversible actions regarding your account.</CardDescription></CardHeader>
             <CardContent><div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 gap-4"><div><div className="font-bold text-gray-900">Delete Account</div><div className="text-sm text-gray-500">Permanently remove your data.</div></div><Button variant="destructive" onClick={handleDeleteAccount}><Trash2 size={16} className="mr-2"/> Delete Account</Button></div></CardContent>
         </Card>
     </div>
  );

  const renderAppearance = () => (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <Card>
              <CardHeader><CardTitle>Appearance</CardTitle><CardDescription>Customize the interface look and feel.</CardDescription></CardHeader>
              <CardContent className="space-y-8">
                  <div className="space-y-4">
                      <Label>Interface Theme</Label>
                      <div className="grid grid-cols-3 gap-4">
                          <button onClick={!isDarkMode ? undefined : toggleTheme} className={cn("flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all", !isDarkMode ? "border-blue-50 bg-blue-50/20" : "border-gray-200")}><div className="p-3 bg-white rounded-full shadow-sm"><Sun size={24} className="text-orange-500" /></div><span className="text-sm">Light</span></button>
                          <button onClick={isDarkMode ? undefined : toggleTheme} className={cn("flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all", isDarkMode ? "border-blue-500 bg-blue-900/10" : "border-gray-200")}><div className="p-3 bg-zinc-900 rounded-full shadow-sm"><Moon size={24} className="text-blue-400" /></div><span className="text-sm">Dark</span></button>
                          <button className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 opacity-50 cursor-not-allowed"><div className="p-3 bg-gray-100 rounded-full"><Laptop size={24} className="text-gray-500" /></div><span className="text-sm">System</span></button>
                      </div>
                  </div>
              </CardContent>
          </Card>
      </div>
  );

  const ActiveIcon = TABS.find(t => t.id === activeTab)?.icon || User;
  const activeLabel = TABS.find(t => t.id === activeTab)?.label;

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto pb-10">
      <div className="w-full lg:w-72 shrink-0 space-y-8">
          <div><h2 className="text-2xl font-bold dark:text-white mb-2">Settings</h2><p className="text-gray-500 text-sm">Manage your preferences.</p></div>
          <nav className="space-y-1">{TABS.map(tab => { const Icon = tab.icon; const isActive = activeTab === tab.id; return (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all", isActive ? "bg-blue-500 text-white shadow-md" : "text-gray-600 hover:bg-gray-100 dark:text-zinc-400")}><Icon size={18} /><span>{tab.label}</span></button>); })}</nav>
      </div>
      <div className="flex-1 min-w-0">
          <div className="lg:hidden mb-6 pb-4 border-b border-gray-100"><h3 className="text-xl font-bold flex items-center gap-2"><ActiveIcon className="text-blue-500" size={24} /> {activeLabel}</h3></div>
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'security' && renderSecurity()}
          {activeTab === 'appearance' && renderAppearance()}
      </div>
      {feedback && (
          <div className={cn(
              "fixed bottom-6 right-6 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5 fade-in z-[9999] text-white",
              feedback.type === 'error' ? "bg-red-600" : (feedback.type === 'delete' ? "bg-red-500" : "bg-green-600")
          )}>
              {feedback.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
              <span className="font-medium">{feedback.message}</span>
          </div>
      )}

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]" onClose={() => setIsDeleteOpen(false)}>
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Delete Account
            </DialogTitle>
            <DialogDescription>
              Are you strictly sure you want to delete your account? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                'Delete Account'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRevokeOpen} onOpenChange={setIsRevokeOpen}>
        <DialogContent className="sm:max-w-[400px]" onClose={() => setIsRevokeOpen(false)}>
          <DialogHeader>
            <DialogTitle className="text-orange-600 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Revoke Sessions
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke all other active sessions? This will log you out from other devices.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRevokeOpen(false)}>Cancel</Button>
            <Button variant="default" onClick={handleRevokeSessions} disabled={isRevoking}>
              {isRevoking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Revoking...
                </>
              ) : (
                'Revoke All'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;