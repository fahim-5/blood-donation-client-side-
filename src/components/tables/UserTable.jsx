import { useState } from 'react';
import { FiUser, FiMail, FiMapPin, FiPhone, FiMoreVertical, FiCheck, FiX, FiShield, FiUsers, FiEdit, FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import RoleBadge from '../common/RoleBadge';
import UserStatusBadge from '../common/UserStatusBadge';
import BloodGroupBadge from '../ui/BloodGroupBadge';
import ConfirmationModal from '../common/ConfirmationModal';

const UserTable = ({
  users = [],
  loading = false,
  pagination = null,
  onPageChange,
  onBlock,
  onUnblock,
  onMakeAdmin,
  onMakeVolunteer,
  onView,
  onEdit,
  currentUserId,
  showActions = true,
  filters = {},
  onFilterChange,
  compact = false
}) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState('');
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const roles = ['all', 'donor', 'volunteer', 'admin'];
  const statuses = ['all', 'active', 'blocked'];

  const handleAction = (user, action) => {
    setSelectedUser(user);
    setActionType(action);
  };

  const confirmAction = () => {
    if (!selectedUser) return;

    switch (actionType) {
      case 'block':
        onBlock && onBlock(selectedUser._id);
        break;
      case 'unblock':
        onUnblock && onUnblock(selectedUser._id);
        break;
      case 'makeAdmin':
        onMakeAdmin && onMakeAdmin(selectedUser._id);
        break;
      case 'makeVolunteer':
        onMakeVolunteer && onMakeVolunteer(selectedUser._id);
        break;
    }

    setSelectedUser(null);
    setActionType('');
    setShowActionMenu(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getActionMessage = () => {
    if (!selectedUser) return '';
    
    switch (actionType) {
      case 'block':
        return `Are you sure you want to block ${selectedUser.name}? They will not be able to access the platform.`;
      case 'unblock':
        return `Are you sure you want to unblock ${selectedUser.name}? They will regain access to the platform.`;
      case 'makeAdmin':
        return `Are you sure you want to make ${selectedUser.name} an admin? They will have full access to all features.`;
      case 'makeVolunteer':
        return `Are you sure you want to make ${selectedUser.name} a volunteer? They will be able to manage donation requests.`;
      default:
        return '';
    }
  };

  if (compact) {
    return (
      <div className="space-y-3">
        {filteredUsers.map((user) => (
          <div key={user._id} className="bg-white rounded-lg border p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiUser className="text-red-600" />
                    )}
                  </div>
                  {user.status === 'blocked' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div>
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <RoleBadge role={user.role} size="sm" />
                    <UserStatusBadge status={user.status} size="sm" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <BloodGroupBadge bloodGroup={user.bloodGroup} size="sm" />
                {showActions && (
                  <button
                    onClick={() => setShowActionMenu(showActionMenu === user._id ? null : user._id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiMoreVertical className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Action Menu */}
            {showActionMenu === user._id && showActions && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {onView && (
                    <button
                      onClick={() => onView(user._id)}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100"
                    >
                      View
                    </button>
                  )}
                  {user.status === 'active' && onBlock && user._id !== currentUserId && (
                    <button
                      onClick={() => handleAction(user, 'block')}
                      className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm hover:bg-red-100"
                    >
                      Block
                    </button>
                  )}
                  {user.status === 'blocked' && onUnblock && (
                    <button
                      onClick={() => handleAction(user, 'unblock')}
                      className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm hover:bg-green-100"
                    >
                      Unblock
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Table Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Users Management</h3>
            <p className="text-sm text-gray-600 mt-1">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full sm:w-64"
              />
              <FiUser className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            </div>
            
            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {roles.map(role => (
                  <option key={role} value={role}>
                    {role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blood Group
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role & Status
                </th>
                {showActions && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={showActions ? 6 : 5} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <FiUser className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                      <p className="text-lg font-medium">No users found</p>
                      <p className="text-sm mt-1">Try changing your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3 relative">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <FiUser className="text-red-600" />
                          )}
                          {user.status === 'blocked' && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <FiMail className="w-4 h-4 mr-2 text-gray-400" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center mt-1">
                            <FiPhone className="w-4 h-4 mr-2 text-gray-400" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="flex items-center text-gray-900">
                          <FiMapPin className="w-4 h-4 mr-2 text-gray-400" />
                          {user.district}
                        </div>
                        <div className="text-gray-500 mt-1">{user.upazila}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <BloodGroupBadge bloodGroup={user.bloodGroup} size="md" />
                      {user.lastDonationDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          Last: {new Date(user.lastDonationDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <RoleBadge role={user.role} />
                        <UserStatusBadge status={user.status} />
                        {user.totalDonations > 0 && (
                          <div className="text-xs text-gray-600">
                            {user.totalDonations} donation{user.totalDonations !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </td>
                    {showActions && (
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {/* View Button */}
                          {onView && (
                            <button
                              onClick={() => onView(user._id)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="View Profile"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                          )}
                          
                          {/* Edit Button */}
                          {onEdit && (
                            <button
                              onClick={() => onEdit(user._id)}
                              className="text-gray-600 hover:text-gray-900 p-1"
                              title="Edit User"
                            >
                              <FiEdit className="w-4 h-4" />
                            </button>
                          )}
                          
                          {/* Action Menu */}
                          <div className="relative">
                            <button
                              onClick={() => setShowActionMenu(showActionMenu === user._id ? null : user._id)}
                              className="text-gray-400 hover:text-gray-600 p-1"
                            >
                              <FiMoreVertical className="w-5 h-5" />
                            </button>
                            
                            {showActionMenu === user._id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                                {user.status === 'active' && onBlock && user._id !== currentUserId && (
                                  <button
                                    onClick={() => handleAction(user, 'block')}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                  >
                                    <FiX className="w-4 h-4 mr-2" />
                                    Block User
                                  </button>
                                )}
                                
                                {user.status === 'blocked' && onUnblock && (
                                  <button
                                    onClick={() => handleAction(user, 'unblock')}
                                    className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                                  >
                                    <FiCheck className="w-4 h-4 mr-2" />
                                    Unblock User
                                  </button>
                                )}
                                
                                {user.role === 'donor' && onMakeVolunteer && (
                                  <button
                                    onClick={() => handleAction(user, 'makeVolunteer')}
                                    className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                                  >
                                    <FiUsers className="w-4 h-4 mr-2" />
                                    Make Volunteer
                                  </button>
                                )}
                                
                                {(user.role === 'donor' || user.role === 'volunteer') && onMakeAdmin && (
                                  <button
                                    onClick={() => handleAction(user, 'makeAdmin')}
                                    className="flex items-center w-full px-4 py-2 text-sm text-purple-600 hover:bg-purple-50"
                                  >
                                    <FiShield className="w-4 h-4 mr-2" />
                                    Make Admin
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!actionType}
        onClose={() => {
          setActionType('');
          setSelectedUser(null);
        }}
        onConfirm={confirmAction}
        title={
          actionType === 'block' ? 'Block User' :
          actionType === 'unblock' ? 'Unblock User' :
          actionType === 'makeAdmin' ? 'Make Admin' :
          actionType === 'makeVolunteer' ? 'Make Volunteer' : ''
        }
        message={getActionMessage()}
        type={
          actionType === 'block' ? 'danger' :
          actionType === 'unblock' ? 'success' :
          actionType === 'makeAdmin' ? 'warning' :
          actionType === 'makeVolunteer' ? 'info' : 'warning'
        }
        confirmText={
          actionType === 'block' ? 'Block' :
          actionType === 'unblock' ? 'Unblock' :
          actionType === 'makeAdmin' ? 'Make Admin' :
          actionType === 'makeVolunteer' ? 'Make Volunteer' : 'Confirm'
        }
      />
    </>
  );
};

export default UserTable;