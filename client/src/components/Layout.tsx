import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Transactions', href: '/transactions', icon: '💳' },
    { name: 'Budgets', href: '/budgets', icon: '📋' },
    { name: 'Goals', href: '/goals', icon: '🎯' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary-600">PLATA</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Hi, {user?.name || user?.email}</span>
              <button
                onClick={logout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </div>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
        <div className="flex justify-around py-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center py-2 px-4 text-xs ${
                location.pathname === item.href
                  ? 'text-primary-600'
                  : 'text-gray-600'
              }`}
            >
              <span className="text-lg mb-1">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Desktop Sidebar would go here for larger screens */}
      <div className="pb-16 md:pb-0" />
    </div>
  );
};

export default Layout;