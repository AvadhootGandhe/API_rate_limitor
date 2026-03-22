import { Search, Bell, User } from 'lucide-react';

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 h-16 border-b border-gray-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-800 shadow-sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">MarketingHub</p>
            <p className="truncate text-xs text-gray-500">Unified dashboard</p>
          </div>
        </div>

        <div className="hidden flex-1 max-w-xl md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search campaigns, clients, metrics…"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <button type="button" className="relative rounded-lg p-2 transition-colors hover:bg-gray-50">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-600" />
          </button>

          <div className="flex items-center gap-2 border-l border-gray-200 pl-3 sm:gap-3 sm:pl-4">
            <div className="hidden text-right sm:block">
              <div className="text-sm font-medium text-gray-900">Sarah Johnson</div>
              <div className="text-xs text-gray-500">Marketing Manager</div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-800">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
