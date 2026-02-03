
'use client';

import ContentModeration from '@/components/ContentModeration';
import { useAuth } from '@/components/AuthProvider';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const { isDarkMode } = useAuth();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  return <ContentModeration isDarkMode={isDarkMode} searchTerm={query} />;
}
