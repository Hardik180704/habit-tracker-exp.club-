
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans dark:bg-gray-900 dark:text-white transition-colors">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
