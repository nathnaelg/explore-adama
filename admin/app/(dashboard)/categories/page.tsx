

'use client';

import CategoryManagement from '@/components/CategoryManagement';
import { useAuth } from '@/components/AuthProvider';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const { isDarkMode } = useAuth();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  return <CategoryManagement isDarkMode={isDarkMode} searchTerm={query} />;
}
