import { Outlet } from 'react-router';
import { Navbar } from './Navbar';

export function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/80">
      <Navbar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
