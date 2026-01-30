'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { isDarkMode, toggleTheme, user, logout, isAuthenticated, isLoading } = useAuth();
  
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace, push } = useRouter();

  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
        push('/login');
    }
  }, [isLoading, isAuthenticated, push]);

  useEffect(() => {
      setSearchQuery(searchParams?.get('q') || '');
  }, [pathname, searchParams]);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Auto-collapse sidebar based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      // If screen is medium (tablet/small laptop), auto-collapse the sidebar
      if (width < 1024) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }

      // Auto-close mobile menu if window is resized to desktop
      if (width >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getTitle = () => {
    if (pathname === '/') return 'Dashboard';
    const segment = pathname.split('/')[1];
    if (!segment) return 'Dashboard';
    
    const titles: Record<string, string> = {
      users: 'User Management',
      events: 'Events & Bookings',
      places: 'Places & Map',
      moderation: 'Moderation',
      content: 'Content & Blogs',
      categories: 'Category Management',
      tickets: 'Ticket Management',
      analytics: 'Analytics & Reports',
      settings: 'Settings',
      recommendation: 'Recommendation Engine'
    };
    return titles[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  useEffect(() => {
      const handler = setTimeout(() => {
          const currentParams = new URLSearchParams(searchParams?.toString());
          const currentQ = currentParams.get('q') || '';
          
          if (searchQuery !== currentQ) {
              if (searchQuery) {
                  currentParams.set('q', searchQuery);
              } else {
                  currentParams.delete('q');
              }
              replace(`${pathname}?${currentParams.toString()}`);
          }
      }, 500);

      return () => clearTimeout(handler);
  }, [searchQuery, pathname, replace, searchParams]);

  if (isLoading) {
      return (
         <div className="flex flex-col items-center justify-center h-[70vh] space-y-4 text-gray-500">
                            <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                        </div>
      );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen w-full flex relative bg-slate-50 dark:bg-black transition-colors duration-300 font-sans selection:bg-blue-500/30">
      <div className="relative z-20 shrink-0">
        <Sidebar 
            isDarkMode={isDarkMode} 
            isCollapsed={isSidebarCollapsed}
            toggleSidebar={toggleSidebar}
            isMobileMenuOpen={isMobileMenuOpen}
            toggleMobileMenu={toggleMobileMenu}
            onLogout={logout}
            currentPath={pathname}
        />
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <div className="px-4 pt-4 shrink-0">
             <div className="w-full">
                <Header 
                    isDarkMode={isDarkMode} 
                    toggleTheme={toggleTheme} 
                    toggleMobileMenu={toggleMobileMenu}
                    title={getTitle()} 
                    searchValue={searchQuery}
                    onSearch={setSearchQuery}
                    onNavigate={(path) => push(path)}
                    onLogout={logout}
                    user={user} 
                />
             </div>
        </div>

        <main className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide">
          <div className="w-full">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
}
