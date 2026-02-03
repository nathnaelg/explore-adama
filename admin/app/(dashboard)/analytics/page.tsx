
'use client';

import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { useAuth } from '@/components/AuthProvider';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const { isDarkMode } = useAuth();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  return <AnalyticsDashboard isDarkMode={isDarkMode} searchTerm={query} />;
}
