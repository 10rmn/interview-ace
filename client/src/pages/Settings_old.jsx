import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Shield,
  Palette,
  Volume2,
  Mic,
  Globe,
  HelpCircle,
  ChevronRight,
  Moon,
  Sun,
  Mail,
  Phone,
  MessageSquare,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Settings = () => {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoRecord, setAutoRecord] = useState(false);
  const [language, setLanguage] = useState('english');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [contactInfo, setContactInfo] = useState({
    email: 'support@interviewace.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street, Silicon Valley, CA 94000'
  });

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    // Load saved settings
    const savedNotifications = localStorage.getItem('notifications') !== 'false';
    const savedSound = localStorage.getItem('soundEnabled') !== 'false';
    const savedAutoRecord = localStorage.getItem('autoRecord') === 'true';
    const savedLanguage = localStorage.getItem('language') || 'english';
    
    setNotifications(savedNotifications);
    setSoundEnabled(savedSound);
    setAutoRecord(savedAutoRecord);
    setLanguage(savedLanguage);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleNotifications = () => {
    const newNotifications = !notifications;
    setNotifications(newNotifications);
    localStorage.setItem('notifications', newNotifications);
  };

  const toggleSound = () => {
    const newSound = !soundEnabled;
    setSoundEnabled(newSound);
    localStorage.setItem('soundEnabled', newSound);
  };

  const toggleAutoRecord = () => {
    const newAutoRecord = !autoRecord;
    setAutoRecord(newAutoRecord);
    localStorage.setItem('autoRecord', newAutoRecord);
  };

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const saveProfile = () => {
    // In a real app, this would call an API
    localStorage.setItem('user', JSON.stringify({ ...user, ...profileData }));
    setEditingProfile(false);
    alert('Profile updated successfully!');
  };

  const updatePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    // In a real app, this would call an API
    alert('Password updated successfully!');
    setShowPasswordForm(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const sections = [
    {
      title: 'Appearance',
      icon: Palette,
      items: [
        {
          label: 'Dark Mode',
          description: 'Toggle dark/light theme',
          type: 'toggle',
          value: darkMode,
          onChange: toggleDarkMode,
          icon: darkMode ? Moon : Sun,
        },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          label: 'Push Notifications',
          description: 'Receive practice reminders',
          type: 'toggle',
          value: notifications,
          onChange: toggleNotifications,
        },
        {
          label: 'Sound Effects',
          description: 'Play sounds for actions',
          type: 'toggle',
          value: soundEnabled,
          onChange: toggleSound,
          icon: Volume2,
        },
      ],
    },
    {
      title: 'Recording',
      icon: Mic,
      items: [
        {
          label: 'Auto-start Recording',
          description: 'Start recording when question appears',
          type: 'toggle',
          value: autoRecord,
          onChange: toggleAutoRecord,
        },
      ],
    },
    {
      title: 'Preferences',
      icon: Globe,
      items: [
        {
          label: 'Language',
          description: 'Choose your preferred language',
          type: 'select',
          value: language,
          onChange: changeLanguage,
          options: [
            { value: 'english', label: 'English' },
            { value: 'spanish', label: 'Spanish' },
            { value: 'french', label: 'French' },
          ],
        },
      ],
    },
    {
      title: 'Account',
      icon: User,
      items: [
        {
          label: 'Profile Information',
          description: 'Update your personal details',
          type: 'action',
          action: () => setEditingProfile(true),
        },
        {
          label: 'Privacy Settings',
          description: 'Manage your data and privacy',
          type: 'action',
          action: () => alert('Privacy settings panel would open here'),
        },
        {
          label: 'Security',
          description: 'Password and authentication',
          type: 'action',
          action: () => setShowPasswordForm(true),
          icon: Shield,
        },
      ],
    },
    {
      title: 'Support',
      icon: HelpCircle,
      items: [
        {
          label: 'Help Center',
          description: 'Get help and documentation',
          type: 'action',
          action: () => window.open('https://help.interviewace.com', '_blank'),
        },
        {
          label: 'Send Feedback',
          description: 'Help us improve the app',
          type: 'action',
          action: () => window.open('mailto:feedback@interviewace.com', '_blank'),
        },
        {
          label: 'Contact Us',
          description: 'Get in touch with our team',
          type: 'action',
          action: () => alert(`Contact us at:\n\nEmail: ${contactInfo.email}\nPhone: ${contactInfo.phone}\nAddress: ${contactInfo.address}`),
          icon: Mail,
        },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your preferences and account settings
        </p>
      </motion.div>

      <div className="space-y-6">
        {sections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <section.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h2>
              </div>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {section.items.map((item, itemIndex) => (
                <div
                  key={item.label}
                  className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        {item.icon && (
                          <item.icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        )}
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.label}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.type === 'toggle' && (
                        <button
                          onClick={item.onChange}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            item.value
                              ? 'bg-blue-600 dark:bg-blue-500'
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              item.value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      )}

                      {item.type === 'select' && (
                        <select
                          value={item.value}
                          onChange={(e) => item.onChange(e.target.value)}
                          className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {item.options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}

                      {item.type === 'action' && (
                        <button
                          onClick={item.action}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Version Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center"
      >
        <p className="text-xs text-gray-500 dark:text-gray-400">
          InterviewAce v1.0.0 • Made with ❤️ for developers
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          © 2024 InterviewAce. All rights reserved.
        </p>
      </motion.div>

      {/* Profile Edit Modal */}
      <AnimatePresence>
        {editingProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h3>
                <button
                  onClick={() => setEditingProfile(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setEditingProfile(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProfile}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Change Password</h3>
                <button
                  onClick={() => setShowPasswordForm(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      className="absolute right-2 top-2.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      className="absolute right-2 top-2.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      className="absolute right-2 top-2.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowPasswordForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={updatePassword}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Update Password
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
