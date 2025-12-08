import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaTint, FaUsers, FaChartBar, FaCog, FaSignOutAlt, FaHome, FaBell, FaQuestionCircle, FaHeartbeat } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardSidebar from '../../components/common/DashboardSidebar';
import DashboardHeader from '../../components/ui/DashboardHeader';
import useAuth from '../../hooks/useAuth';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mock notifications (replace with real data)
  useEffect(() => {
    const mockNotifications = [
      { id: 1, title: 'New Donation Request', message: 'Urgent need for B+ blood in your area', time: '10 min ago', read: false, type: 'urgent' },
      { id: 2, title: 'Profile Updated', message: 'Your profile information has been updated successfully', time: '1 hour ago', read: true, type: 'info' },
      { id: 3, title: 'Donation Reminder', message: 'You are eligible to donate blood again', time: '2 days ago', read: false, type: 'reminder' },
      { id: 4, title: 'Welcome!', message: 'Thank you for joining our lifesaving community', time: '1 week ago', read: true, type: 'welcome' },
    ];
    
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const getNavItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: <FaHome />, label: 'Dashboard', exact: true },
      { path: '/dashboard/profile', icon: <FaUser />, label: 'Profile' },
    ];

    if (user?.role === 'admin') {
      baseItems.push(
        { path: '/dashboard/all-users', icon: <FaUsers />, label: 'All Users' },
        { path: '/dashboard/all-donation-requests', icon: <FaTint />, label: 'All Requests' },
        { path: '/dashboard/funding-statistics', icon: <FaChartBar />, label: 'Funding Stats' },
        { path: '/dashboard/system-analytics', icon: <FaChartBar />, label: 'Analytics' },
        { path: '/dashboard/admin-settings', icon: <FaCog />, label: 'Settings' }
      );
    } else if (user?.role === 'donor') {
      baseItems.push(
        { path: '/dashboard/my-donation-requests', icon: <FaTint />, label: 'My Requests' },
        { path: '/dashboard/create-donation-request', icon: <FaHeartbeat />, label: 'Create Request' },
        { path: '/dashboard/all-donation-requests-shared', icon: <FaUsers />, label: 'All Requests' }
      );
    } else if (user?.role === 'volunteer') {
      baseItems.push(
        { path: '/dashboard/all-donation-requests-volunteer', icon: <FaTint />, label: 'All Requests' },
        { path: '/dashboard/volunteer-tasks', icon: <FaUsers />, label: 'My Tasks' }
      );
    }

    // Shared items for all roles
    baseItems.push(
      { path: '/dashboard/funding', icon: <FaChartBar />, label: 'Funding' },
      { path: '/dashboard/change-password', icon: <FaCog />, label: 'Change Password' },
      { path: '/dashboard/notification-settings', icon: <FaBell />, label: 'Notifications' }
    );

    return baseItems;
  };

  const getRoleBadgeColor = () => {
    switch (user?.role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'donor': return 'bg-blue-100 text-blue-800';
      case 'volunteer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial={isMobile ? "closed" : "open"}
        animate={sidebarOpen ? "open" : "closed"}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed lg:relative top-0 left-0 h-full w-64 bg-white shadow-xl z-50 lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <DashboardSidebar
          user={user}
          navItems={getNavItems()}
          currentPath={location.pathname}
          onLogout={handleLogout}
          onClose={() => setSidebarOpen(false)}
          roleBadgeColor={getRoleBadgeColor()}
        />
      </motion.aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen && !isMobile ? 'lg:ml-64' : ''}`}>
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left: Menu Button */}
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  {sidebarOpen ? (
                    <FaTimes className="h-5 w-5" />
                  ) : (
                    <FaBars className="h-5 w-5" />
                  )}
                </button>
                
                {/* Breadcrumb or Title */}
                <div className="ml-4 lg:ml-0">
                  <h1 className="text-xl font-semibold text-gray-900">
                    {getNavItems().find(item => item.path === location.pathname || (item.exact && location.pathname === item.path))?.label || 'Dashboard'}
                  </h1>
                </div>
              </div>

              {/* Right: User Actions */}
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 relative"
                  >
                    <FaBell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                      >
                        <div className="p-4 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">Notifications</h3>
                            {unreadCount > 0 && (
                              <button
                                onClick={markAllAsRead}
                                className="text-sm text-red-600 hover:text-red-700"
                              >
                                Mark all as read
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length > 0 ? (
                            notifications.map(notification => (
                              <div
                                key={notification.id}
                                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                                onClick={() => markAsRead(notification.id)}
                              >
                                <div className="flex items-start">
                                  <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${notification.type === 'urgent' ? 'bg-red-500' : notification.type === 'reminder' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{notification.title}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                    <span className="text-xs text-gray-500 mt-2 block">{notification.time}</span>
                                  </div>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-8 text-center">
                              <FaBell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                              <p className="text-gray-500">No notifications</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4 border-t border-gray-200">
                          <button
                            onClick={() => navigate('/dashboard/notification-settings')}
                            className="text-sm text-red-600 hover:text-red-700 w-full text-center"
                          >
                            Notification Settings
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Help */}
                <button
                  onClick={() => navigate('/how-it-works')}
                  className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  title="Help"
                >
                  <FaQuestionCircle className="h-5 w-5" />
                </button>

                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => navigate('/dashboard/profile')}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role || 'Donor'}</p>
                    </div>
                  </button>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50"
                  title="Logout"
                >
                  <FaSignOutAlt className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Dashboard Header Component */}
              <DashboardHeader
                user={user}
                title={getNavItems().find(item => item.path === location.pathname || (item.exact && location.pathname === item.path))?.label || 'Dashboard'}
                subtitle="Welcome to your dashboard"
              />
              
              {/* Page Content */}
              <div className="mt-6">
                <Outlet />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Blood Donation Platform. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 mt-2 md:mt-0">
              <a href="/privacy" className="text-sm text-gray-500 hover:text-gray-700">
                Privacy Policy
              </a>
              <a href="/terms" className="text-sm text-gray-500 hover:text-gray-700">
                Terms of Service
              </a>
              <a href="/contact" className="text-sm text-gray-500 hover:text-gray-700">
                Contact Support
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Bottom Navigation (for mobile only) */}
      {isMobile && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
          <div className="flex justify-around items-center h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className={`flex flex-col items-center p-2 ${location.pathname === '/dashboard' ? 'text-red-600' : 'text-gray-500'}`}
            >
              <FaHome className="h-5 w-5" />
              <span className="text-xs mt-1">Home</span>
            </button>
            
            {user?.role === 'donor' && (
              <button
                onClick={() => navigate('/dashboard/create-donation-request')}
                className={`flex flex-col items-center p-2 ${location.pathname === '/dashboard/create-donation-request' ? 'text-red-600' : 'text-gray-500'}`}
              >
                <FaHeartbeat className="h-5 w-5" />
                <span className="text-xs mt-1">Request</span>
              </button>
            )}
            
            <button
              onClick={() => navigate('/dashboard/profile')}
              className={`flex flex-col items-center p-2 ${location.pathname === '/dashboard/profile' ? 'text-red-600' : 'text-gray-500'}`}
            >
              <FaUser className="h-5 w-5" />
              <span className="text-xs mt-1">Profile</span>
            </button>
            
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="flex flex-col items-center p-2 text-gray-500 relative"
            >
              <FaBell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-6 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
              <span className="text-xs mt-1">Alerts</span>
            </button>
            
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex flex-col items-center p-2 text-gray-500"
            >
              <FaBars className="h-5 w-5" />
              <span className="text-xs mt-1">Menu</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;