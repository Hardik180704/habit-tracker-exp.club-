import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Users } from 'lucide-react';



import SettingsModal from './SettingsModal';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Social', path: '/social', icon: Users },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full transition-all duration-300 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 rounded-b-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                    <img src="/logo-512.png" alt="Onyx Logo" className="relative w-8 h-8 rounded-lg object-contain" />
                </div>
                <span className="text-2xl font-bold text-neutral-900 hidden sm:block dark:text-white transition-colors tracking-tight font-['Outfit']">Onyx</span>
              </Link>
              
              <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'border-indigo-500 text-gray-900 dark:text-white dark:border-indigo-400'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-700'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-4">


              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                <ThemeToggle />
                
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="flex items-center space-x-2 hover:bg-gray-50 p-1.5 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden md:block">
                    {user?.username}
                  </span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 pb-safe sm:hidden">
          <div className="flex justify-around items-center h-16">
              <Link to="/" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${location.pathname === '/' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  <LayoutDashboard className="w-6 h-6" />
                  <span className="text-[10px] font-medium">Dashboard</span>
              </Link>
              <Link to="/social" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${location.pathname === '/social' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  <Users className="w-6 h-6" />
                  <span className="text-[10px] font-medium">Social</span>
              </Link>
              <button onClick={() => setIsSettingsOpen(true)} className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500 dark:text-gray-400">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                      {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[10px] font-medium">Profile</span>
              </button>
          </div>
      </div>
    </>
  );
};

export default Navbar;
