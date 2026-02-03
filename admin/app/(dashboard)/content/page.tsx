

'use client';

import ContentManagement from '@/components/ContentManagement';
import { useAuth } from '@/components/AuthProvider';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const { isDarkMode } = useAuth();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  return <ContentManagement isDarkMode={isDarkMode} searchTerm={query} />;
}
