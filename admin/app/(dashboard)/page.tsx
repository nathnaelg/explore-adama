
'use client';

import DashboardHome from '@/components/DashboardHome';
import { useAuth } from '@/components/AuthProvider';
import { useSearchParams, useRouter } from 'next/navigation';

export default function Page() {
  const { isDarkMode } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  
  return <DashboardHome isDarkMode={isDarkMode} searchTerm={query} onNavigate={(path) => router.push(path)} />;
}
