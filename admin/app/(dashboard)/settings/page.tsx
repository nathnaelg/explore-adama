
'use client';

import SettingsPage from '@/components/SettingsPage';
import { useAuth } from '@/components/AuthProvider';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const { isDarkMode, toggleTheme } = useAuth();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  return <SettingsPage isDarkMode={isDarkMode} searchTerm={query} toggleTheme={toggleTheme} />;
}
