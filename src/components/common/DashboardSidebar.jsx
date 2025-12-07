import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome,
  FiUser,
  FiDroplet,
  FiPlusCircle,
  FiList,
  FiUsers,
  FiActivity,
  FiDollarSign,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';
import { FaHandHoldingHeart } from 'react-icons/fa';

const DashboardSidebar = ({ isMobileOpen, onMobileClose }) => {
  const { user, logout, isAdmin, isVolunteer, isDonor } = useAuth();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({
    donor: true,
    admin: true,
    volunteer: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleLogout = () => {
    logout();
  };

  // Donor navigation items
  const donorNavItems = [
    {
      name: 'Dashboard Home',
      path: '/dashboard',
      icon: <FiHome className="w-5 h-5" />,
      exact: true,
    },
    {
      name: 'My Donation Requests',
      path: '/dashboard/my-donation-requests',
      icon: <FiList className="w-5 h-5" />,
    },
    {
      name: 'Create Donation Request',
      path: '/dashboard/create-donation-request',
      icon: <FiPlusCircle className="w-5 h-5" />,
    },
  ];

  // Admin navigation items
  const adminNavItems = [
    {
      name: 'All Users',
      path: '/dashboard/all-users',
      icon: <FiUsers className="w-5 h-5" />,
    },
    {
      name: 'All Donation Requests',
      path: '/dashboard/all-blood-donation-request',
      icon: <FiActivity className="w-5 h-5" />,
    },
  ];

  // Volunteer navigation items
  const volunteerNavItems = [
    {
      name: 'Donation Requests',
      path: '/dashboard/all-blood-donation-request',
      icon: <FiActivity className="w-5 h-5" />,
    },
  ];

  // Shared navigation items
  const sharedNavItems = [
    {
      name: 'My Profile',
      path: '/dashboard/profile',
      icon: <FiUser className="w-5 h-5" />,
    },
    {
      name: 'Funding',
      path: '/dashboard/funding',
      icon: <FiDollarSign className="w-5 h-5" />,
    },
  ];

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      end={item.exact}
      onClick={onMobileClose}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 mb-1 ${
          isActive
            ? 'bg-red-50 text-red-700 font-semibold border-l-4 border-red-600'
            : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'
        }`
      }
    >
      <span className={`${location.pathname === item.path ? 'text-red-600' : 'text-gray-500'}`}>
        {item.icon}
      </span>
      <span className="text-sm">{item.name}</span>
    </NavLink>
  );

  const Section = ({ title, items, sectionKey, isVisible = true }) => {
    if (!isVisible || items.length === 0) return null;

    return (
      <div className="mb-4">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="flex items-center justify-between w-full px-2 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 uppercase tracking-wider mb-1"
        >
          <span>{title}</span>
          {expandedSections[sectionKey] ? (
            <FiChevronUp className="w-4 h-4" />
          ) : (
            <FiChevronDown className="w-4 h-4" />
          )}
        </button>
        
        {expandedSections[sectionKey] && (
          <div className="space-y-1">
            {items.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          flex flex-col h-full
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FaHandHoldingHeart className="text-red-600 text-2xl" />
              <span className="text-xl font-bold text-gray-800">
                Blood<span className="text-red-600">Connect</span>
              </span>
            </div>
            
            {/* Close button for mobile */}
            <button
              onClick={onMobileClose}
              className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* User Info */}
          <div className="mt-4 p-3 bg-red-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center overflow-hidden ring-2 ring-white">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser className="text-red-600 w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate text-sm">
                  {user?.name || 'User'}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    user?.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : user?.role === 'volunteer'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                  </span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    user?.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user?.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Blood Group Display */}
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Blood Group</span>
              <FiDroplet className="text-red-500 w-5 h-5" />
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-gray-800">
                {user?.bloodGroup || 'N/A'}
              </span>
            </div>
          </div>

          {/* Navigation Sections */}
          <Section
            title="My Dashboard"
            items={donorNavItems}
            sectionKey="donor"
            isVisible={isDonor()}
          />

          <Section
            title="Administration"
            items={adminNavItems}
            sectionKey="admin"
            isVisible={isAdmin()}
          />

          <Section
            title="Volunteer"
            items={volunteerNavItems}
            sectionKey="volunteer"
            isVisible={isVolunteer() && !isAdmin()}
          />

          {/* Shared Items (Always Visible) */}
          <div className="mb-4">
            <h4 className="px-2 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Account
            </h4>
            <div className="space-y-1">
              {sharedNavItems.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-red-600 transition-colors duration-200 font-medium text-sm"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
          
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} BloodConnect
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;