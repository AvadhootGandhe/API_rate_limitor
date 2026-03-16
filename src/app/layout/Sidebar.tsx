import { Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Megaphone,
  Users,
  TrendingUp,
  Filter,
  CheckSquare,
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { path: '/clients', label: 'Clients', icon: Users },
  { path: '/ad-performance', label: 'Ad Performance', icon: TrendingUp },
  { path: '/lead-funnel', label: 'Lead Funnel', icon: Filter },
  { path: '/tasks', label: 'Tasks', icon: CheckSquare },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-200">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg" />
        <span className="font-semibold text-lg text-gray-900">MarketingHub</span>
      </div>

      <nav className="px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
