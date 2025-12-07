import { FiSearch, FiFilter, FiDownload, FiShare2, FiHeart, FiAlertCircle } from 'react-icons/fi';

const SearchResultsHeader = ({
  totalResults = 0,
  searchQuery = {},
  loading = false,
  onRefineSearch,
  onExport,
  onShare,
  showingResults = 0,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
  viewMode = 'grid',
  onViewModeChange,
  compact = false
}) => {
  const getBloodGroupLabel = () => {
    if (!searchQuery.bloodGroup) return 'All Blood Groups';
    return searchQuery.bloodGroup;
  };

  const getLocationLabel = () => {
    if (!searchQuery.district) return 'Anywhere';
    return `${searchQuery.district}${searchQuery.upazila ? `, ${searchQuery.upazila}` : ''}`;
  };

  const getFiltersSummary = () => {
    const filters = [];
    
    if (searchQuery.bloodGroup) {
      filters.push(`Blood: ${searchQuery.bloodGroup}`);
    }
    
    if (searchQuery.district) {
      filters.push(`Location: ${getLocationLabel()}`);
    }
    
    if (searchQuery.availability && searchQuery.availability !== 'all') {
      filters.push(`Available: ${searchQuery.availability === 'available' ? 'Yes' : 'No'}`);
    }
    
    if (searchQuery.lastDonation) {
      const periods = {
        '1month': 'Within 1 month',
        '3months': 'Within 3 months',
        '6months': 'Within 6 months',
        '1year': 'Within 1 year',
        'never': 'Never donated'
      };
      filters.push(`Last Donation: ${periods[searchQuery.lastDonation] || searchQuery.lastDonation}`);
    }
    
    return filters;
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      // Default share behavior
      const searchParams = new URLSearchParams();
      if (searchQuery.bloodGroup) searchParams.set('blood', searchQuery.bloodGroup);
      if (searchQuery.district) searchParams.set('district', searchQuery.district);
      if (searchQuery.upazila) searchParams.set('upazila', searchQuery.upazila);
      
      const shareUrl = `${window.location.origin}/search?${searchParams.toString()}`;
      navigator.clipboard.writeText(shareUrl);
      alert('Search link copied to clipboard!');
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      alert('Export functionality would be implemented here');
    }
  };

  if (compact) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <FiSearch className="text-red-600" />
            <h3 className="font-semibold text-gray-900">
              {totalResults} Result{totalResults !== 1 ? 's' : ''}
            </h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onRefineSearch}
              className="p-2 text-gray-600 hover:text-gray-900"
              title="Refine Search"
            >
              <FiFilter className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 text-gray-600 hover:text-gray-900"
              title="Share Results"
            >
              <FiShare2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters Summary */}
        {getFiltersSummary().length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {getFiltersSummary().map((filter, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded-full border border-red-100"
              >
                {filter}
              </span>
            ))}
          </div>
        )}

        {/* Location Info */}
        <div className="text-sm text-gray-600">
          Searching for {getBloodGroupLabel()} donors in {getLocationLabel()}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Main Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <FiSearch className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {loading ? 'Searching...' : `${totalResults} Donor${totalResults !== 1 ? 's' : ''} Found`}
              </h2>
              <p className="text-gray-600 mt-1">
                Showing {showingResults} of {totalResults} results for {getBloodGroupLabel()} blood in {getLocationLabel()}
              </p>
            </div>
          </div>

          {/* Active Filters */}
          {getFiltersSummary().length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {getFiltersSummary().map((filter, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-red-50 text-red-800 border border-red-200"
                  >
                    {filter}
                    <button
                      onClick={onRefineSearch}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      <FiFilter className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onRefineSearch}
            className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            <FiFilter className="w-4 h-4 mr-2" />
            Refine Search
          </button>
          
          <button
            onClick={handleShare}
            className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            <FiShare2 className="w-4 h-4 mr-2" />
            Share Results
          </button>
          
          <button
            onClick={handleExport}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            <FiDownload className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats and Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Search Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Blood Group:</span>
              <span className="font-medium">{getBloodGroupLabel()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium">{getLocationLabel()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Results Found:</span>
              <span className="font-medium">{totalResults}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Search Time:</span>
              <span className="font-medium">Just now</span>
            </div>
          </div>
        </div>

        {/* View Controls */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">View Options</h4>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">View Mode:</span>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => onViewModeChange && onViewModeChange('grid')}
                  className={`px-3 py-1.5 text-sm ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => onViewModeChange && onViewModeChange('list')}
                  className={`px-3 py-1.5 text-sm border-l border-gray-300 ${viewMode === 'list' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  List
                </button>
              </div>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Page:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onPageChange && onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                  >
                    ←
                  </button>
                  <span className="text-sm font-medium">
                    {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => onPageChange && onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FiAlertCircle className="w-5 h-5 text-red-600" />
            <h4 className="font-medium text-red-900">Quick Tips</h4>
          </div>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• Contact donors during reasonable hours</li>
            <li>• Verify donor eligibility before meeting</li>
            <li>• Always meet in safe, public locations</li>
            <li>• Report any issues immediately</li>
          </ul>
          <div className="mt-3 pt-3 border-t border-red-200">
            <div className="flex items-center text-xs text-red-600">
              <FiHeart className="w-3 h-3 mr-1" />
              <span>Thank you for saving lives!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Notice */}
      {searchQuery.bloodGroup && (
        <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="p-2 bg-red-100 rounded-lg">
                <FiHeart className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div>
              <p className="font-medium text-red-900">
                {searchQuery.bloodGroup} blood is {getUrgencyMessage(searchQuery.bloodGroup)}
              </p>
              <p className="text-sm text-red-700 mt-1">
                Consider contacting multiple donors to increase chances of success.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function
const getUrgencyMessage = (bloodGroup) => {
  const urgentGroups = ['O-', 'B-', 'AB-'];
  const highDemandGroups = ['O+', 'A+', 'B+'];
  
  if (urgentGroups.includes(bloodGroup)) {
    return 'in urgent demand and often in short supply.';
  }
  if (highDemandGroups.includes(bloodGroup)) {
    return 'in high demand but usually available.';
  }
  return 'available from select donors.';
};

export default SearchResultsHeader;