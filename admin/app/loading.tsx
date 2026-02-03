import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] space-y-4 text-gray-500">
                            <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                        </div>
  );
}