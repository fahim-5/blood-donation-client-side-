import { formatDate, formatCurrency } from './formatters';

/**
 * Export data to CSV
 * @param {Array} data - Data to export
 * @param {Array} headers - Column headers
 * @param {string} filename - Export filename
 */
export const exportToCSV = (data, headers, filename = 'export') => {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No data to export');
    }

    // Prepare CSV content
    let csvContent = '';
    
    // Add headers
    csvContent += headers.map(header => `"${header}"`).join(',') + '\n';
    
    // Add data rows
    data.forEach(row => {
      const rowData = headers.map(header => {
        const value = row[header.toLowerCase().replace(/\s+/g, '_')] || row[header] || '';
        // Escape quotes and wrap in quotes if contains comma or quotes
        const escapedValue = String(value).replace(/"/g, '""');
        return escapedValue.includes(',') || escapedValue.includes('"') || escapedValue.includes('\n')
          ? `"${escapedValue}"`
          : escapedValue;
      });
      csvContent += rowData.join(',') + '\n';
    });

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('CSV Export Error:', error);
    throw error;
  }
};

/**
 * Export data to JSON
 * @param {Array} data - Data to export
 * @param {string} filename - Export filename
 */
export const exportToJSON = (data, filename = 'export') => {
  try {
    if (!Array.isArray(data) && typeof data !== 'object') {
      throw new Error('Invalid data format for JSON export');
    }

    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${new Date().getTime()}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('JSON Export Error:', error);
    throw error;
  }
};

/**
 * Export data to Excel (using xlsx library)
 * @param {Array} data - Data to export
 * @param {Array} headers - Column headers with mappings
 * @param {string} filename - Export filename
 * @param {string} sheetName - Sheet name
 */
export const exportToExcel = (data, headers, filename = 'export', sheetName = 'Sheet1') => {
  try {
    // Check if xlsx is available
    if (typeof window.XLSX === 'undefined') {
      throw new Error('XLSX library not loaded. Please include xlsx library.');
    }

    const XLSX = window.XLSX;
    
    // Prepare worksheet data
    const worksheetData = [
      headers.map(h => h.label || h),
      ...data.map(row => {
        return headers.map(header => {
          const key = header.key || header.toLowerCase().replace(/\s+/g, '_');
          let value = row[key] || '';
          
          // Format values based on type
          if (header.format === 'date' && value) {
            value = formatDate(value, 'YYYY-MM-DD');
          } else if (header.format === 'currency' && value) {
            value = formatCurrency(value);
          } else if (header.format === 'boolean' && value !== undefined) {
            value = value ? 'Yes' : 'No';
          }
          
          return value;
        });
      })
    ];

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // Auto-size columns
    const colWidths = headers.map((header, index) => {
      const maxLength = Math.max(
        header.label?.length || header.length || 10,
        ...worksheetData.map(row => String(row[index] || '').length)
      );
      return { wch: Math.min(maxLength + 2, 50) }; // Max width 50
    });
    
    worksheet['!cols'] = colWidths;
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Generate and download
    XLSX.writeFile(workbook, `${filename}_${new Date().getTime()}.xlsx`);
  } catch (error) {
    console.error('Excel Export Error:', error);
    throw error;
  }
};

/**
 * Export donors to CSV
 * @param {Array} donors - Donor data
 * @param {Object} filters - Search filters
 */
export const exportDonorsToCSV = (donors, filters = {}) => {
  const headers = ['Name', 'Email', 'Phone', 'Blood Group', 'District', 'Upazila', 'Status', 'Last Donation'];
  
  const data = donors.map(donor => ({
    name: donor.name || '',
    email: donor.email || '',
    phone: donor.phone || '',
    blood_group: donor.bloodGroup || '',
    district: donor.district || '',
    upazila: donor.upazila || '',
    status: donor.status === 'active' ? 'Available' : 'Unavailable',
    last_donation: donor.lastDonationDate ? formatDate(donor.lastDonationDate, 'YYYY-MM-DD') : 'Never',
  }));
  
  let filename = 'donors';
  if (filters.bloodGroup) filename += `_${filters.bloodGroup}`;
  if (filters.district) filename += `_${filters.district}`;
  
  exportToCSV(data, headers, filename);
};

/**
 * Export donation requests to CSV
 * @param {Array} donations - Donation request data
 */
export const exportDonationsToCSV = (donations) => {
  const headers = ['ID', 'Recipient Name', 'Blood Group', 'Hospital', 'District', 'Upazila', 'Status', 'Date', 'Time', 'Requester'];
  
  const data = donations.map(donation => ({
    id: donation._id || '',
    recipient_name: donation.recipientName || '',
    blood_group: donation.bloodGroup || '',
    hospital: donation.hospitalName || '',
    district: donation.recipientDistrict || '',
    upazila: donation.recipientUpazila || '',
    status: donation.status ? donation.status.charAt(0).toUpperCase() + donation.status.slice(1) : '',
    date: donation.donationDate ? formatDate(donation.donationDate, 'YYYY-MM-DD') : '',
    time: donation.donationTime || '',
    requester: donation.requester?.name || '',
  }));
  
  exportToCSV(data, headers, 'donation_requests');
};

/**
 * Export users to CSV (admin only)
 * @param {Array} users - User data
 */
export const exportUsersToCSV = (users) => {
  const headers = ['Name', 'Email', 'Role', 'Status', 'Blood Group', 'District', 'Upazila', 'Joined Date', 'Last Active'];
  
  const data = users.map(user => ({
    name: user.name || '',
    email: user.email || '',
    role: user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '',
    status: user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : '',
    blood_group: user.bloodGroup || '',
    district: user.district || '',
    upazila: user.upazila || '',
    joined_date: user.createdAt ? formatDate(user.createdAt, 'YYYY-MM-DD') : '',
    last_active: user.lastActive ? formatDate(user.lastActive, 'YYYY-MM-DD HH:mm') : '',
  }));
  
  exportToCSV(data, headers, 'users');
};

/**
 * Export funding data to CSV
 * @param {Array} fundings - Funding data
 */
export const exportFundingsToCSV = (fundings) => {
  const headers = ['Campaign', 'Target Amount', 'Raised Amount', 'Status', 'Start Date', 'End Date', 'Donors', 'Organizer'];
  
  const data = fundings.map(funding => ({
    campaign: funding.title || '',
    target_amount: formatCurrency(funding.targetAmount || 0),
    raised_amount: formatCurrency(funding.raisedAmount || 0),
    status: funding.status ? funding.status.charAt(0).toUpperCase() + funding.status.slice(1) : '',
    start_date: funding.startDate ? formatDate(funding.startDate, 'YYYY-MM-DD') : '',
    end_date: funding.endDate ? formatDate(funding.endDate, 'YYYY-MM-DD') : '',
    donors: funding.donorCount || 0,
    organizer: funding.organizer?.name || '',
  }));
  
  exportToCSV(data, headers, 'funding_campaigns');
};

/**
 * Copy data to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Copy to clipboard failed:', error);
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

/**
 * Export data as text file
 * @param {string} content - File content
 * @param {string} filename - Export filename
 * @param {string} type - MIME type
 */
export const exportAsTextFile = (content, filename = 'export', type = 'text/plain') => {
  try {
    const blob = new Blob([content], { type: `${type};charset=utf-8;` });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${new Date().getTime()}.txt`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Text Export Error:', error);
    throw error;
  }
};

/**
 * Generate export filename with timestamp
 * @param {string} prefix - Filename prefix
 * @param {string} extension - File extension
 * @returns {string} - Generated filename
 */
export const generateExportFilename = (prefix = 'export', extension = 'csv') => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  return `${prefix}_${timestamp}.${extension}`;
};

/**
 * Format data for export
 * @param {Array} data - Raw data
 * @param {Object} formatOptions - Formatting options
 * @returns {Array} - Formatted data
 */
export const formatDataForExport = (data, formatOptions = {}) => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(item => {
    const formattedItem = { ...item };
    
    // Apply formatting based on options
    if (formatOptions.dateFields) {
      formatOptions.dateFields.forEach(field => {
        if (formattedItem[field]) {
          formattedItem[field] = formatDate(formattedItem[field], formatOptions.dateFormat || 'YYYY-MM-DD');
        }
      });
    }
    
    if (formatOptions.currencyFields) {
      formatOptions.currencyFields.forEach(field => {
        if (formattedItem[field] !== undefined) {
          formattedItem[field] = formatCurrency(formattedItem[field]);
        }
      });
    }
    
    if (formatOptions.booleanFields) {
      formatOptions.booleanFields.forEach(field => {
        if (formattedItem[field] !== undefined) {
          formattedItem[field] = formattedItem[field] ? 'Yes' : 'No';
        }
      });
    }
    
    return formattedItem;
  });
};

/**
 * Validate export data
 * @param {Array} data - Data to validate
 * @returns {Object} - Validation result
 */
export const validateExportData = (data) => {
  const errors = [];
  
  if (!Array.isArray(data)) {
    errors.push('Data must be an array');
  } else if (data.length === 0) {
    errors.push('No data to export');
  } else {
    // Check for required fields in first item
    const sample = data[0];
    if (typeof sample !== 'object' || sample === null) {
      errors.push('Data items must be objects');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Export statistics to CSV
 * @param {Object} stats - Statistics data
 * @param {string} period - Time period
 */
export const exportStatisticsToCSV = (stats, period = 'monthly') => {
  const headers = ['Metric', 'Value', 'Period'];
  
  const data = [
    { metric: 'Total Users', value: stats.totalUsers || 0, period },
    { metric: 'Active Donors', value: stats.activeDonors || 0, period },
    { metric: 'Total Donations', value: stats.totalDonations || 0, period },
    { metric: 'Pending Requests', value: stats.pendingRequests || 0, period },
    { metric: 'Completed Donations', value: stats.completedDonations || 0, period },
    { metric: 'Total Funding', value: formatCurrency(stats.totalFunding || 0), period },
    { metric: 'New Users This Month', value: stats.newUsersThisMonth || 0, period },
    { metric: 'Donations This Month', value: stats.donationsThisMonth || 0, period },
  ];
  
  exportToCSV(data, headers, `statistics_${period}`);
};

/**
 * Export search results
 * @param {Array} results - Search results
 * @param {string} type - Result type (donors, donations, etc.)
 * @param {Object} filters - Search filters
 */
export const exportSearchResults = (results, type = 'donors', filters = {}) => {
  switch (type.toLowerCase()) {
    case 'donors':
      exportDonorsToCSV(results, filters);
      break;
    case 'donations':
      exportDonationsToCSV(results);
      break;
    case 'users':
      exportUsersToCSV(results);
      break;
    case 'funding':
      exportFundingsToCSV(results);
      break;
    default:
      throw new Error(`Unsupported export type: ${type}`);
  }
};

export default {
  exportToCSV,
  exportToJSON,
  exportToExcel,
  exportDonorsToCSV,
  exportDonationsToCSV,
  exportUsersToCSV,
  exportFundingsToCSV,
  copyToClipboard,
  exportAsTextFile,
  generateExportFilename,
  formatDataForExport,
  validateExportData,
  exportStatisticsToCSV,
  exportSearchResults,
};