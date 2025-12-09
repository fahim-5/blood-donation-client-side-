import React, { useState, useEffect } from 'react';
import { FaTools, FaClock, FaHome, FaSync } from 'react-icons/fa';

const Maintenance = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 30,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = { ...prev };
        
        if (newTime.seconds > 0) {
          newTime.seconds--;
        } else if (newTime.minutes > 0) {
          newTime.minutes--;
          newTime.seconds = 59;
        } else if (newTime.hours > 0) {
          newTime.hours--;
          newTime.minutes = 59;
          newTime.seconds = 59;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6">
            <FaTools className="text-blue-600 text-4xl" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">Maintenance</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">We'll be back soon!</h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-700">
              We're currently performing scheduled maintenance to improve our services.
              The website will be back online shortly.
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <FaClock className="text-gray-500" />
              <span className="text-gray-700">Estimated time remaining:</span>
            </div>
            
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{timeLeft.hours.toString().padStart(2, '0')}</div>
                <div className="text-sm text-gray-600">Hours</div>
              </div>
              <div className="text-2xl text-gray-400">:</div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                <div className="text-sm text-gray-600">Minutes</div>
              </div>
              <div className="text-2xl text-gray-400">:</div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                <div className="text-sm text-gray-600">Seconds</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
          >
            <FaSync className="mr-2" />
            Refresh Page
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300"
          >
            <FaHome className="mr-2" />
            Go Back
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Thank you for your patience.</p>
          <p className="mt-1">For urgent matters, contact: emergency@blooddonation.com</p>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;