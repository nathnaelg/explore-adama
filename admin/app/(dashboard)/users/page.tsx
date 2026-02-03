'use client';

import UserManagement from '@/components/UserManagement';
import { useAuth } from '@/components/AuthProvider';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const { isDarkMode } = useAuth();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  return <UserManagement isDarkMode={isDarkMode} searchTerm={query} />;
}