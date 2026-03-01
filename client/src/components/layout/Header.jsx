import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, User, LogOut, Settings, X, Check, AlertCircle, Award, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../../hooks/useAuth';

const Header = ({ onMenuToggle, user }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Interview Completed!',
      message: 'Your Frontend interview scored 85%',
      time: '2 hours ago',
      read: false,
      icon: Award,
      color: 'text-green-500'
    },
    {
      id: 2,
      type: 'achievement',
      title: 'New Achievement!',
      message: 'You completed 5 interviews this week',
      time: '1 day ago',
      read: false,
      icon: TrendingUp,
      color: 'text-purple-500'
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Practice Reminder',
      message: 'Time for your daily practice session',
      time: '2 days ago',
      read: true,
      icon: AlertCircle,
      color: 'text-blue-500'
    }
  ]);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const clearNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-200 lg:hidden"
        >
          <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>

        {/* Center: Welcome message */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to InterviewAce, {user?.name || 'User'}! 👋
          </h1>
        </div>

        {/* Right: Notifications and Profile */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-200 group"
            >
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300 transition-transform duration-200 group-hover:scale-110" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl shadow-indigo-500/10 max-h-96 overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">Notifications</h3>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                          >
                            Mark all read
                          </button>
                        )}
                        <button
                          onClick={() => setNotificationsOpen(false)}
                          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <X className="w-4 h-4 text-slate-500" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                            !notification.read ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800 ${notification.color}`}>
                              <notification.icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                                    {notification.time}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  {!notification.read && (
                                    <button
                                      onClick={() => markAsRead(notification.id)}
                                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                                      title="Mark as read"
                                    >
                                      <Check className="w-3 h-3 text-slate-500" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => clearNotification(notification.id)}
                                    className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20"
                                    title="Clear notification"
                                  >
                                    <X className="w-3 h-3 text-slate-400 hover:text-red-500" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                        <p className="text-sm text-slate-500 dark:text-slate-400">No notifications</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-200 group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="hidden md:block text-sm font-medium text-slate-700 dark:text-slate-300">
                {user?.name || 'User'}
              </span>
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl shadow-indigo-500/10"
                >
                  <div className="p-2">
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setProfileOpen(false);
                        navigate('/settings');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
                    >
                      <Settings className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Settings</span>
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                    >
                      <LogOut className="w-4 h-4 text-red-500 dark:text-red-400" />
                      <span className="text-sm font-medium text-red-500 dark:text-red-400">Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
