'use client';

import * as React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardHome from './components/DashboardHome';
import ContentModeration from './components/ContentModeration';
import UserManagement from './components/UserManagement';
import PlacesMap from './components/PlacesMap';
import ContentManagement from './components/ContentManagement';
import CategoryManagement from './components/CategoryManagement';
import EventManagement from './components/EventManagement';
import TicketManagement from './components/TicketManagement';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import SettingsPage from './components/SettingsPage';
import RecommendationEngine from './components/RecommendationEngine';
import LoginPage from './components/LoginPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import { useAuth } from './components/AuthProvider';
import { cn } from './utils';
import { Loader2, ShieldAlert, LogOut } from 'lucide-react';
import { Button } from './components/ui/button';

const App: React.FC = () => {
  const { isDarkMode, toggleTheme, logout, isAuthenticated, isLoading, user } = useAuth();
  
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<'login' | 'forgot-password'>('login');
  
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 768 && width < 1280) {
        setIsSidebarCollapsed(true);
      } else if (width >= 1280) {
        setIsSidebarCollapsed(false);
      }
      if (width >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleNavigate = (path: string) => {
    try {
        const [pathname, search] = path.split('?');
        const tab = pathname.substring(1) || 'dashboard'; 
        setActiveTab(tab);
        if (path !== window.location.pathname + window.location.search) {
            window.history.pushState(null, '', path);
        }
        if (search) {
          const params = new URLSearchParams(search);
          setSearchQuery(params.get('q') || '');
        } else {
          setSearchQuery('');
        }
    } catch (e) {
        console.error("Navigation error:", e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-black">
        <Loader2 className="h-16 w-16 animate-spin text-blue-500 mb-4" />
      </div>
    );
  }

  const isBanned = user?.banned === true || 
                   String(user?.banned).toLowerCase() === 'true' || 
                   Number(user?.banned) === 1;

  if (isAuthenticated && isBanned) {
      return (
          <div className="fixed inset-0 z-[9999] bg-white dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
              <div className="absolute inset-0 bg-white/40 dark:bg-black/60 backdrop-blur-xl z-[-1]" />
              <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-red-500/20 animate-in zoom-in duration-500">
                  <ShieldAlert size={48} />
              </div>
              <div className="max-w-md space-y-4 animate-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Access Suspended</h1>
                <p className="text-gray-500 dark:text-zinc-400 text-lg leading-relaxed">
                    This account has been flagged for a violation of security protocols. 
                    <span className="block mt-2 font-bold text-red-600 dark:text-red-400">All dashboard privileges are revoked.</span>
                </p>
                <div className="pt-8 flex flex-col gap-3">
                    <Button variant="destructive" size="lg" onClick={() => logout()} className="h-14 text-lg font-bold rounded-2xl gap-3 shadow-xl">
                        <LogOut size={20} /> Terminate Session
                    </Button>
                </div>
              </div>
          </div>
      );
  }

  if (!isAuthenticated) {
    if (authMode === 'forgot-password') {
        return <ForgotPasswordPage onBack={() => setAuthMode('login')} />;
    }
    return <LoginPage onForgotClick={() => setAuthMode('forgot-password')} />;
  }

  const titles: Record<string, string> = {
    dashboard: 'Dashboard',
    users: 'User Management',
    events: 'Events & Bookings',
    places: 'Places & Map',
    moderation: 'Moderation',
    content: 'Content & Blogs',
    categories: 'Category Management',
    tickets: 'Ticket Management',
    analytics: 'Analytics & Reports',
    recommendation: 'Recommendation Engine',
    settings: 'Settings'
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardHome isDarkMode={isDarkMode} searchTerm={debouncedSearch} onNavigate={handleNavigate} />;
      case 'moderation': return <ContentModeration isDarkMode={isDarkMode} searchTerm={debouncedSearch} />;
      case 'users': return <UserManagement isDarkMode={isDarkMode} searchTerm={debouncedSearch} />;
      case 'places': return <PlacesMap isDarkMode={isDarkMode} searchTerm={debouncedSearch} />;
      case 'content': return <ContentManagement isDarkMode={isDarkMode} searchTerm={debouncedSearch} />;
      case 'categories': return <CategoryManagement isDarkMode={isDarkMode} searchTerm={debouncedSearch} />;
      case 'events': return <EventManagement isDarkMode={isDarkMode} searchTerm={debouncedSearch} />;
      case 'tickets': return <TicketManagement isDarkMode={isDarkMode} searchTerm={debouncedSearch} />;
      case 'analytics': return <AnalyticsDashboard isDarkMode={isDarkMode} searchTerm={debouncedSearch} />;
      case 'recommendation': return <RecommendationEngine />;
      case 'settings': return <SettingsPage isDarkMode={isDarkMode} searchTerm={debouncedSearch} toggleTheme={toggleTheme} />;
      default: return <div className="p-8 text-center text-gray-400">Section Under Construction</div>;
    }
  };

  return (
    <div className="min-h-screen w-full flex relative bg-slate-50 dark:bg-black text-gray-900 dark:text-zinc-100 transition-colors duration-300 font-sans">
      <div className={cn(
        "shrink-0 transition-all duration-300",
        isSidebarCollapsed ? "md:w-20" : "md:w-80"
      )}>
        <Sidebar 
            activeTab={activeTab} 
            setActiveTab={(tab) => handleNavigate(tab === 'dashboard' ? '/' : `/${tab}`)} 
            isDarkMode={isDarkMode} 
            isCollapsed={isSidebarCollapsed}
            toggleSidebar={toggleSidebar}
            isMobileMenuOpen={isMobileMenuOpen}
            toggleMobileMenu={toggleMobileMenu}
            onLogout={logout}
            currentPath={activeTab === 'dashboard' ? '/' : `/${activeTab}`}
        />
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <div className="px-4 pt-4 shrink-0">
            <Header 
                isDarkMode={isDarkMode} 
                toggleTheme={toggleTheme} 
                toggleMobileMenu={toggleMobileMenu}
                title={titles[activeTab] || 'Dashboard'} 
                searchValue={searchQuery}
                onSearch={setSearchQuery}
                onNavigate={handleNavigate}
                onLogout={logout}
                user={user}
            />
        </div>
        <main className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide">
             <div className="max-w-[1600px] mx-auto w-full">
                {renderContent()}
             </div>
        </main>
      </div>
    </div>
  );
};

export default App;