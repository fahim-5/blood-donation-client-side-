import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserSlash, FaEnvelope, FaHome } from 'react-icons/fa';

const BlockedUser = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
            <FaUserSlash className="text-red-600 text-4xl" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">Account Blocked</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Access Restricted</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">
              Your account has been temporarily blocked by the administrator. 
              This may be due to violation of our terms of service or suspicious activity.
            </p>
          </div>
          <p className="text-gray-600 mb-8">
            Please contact support to resolve this issue.
          </p>
        </div>

        <div className="space-y-4">
          <a
            href="mailto:support@blooddonation.com"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300"
          >
            <FaEnvelope className="mr-2" />
            Contact Support
          </a>
          
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300"
          >
            <FaHome className="mr-2" />
            Return to Homepage
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Support Email: support@blooddonation.com</p>
          <p className="mt-1">Phone: +880 1234 567890</p>
        </div>
      </div>
    </div>
  );
};

export default BlockedUser;