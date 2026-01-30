

'use client';

import PlacesMap from '@/components/PlacesMap';
import { useAuth } from '@/components/AuthProvider';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const { isDarkMode } = useAuth();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  return <PlacesMap isDarkMode={isDarkMode} searchTerm={query} />;
}
