import { Outlet } from 'react-router-dom';
import { BookOpenCheck } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-primary-700 p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_55%)]" aria-hidden="true" />
        <div className="relative flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
            <BookOpenCheck className="h-6 w-6" aria-hidden="true" />
          </div>
          <span className="text-lg font-semibold">Balingasag Public Library</span>
        </div>
        <div className="relative space-y-4">
          <h2 className="text-3xl font-semibold leading-tight">A modern home for every reader in Balingasag.</h2>
          <p className="max-w-md text-primary-100">
            Browse the catalog, borrow and reserve books, track your activity, and stay updated — all in one place.
          </p>
        </div>
        <p className="relative text-sm text-primary-200">© {new Date().getFullYear()} Balingasag Public Library. All rights reserved.</p>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white">
              <BookOpenCheck className="h-6 w-6" aria-hidden="true" />
            </div>
            <span className="text-lg font-semibold text-gray-900">Balingasag Public Library</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
