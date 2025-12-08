import React, { useState, useEffect } from 'react';
import { FaSearch, FaDownload, FaUser, FaPhone, FaMapMarkerAlt, FaTint } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DonorCard from '../../components/common/DonorCard';
import SearchFilters from '../../components/search/SearchFilters';
import DonorResultsGrid from '../../components/search/DonorResultsGrid';
import SearchResultsHeader from '../../components/search/SearchResultsHeader';
import useLocationData from '../../hooks/useLocationData';
import useSearchDonors from '../../hooks/useSearchDonors';
import { exportToPDF } from '../../utils/pdfGenerator';

const SearchDonors = () => {
  const [filters, setFilters] = useState({
    bloodGroup: '',
    district: '',
    upazila: ''
  });
  
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const { districts, upazilas, loading: locationLoading } = useLocationData();
  const { searchDonors, loading: searchLoading } = useSearchDonors();

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset upazila if district changes
    if (name === 'district') {
      setFilters(prev => ({
        ...prev,
        upazila: ''
      }));
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!filters.bloodGroup || !filters.district) {
      alert('Please select blood group and district');
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const results = await searchDonors(filters);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Failed to search donors. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setFilters({
      bloodGroup: '',
      district: '',
      upazila: ''
    });
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleExportPDF = () => {
    if (searchResults.length === 0) {
      alert('No search results to export');
      return;
    }
    
    const data = {
      title: 'Blood Donor Search Results',
      filters: filters,
      donors: searchResults,
      exportDate: new Date().toLocaleDateString()
    };
    
    exportToPDF(data, 'donor-search-results');
  };

  const filteredUpazilas = upazilas.filter(upazila => 
    !filters.district || upazila.district_id === filters.district
  );

  const stats = {
    totalDonors: searchResults.length,
    availableGroups: [...new Set(searchResults.map(d => d.bloodGroup))].length,
    districtsCovered: [...new Set(searchResults.map(d => d.district))].length
  };

  if (locationLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Find Blood Donors
              </h1>
              <p className="text-xl text-red-100 mb-8">
                Search for available blood donors by location and blood type
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search Form */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FaSearch className="text-red-600" />
                  Search Filters
                </h2>
                
                <form onSubmit={handleSearch}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Blood Group */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Blood Group <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={filters.bloodGroup}
                        onChange={(e) => handleFilterChange('bloodGroup', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        required
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>

                    {/* District */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        District <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={filters.district}
                        onChange={(e) => handleFilterChange('district', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        required
                      >
                        <option value="">Select District</option>
                        {districts.map(district => (
                          <option key={district.id} value={district.id}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Upazila */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upazila
                      </label>
                      <select
                        value={filters.upazila}
                        onChange={(e) => handleFilterChange('upazila', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        disabled={!filters.district}
                      >
                        <option value="">All Upazilas</option>
                        {filteredUpazilas.map(upazila => (
                          <option key={upazila.id} value={upazila.id}>
                            {upazila.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="submit"
                      disabled={isSearching || searchLoading}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSearching || searchLoading ? (
                        <>
                          <LoadingSpinner size="small" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <FaSearch />
                          Search Donors
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-semibold transition-all duration-300"
                    >
                      Reset Filters
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {hasSearched && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-6xl mx-auto"
              >
                <SearchResultsHeader
                  stats={stats}
                  filters={filters}
                  onExport={handleExportPDF}
                  hasResults={searchResults.length > 0}
                />

                {searchLoading ? (
                  <div className="py-16">
                    <LoadingSpinner size="large" />
                    <p className="text-center text-gray-600 mt-4">
                      Searching for donors...
                    </p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    <DonorResultsGrid donors={searchResults} />
                    
                    {/* Export Button */}
                    <div className="mt-8 flex justify-center">
                      <button
                        onClick={handleExportPDF}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
                      >
                        <FaDownload />
                        Download Results as PDF
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                    <FaSearch className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">
                      No Donors Found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      No blood donors found matching your search criteria. Try adjusting your filters.
                    </p>
                    <button
                      onClick={handleReset}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                    >
                      Reset Search
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {!hasSearched && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-4xl mx-auto text-center py-16"
              >
                <div className="bg-white rounded-2xl shadow-lg p-12">
                  <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaTint className="text-4xl text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Ready to Find Donors?
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    Select a blood group and district to search for available blood donors.
                    Your search can help save lives in critical situations.
                  </p>
                  <div className="flex items-center justify-center gap-6 text-gray-500">
                    <div className="flex items-center gap-2">
                      <FaTint className="text-red-500" />
                      <span>Blood Type Matching</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-red-500" />
                      <span>Location Based</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUser className="text-red-500" />
                      <span>Verified Donors</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                Important Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-red-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FaTint className="text-red-600" />
                    Donor Eligibility
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Age: 18-65 years</li>
                    <li>• Weight: At least 50 kg</li>
                    <li>• Good health condition</li>
                    <li>• No infectious diseases</li>
                    <li>• Last donation at least 3 months ago</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FaPhone className="text-blue-600" />
                    Emergency Contact
                  </h3>
                  <p className="text-gray-700 mb-4">
                    For urgent blood requirements, contact our 24/7 helpline:
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-700">
                      10666
                    </div>
                    <p className="text-gray-600 text-sm">
                      National Emergency Blood Service
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SearchDonors;