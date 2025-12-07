import { useState } from 'react';
import { FiUser, FiMapPin, FiPhone, FiMail, FiAlertCircle, FiDownload, FiGrid, FiList } from 'react-icons/fi';
import DonorCard from '../common/DonorCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { exportToPDF } from '../../utils/pdfGenerator';

const DonorResultsGrid = ({
  donors = [],
  loading = false,
  emptyMessage = 'No donors found matching your criteria',
  onContactClick,
  onDonorClick,
  viewMode = 'grid', // 'grid' or 'list'
  onViewModeChange,
  showExport = true,
  compact = false
}) => {
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [exporting, setExporting] = useState(false);

  const handleExportPDF = async () => {
    if (donors.length === 0) return;
    
    setExporting(true);
    try {
      await exportToPDF({
        title: 'Blood Donors Search Results',
        data: donors.map(donor => ({
          name: donor.name,
          bloodGroup: donor.bloodGroup,
          location: `${donor.district}, ${donor.upazila}`,
          availability: donor.availability || 'available',
          lastDonation: donor.lastDonationDate 
            ? new Date(donor.lastDonationDate).toLocaleDateString() 
            : 'Never',
          totalDonations: donor.totalDonations || 0
        })),
        columns: ['Name', 'Blood Group', 'Location', 'Availability', 'Last Donation', 'Total Donations']
      });
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleContact = (donor) => {
    if (onContactClick) {
      onContactClick(donor);
    } else {
      // Default contact behavior
      setSelectedDonor(donor);
      alert(`Contact information for ${donor.name}:\nEmail: ${donor.email}\nPhone: ${donor.phone || 'Not provided'}`);
    }
  };

  if (loading) {
    return (
      <div className="py-12">
        <LoadingSpinner 
          size="lg" 
          text="Searching for donors..." 
          fullScreen={false}
        />
      </div>
    );
  }

  if (donors.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiUser className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Donors Found</h3>
        <p className="text-gray-600 mb-6">{emptyMessage}</p>
        <div className="max-w-md mx-auto text-left bg-gray-50 p-4 rounded-lg">
          <p className="font-medium text-gray-700 mb-2">💡 Suggestions:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Try expanding your search area</li>
            <li>• Check different availability options</li>
            <li>• Consider compatible blood groups</li>
            <li>• Remove some filters for more results</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Found {donors.length} donor{donors.length !== 1 ? 's' : ''}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Showing compatible blood donors based on your search criteria
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            {onViewModeChange && (
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => onViewModeChange('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <FiGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onViewModeChange('list')}
                  className={`p-2 border-l border-gray-300 ${viewMode === 'list' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <FiList className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Export Button */}
            {showExport && (
              <button
                onClick={handleExportPDF}
                disabled={exporting}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {exporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 mr-2"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <FiDownload className="w-4 h-4 mr-2" />
                    Export PDF
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {donors.filter(d => d.availability === 'available').length}
            </div>
            <div className="text-sm text-red-800">Available Now</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {donors.filter(d => d.totalDonations > 0).length}
            </div>
            <div className="text-sm text-blue-800">Experienced Donors</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {donors.reduce((sum, d) => sum + (d.totalDonations || 0), 0)}
            </div>
            <div className="text-sm text-green-800">Total Donations</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {Array.from(new Set(donors.map(d => d.bloodGroup))).length}
            </div>
            <div className="text-sm text-purple-800">Blood Groups</div>
          </div>
        </div>
      </div>

      {/* Donor Results */}
      {viewMode === 'grid' ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donors.map((donor) => (
            <DonorCard
              key={donor._id}
              donor={donor}
              showContact={true}
              onContactClick={() => handleContact(donor)}
              onActionClick={onDonorClick ? () => onDonorClick(donor) : undefined}
              actionLabel="View Profile"
              compact={compact}
            />
          ))}
        </div>
      ) : (
        // List View
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blood Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Donation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donors.map((donor) => (
                  <tr key={donor._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                          {donor.avatar ? (
                            <img
                              src={donor.avatar}
                              alt={donor.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <FiUser className="text-red-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{donor.name}</div>
                          <div className="text-sm text-gray-500">{donor.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xl font-bold text-red-600">
                        {donor.bloodGroup}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <FiMapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                          <div>{donor.district}</div>
                          <div className="text-gray-500">{donor.upazila}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="flex items-center text-gray-900">
                          <FiMail className="w-4 h-4 mr-2 text-gray-400" />
                          {donor.email}
                        </div>
                        {donor.phone && (
                          <div className="flex items-center text-gray-500 mt-1">
                            <FiPhone className="w-4 h-4 mr-2" />
                            {donor.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {donor.lastDonationDate ? (
                          <>
                            <div className="text-gray-900">
                              {new Date(donor.lastDonationDate).toLocaleDateString()}
                            </div>
                            <div className="text-gray-500">
                              {donor.totalDonations || 0} donation{donor.totalDonations !== 1 ? 's' : ''}
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-500">Never donated</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleContact(donor)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          Contact
                        </button>
                        {onDonorClick && (
                          <button
                            onClick={() => onDonorClick(donor)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                          >
                            View
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Emergency Contact Card */}
      {donors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="p-3 bg-red-100 rounded-lg">
                <FiAlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-red-900 mb-2">Important Notice</h4>
              <p className="text-red-700 mb-3">
                Always verify donor information before proceeding. Contact donors respectfully 
                and only for genuine blood donation needs.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-3 rounded-lg border border-red-100">
                  <p className="font-medium text-gray-900 mb-1">💡 Tips for Contacting:</p>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Introduce yourself clearly</li>
                    <li>• Explain the urgent need</li>
                    <li>• Confirm availability</li>
                    <li>• Arrange safe meeting</li>
                  </ul>
                </div>
                <div className="bg-white p-3 rounded-lg border border-red-100">
                  <p className="font-medium text-gray-900 mb-1">⚠️ Safety Guidelines:</p>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Meet in public/hospital</li>
                    <li>• Bring a companion</li>
                    <li>• Verify identity</li>
                    <li>• Report suspicious activity</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Donor Modal (Simplified) */}
      {selectedDonor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contact {selectedDonor.name}
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{selectedDonor.email}</p>
              </div>
              {selectedDonor.phone && (
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{selectedDonor.phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Blood Group</p>
                <p className="font-medium text-red-600">{selectedDonor.bloodGroup}</p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setSelectedDonor(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <a
                href={`mailto:${selectedDonor.email}`}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Send Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorResultsGrid;