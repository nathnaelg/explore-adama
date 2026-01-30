

'use client';

import EventManagement from '@/components/EventManagement';
import { useAuth } from '@/components/AuthProvider';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const { isDarkMode } = useAuth();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  return <EventManagement isDarkMode={isDarkMode} searchTerm={query} />;
}
