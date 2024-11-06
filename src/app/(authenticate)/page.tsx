'use client';

import { logout } from '@/lib/actions/authenticate';
import { cn } from '@/lib/utils';
import { useGetHealthReportQuery } from '@/services/health-service';

export default function Home() {
  const { data, isLoading } = useGetHealthReportQuery();

  if (isLoading) return <div className="px-5 py-7"> loading ...</div>;

  return (
    <main className="flex min-h-screen items-start px-5 py-7 justify-between">
      <div className="flex space-x-2 items-center">
        <span className="relative flex h-3 w-3">
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              data && 'bg-green-400'
            )}
          ></span>
          <span
            className={cn(
              'relative inline-flex rounded-full h-3 w-3',
              data ? 'bg-green-500' : 'bg-red-500'
            )}
          ></span>
        </span>
        <p>{data?.message || 'Server is not working'}</p>
      </div>

      <button
        className="px-3 py-2 bg-purple-600 text-white rounded "
        onClick={async () => logout()}
      >
        Logout
      </button>
    </main>
  );
}
