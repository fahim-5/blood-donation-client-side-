import React from 'react';
import { Link } from 'react-router-dom';
import { FaServer, FaHome, FaSync, FaEnvelope } from 'react-icons/fa';

const ServerError = () => {
  const handleRetry = () => {
    if (window.location.pathname === '/') {
      window.location.reload();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
            <FaServer className="text-red-600 text-4xl" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">500</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Server Error</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">
              Something went wrong on our end. Our team has been notified and is working to fix the issue.
            </p>
          </div>
          <p className="text-gray-600 mb-8">
            Please try again in a few moments. If the problem persists, contact our support team.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleRetry}
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300"
          >
            <FaSync className="mr-2" />
            Try Again
          </button>
          
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300"
            >
              <FaHome className="mr-2" />
              Home
            </Link>
            
            <a
              href="mailto:support@blooddonation.com"
              className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300"
            >
              <FaEnvelope className="mr-2" />
              Support
            </a>
          </div>
        </div>

        <div className="mt-8">
          <div className="text-sm text-gray-500 mb-4">
            <p>What you can try:</p>
          </div>
          <ul className="text-sm text-gray-600 text-left space-y-2 max-w-xs mx-auto">
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>Refresh the page</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>Clear your browser cache</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>Check your internet connection</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>Try again in a few minutes</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Error Reference: #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
};

export default ServerError;