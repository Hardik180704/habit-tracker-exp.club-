import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-9 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
        theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-200'
      }`}
    >
      <span className="sr-only">Toggle theme</span>
      <motion.div
        className="flex h-7 w-7 transform items-center justify-center rounded-full bg-white shadow-md"
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        style={{
            marginLeft: theme === 'dark' ? '2.25rem' : '0.25rem',
            marginRight: theme === 'dark' ? '0.25rem' : '2.25rem',
        }}
      >
        <motion.div
            initial={false}
            animate={{ rotate: theme === 'dark' ? 360 : 0 }}
            transition={{ duration: 0.5 }}
        >
            {theme === 'dark' ? (
              <Moon className="h-4 w-4 text-indigo-600" />
            ) : (
              <Sun className="h-4 w-4 text-orange-500" />
            )}
        </motion.div>
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
