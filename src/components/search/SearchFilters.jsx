import { useState } from 'react';
import { FiFilter, FiX, FiChevronDown, FiChevronUp, FiRefreshCw } from 'react-icons/fi';
import LocationSelect from '../ui/LocationSelect';

const SearchFilters = ({
  onSearch,
  loading = false,
  initialFilters = {},
  onReset,
  compact = false
}) => {
  const [filters, setFilters] = useState({
    bloodGroup: initialFilters.bloodGroup || '',
    district: initialFilters.district || '',
    upazila: initialFilters.upazila || '',
    availability: initialFilters.availability || 'all',
    lastDonation: initialFilters.lastDonation || '',
    sortBy: initialFilters.sortBy || 'relevance',
    ...initialFilters
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  const availabilityOptions = [
    { value: 'all', label: 'All Donors' },
    { value: 'available', label: 'Available Now' },
    { value: 'unavailable', label: 'Currently Unavailable' }
  ];

  const lastDonationOptions = [
    { value: '', label: 'Any Time' },
    { value: '1month', label: 'Within 1 Month' },
    { value: '3months', label: 'Within 3 Months' },
    { value: '6months', label: 'Within 6 Months' },
    { value: '1year', label: 'Within 1 Year' },
    { value: 'never', label: 'Never Donated' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'recent', label: 'Most Recent' },
    { value: 'distance', label: 'Nearest First' },
    { value: 'experience', label: 'Most Experienced' },
    { value: 'availability', label: 'Availability' }
  ];

  const handleChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (district, upazila) => {
    setFilters(prev => ({
      ...prev,
      district,
      upazila
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(filters);
    }
  };

  const handleReset = () => {
    const resetFilters = {
      bloodGroup: '',
      district: '',
      upazila: '',
      availability: 'all',
      lastDonation: '',
      sortBy: 'relevance'
    };
    
    setFilters(resetFilters);
    setShowAdvanced(false);
    
    if (onReset) {
      onReset(resetFilters);
    }
  };

  const hasActiveFilters = () => {
    return filters.bloodGroup || 
           filters.district || 
           filters.upazila || 
           filters.availability !== 'all' || 
           filters.lastDonation || 
           filters.sortBy !== 'relevance';
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.bloodGroup) count++;
    if (filters.district) count++;
    if (filters.upazila) count++;
    if (filters.availability !== 'all') count++;
    if (filters.lastDonation) count++;
    if (filters.sortBy !== 'relevance') count++;
    return count;
  };

  if (compact) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FiFilter className="text-gray-500" />
            <h3 className="font-medium text-gray-900">Filters</h3>
            {hasActiveFilters() && (
              <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                {getActiveFilterCount()} active
              </span>
            )}
          </div>
          
          {hasActiveFilters() && (
            <button
              onClick={handleReset}
              className="text-sm text-red-600 hover:text-red-700 flex items-center"
            >
              <FiX className="w-3 h-3 mr-1" />
              Clear
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Blood Group */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blood Group
            </label>
            <select
              value={filters.bloodGroup}
              onChange={(e) => handleChange('bloodGroup', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Blood Groups</option>
              {bloodGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <LocationSelect
              selectedDistrict={filters.district}
              selectedUpazila={filters.upazila}
              onChange={handleLocationChange}
              placeholderDistrict="Any District"
              placeholderUpazila="Any Upazila"
              size="sm"
              showLabel={false}
            />
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Availability
            </label>
            <select
              value={filters.availability}
              onChange={(e) => handleChange('availability', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              {availabilityOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Apply Filters'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <FiFilter className="text-red-600 w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Search Filters</h3>
            <p className="text-sm text-gray-600">Find compatible blood donors</p>
          </div>
        </div>
        
        {hasActiveFilters() && (
          <button
            onClick={handleReset}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Reset All
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Blood Group */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Group *
            </label>
            <select
              value={filters.bloodGroup}
              onChange={(e) => handleChange('bloodGroup', e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Select Blood Group</option>
              {bloodGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          {/* Location - District */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              District *
            </label>
            <input
              type="text"
              value={filters.district}
              onChange={(e) => handleChange('district', e.target.value)}
              required
              placeholder="Enter district"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Location - Upazila */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upazila *
            </label>
            <input
              type="text"
              value={filters.upazila}
              onChange={(e) => handleChange('upazila', e.target.value)}
              required
              placeholder="Enter upazila"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Availability
            </label>
            <select
              value={filters.availability}
              onChange={(e) => handleChange('availability', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              {availabilityOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            {showAdvanced ? (
              <FiChevronUp className="w-4 h-4 mr-2" />
            ) : (
              <FiChevronDown className="w-4 h-4 mr-2" />
            )}
            {showAdvanced ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
          </button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Last Donation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Donation
                </label>
                <select
                  value={filters.lastDonation}
                  onChange={(e) => handleChange('lastDonation', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  {lastDonationOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleChange('sortBy', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Additional advanced filters can be added here */}
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters() && (
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-sm font-medium text-blue-800 mb-2">Active Filters:</p>
            <div className="flex flex-wrap gap-2">
              {filters.bloodGroup && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200">
                  Blood: {filters.bloodGroup}
                  <button
                    onClick={() => handleChange('bloodGroup', '')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              {filters.district && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200">
                  District: {filters.district}
                  <button
                    onClick={() => handleChange('district', '')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              {filters.availability !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200">
                  {availabilityOptions.find(o => o.value === filters.availability)?.label}
                  <button
                    onClick={() => handleChange('availability', 'all')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              {filters.lastDonation && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200">
                  Last Donation: {lastDonationOptions.find(o => o.value === filters.lastDonation)?.label}
                  <button
                    onClick={() => handleChange('lastDonation', '')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={loading || !filters.bloodGroup || !filters.district}
            className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Searching...
              </>
            ) : (
              'Search Donors'
            )}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchFilters;