

'use client';

import TicketManagement from '@/components/TicketManagement';
import { useAuth } from '@/components/AuthProvider';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const { isDarkMode } = useAuth();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  return <TicketManagement isDarkMode={isDarkMode} searchTerm={query} />;
}
