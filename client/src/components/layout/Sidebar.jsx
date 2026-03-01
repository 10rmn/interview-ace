import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Play, 
  History, 
  BarChart3, 
  Settings, 
  LogOut,
  Brain,
  Menu,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/practice', label: 'Start Interview', icon: Play },
    { to: '/history', label: 'Interview History', icon: History },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    // Handle logout logic here
    navigate('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -280,
        }}
        className="fixed top-0 left-0 z-50 w-72 h-screen bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-white/20 dark:border-slate-700/50 lg:translate-x-0 lg:static lg:z-auto"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 border-b border-white/20 dark:border-slate-700/50">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI Interview Simulator
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => window.innerWidth < 1024 && onToggle()}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`
                }
              >
                <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                <span className="font-medium">{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/20 dark:border-slate-700/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group"
            >
              <LogOut className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
