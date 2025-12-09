import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Generate PDF for donor search results
 * @param {Array} donors - Array of donor objects
 * @param {Object} filters - Search filters used
 * @returns {jsPDF} - PDF document
 */
export const generateDonorsPDF = (donors, filters = {}) => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text('Blood Donation Platform - Donor List', 105, 20, { align: 'center' });
  
  // Add timestamp
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 30, { align: 'center' });
  
  // Add filters info
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  let yPos = 40;
  
  if (filters.bloodGroup) {
    doc.text(`Blood Group: ${filters.bloodGroup}`, 14, yPos);
    yPos += 7;
  }
  
  if (filters.district) {
    doc.text(`District: ${filters.district}`, 14, yPos);
    yPos += 7;
  }
  
  if (filters.upazila) {
    doc.text(`Upazila: ${filters.upazila}`, 14, yPos);
    yPos += 7;
  }
  
  yPos += 5;
  
  // Prepare table data
  const tableData = donors.map(donor => [
    donor.name || 'N/A',
    donor.bloodGroup || 'N/A',
    donor.district || 'N/A',
    donor.upazila || 'N/A',
    donor.email || 'N/A',
    donor.phone || 'N/A',
    donor.status === 'active' ? 'Available' : 'Unavailable',
  ]);
  
  // Generate table
  doc.autoTable({
    head: [['Name', 'Blood Group', 'District', 'Upazila', 'Email', 'Phone', 'Status']],
    body: tableData,
    startY: yPos,
    theme: 'striped',
    headStyles: {
      fillColor: [220, 38, 38], // Red color
      textColor: 255,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 30 }, // Name
      1: { cellWidth: 20 }, // Blood Group
      2: { cellWidth: 25 }, // District
      3: { cellWidth: 25 }, // Upazila
      4: { cellWidth: 40 }, // Email
      5: { cellWidth: 25 }, // Phone
      6: { cellWidth: 20 }, // Status
    },
    margin: { top: 10 },
  });
  
  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount} | Blood Donation Platform`,
      105,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  return doc;
};

/**
 * Generate PDF for donation request
 * @param {Object} donation - Donation request object
 * @returns {jsPDF} - PDF document
 */
export const generateDonationRequestPDF = (donation) => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text('Blood Donation Request Details', 105, 20, { align: 'center' });
  
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(0.5);
  doc.line(20, 25, 190, 25);
  
  let yPos = 35;
  
  // Donation Information
  doc.setFontSize(14);
  doc.setTextColor(220, 38, 38);
  doc.text('Donation Information', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  
  const donationInfo = [
    ['Request ID:', donation._id || 'N/A'],
    ['Status:', donation.status ? donation.status.charAt(0).toUpperCase() + donation.status.slice(1) : 'N/A'],
    ['Request Date:', new Date(donation.createdAt).toLocaleDateString()],
    ['Urgency:', donation.isUrgent ? 'URGENT' : 'Normal'],
  ];
  
  donationInfo.forEach(([label, value]) => {
    doc.text(label, 25, yPos);
    doc.text(value, 80, yPos);
    yPos += 7;
  });
  
  yPos += 5;
  
  // Recipient Information
  doc.setFontSize(14);
  doc.setTextColor(220, 38, 38);
  doc.text('Recipient Information', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  
  const recipientInfo = [
    ['Recipient Name:', donation.recipientName || 'N/A'],
    ['Blood Group:', donation.bloodGroup || 'N/A'],
    ['Hospital:', donation.hospitalName || 'N/A'],
    ['Full Address:', donation.fullAddress || 'N/A'],
    ['District:', donation.recipientDistrict || 'N/A'],
    ['Upazila:', donation.recipientUpazila || 'N/A'],
  ];
  
  recipientInfo.forEach(([label, value]) => {
    doc.text(label, 25, yPos);
    
    // Handle long text (wrap text)
    if (label === 'Full Address:' && value.length > 40) {
      const lines = doc.splitTextToSize(value, 120);
      doc.text(lines, 80, yPos);
      yPos += (lines.length - 1) * 7;
    } else {
      doc.text(value, 80, yPos);
    }
    
    yPos += 7;
  });
  
  yPos += 5;
  
  // Donation Details
  doc.setFontSize(14);
  doc.setTextColor(220, 38, 38);
  doc.text('Donation Details', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  
  const donationDetails = [
    ['Donation Date:', donation.donationDate ? new Date(donation.donationDate).toLocaleDateString() : 'N/A'],
    ['Donation Time:', donation.donationTime || 'N/A'],
    ['Units Required:', donation.unitsRequired || '1'],
    ['Request Message:', ''],
  ];
  
  donationDetails.forEach(([label, value]) => {
    doc.text(label, 25, yPos);
    
    if (label === 'Request Message:') {
      if (donation.requestMessage) {
        const messageLines = doc.splitTextToSize(donation.requestMessage, 160);
        doc.text(messageLines, 80, yPos);
        yPos += (messageLines.length - 1) * 7;
      } else {
        doc.text('N/A', 80, yPos);
      }
    } else {
      doc.text(value, 80, yPos);
    }
    
    yPos += 7;
  });
  
  yPos += 10;
  
  // Requester Information (if available)
  if (donation.requester) {
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 38);
    doc.text('Requester Information', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    
    const requesterInfo = [
      ['Name:', donation.requester.name || 'N/A'],
      ['Email:', donation.requester.email || 'N/A'],
      ['Phone:', donation.requester.phone || 'N/A'],
    ];
    
    requesterInfo.forEach(([label, value]) => {
      doc.text(label, 25, yPos);
      doc.text(value, 80, yPos);
      yPos += 7;
    });
  }
  
  yPos += 10;
  
  // Donor Information (if assigned)
  if (donation.donor) {
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 38);
    doc.text('Assigned Donor', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    
    const donorInfo = [
      ['Donor Name:', donation.donor.name || 'N/A'],
      ['Blood Group:', donation.donor.bloodGroup || 'N/A'],
      ['Contact:', donation.donor.phone || donation.donor.email || 'N/A'],
    ];
    
    donorInfo.forEach(([label, value]) => {
      doc.text(label, 25, yPos);
      doc.text(value, 80, yPos);
      yPos += 7;
    });
  }
  
  yPos += 15;
  
  // Important Notes
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Important Notes:', 20, yPos);
  yPos += 7;
  
  const notes = [
    '1. Please bring valid ID proof when going for donation',
    '2. Contact the hospital before visiting',
    '3. Follow all COVID-19 safety protocols',
    '4. Inform if you cannot donate at the scheduled time',
  ];
  
  notes.forEach(note => {
    doc.text(note, 25, yPos);
    yPos += 6;
  });
  
  // Add footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    'Generated by Blood Donation Platform | www.blooddonation.com',
    105,
    doc.internal.pageSize.height - 10,
    { align: 'center' }
  );
  
  return doc;
};

/**
 * Generate PDF for user profile
 * @param {Object} user - User profile object
 * @returns {jsPDF} - PDF document
 */
export const generateProfilePDF = (user) => {
  const doc = new jsPDF();
  
  // Add header with user info
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text('Blood Donor Profile', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`ID: ${user._id || 'N/A'}`, 105, 30, { align: 'center' });
  
  let yPos = 45;
  
  // Personal Information
  doc.setFontSize(14);
  doc.setTextColor(220, 38, 38);
  doc.text('Personal Information', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  
  const personalInfo = [
    ['Full Name:', user.name || 'N/A'],
    ['Email:', user.email || 'N/A'],
    ['Phone:', user.phone || 'N/A'],
    ['Date of Birth:', user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'],
    ['Gender:', user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'N/A'],
  ];
  
  personalInfo.forEach(([label, value]) => {
    doc.text(label, 25, yPos);
    doc.text(value, 80, yPos);
    yPos += 7;
  });
  
  yPos += 5;
  
  // Medical Information
  doc.setFontSize(14);
  doc.setTextColor(220, 38, 38);
  doc.text('Medical Information', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  
  const medicalInfo = [
    ['Blood Group:', user.bloodGroup || 'N/A'],
    ['Last Donation:', user.lastDonationDate ? new Date(user.lastDonationDate).toLocaleDateString() : 'Never'],
    ['Total Donations:', user.totalDonations || '0'],
    ['Weight:', user.weight ? `${user.weight} kg` : 'N/A'],
    ['Height:', user.height ? `${user.height} cm` : 'N/A'],
    ['Medical Conditions:', user.medicalConditions || 'None reported'],
  ];
  
  medicalInfo.forEach(([label, value]) => {
    doc.text(label, 25, yPos);
    
    if (label === 'Medical Conditions:' && value.length > 40) {
      const lines = doc.splitTextToSize(value, 120);
      doc.text(lines, 80, yPos);
      yPos += (lines.length - 1) * 7;
    } else {
      doc.text(value, 80, yPos);
    }
    
    yPos += 7;
  });
  
  yPos += 5;
  
  // Location Information
  doc.setFontSize(14);
  doc.setTextColor(220, 38, 38);
  doc.text('Location Information', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  
  const locationInfo = [
    ['District:', user.district || 'N/A'],
    ['Upazila:', user.upazila || 'N/A'],
    ['Address:', user.address || 'N/A'],
  ];
  
  locationInfo.forEach(([label, value]) => {
    doc.text(label, 25, yPos);
    
    if (label === 'Address:' && value.length > 40) {
      const lines = doc.splitTextToSize(value, 120);
      doc.text(lines, 80, yPos);
      yPos += (lines.length - 1) * 7;
    } else {
      doc.text(value, 80, yPos);
    }
    
    yPos += 7;
  });
  
  yPos += 5;
  
  // Account Information
  doc.setFontSize(14);
  doc.setTextColor(220, 38, 38);
  doc.text('Account Information', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  
  const accountInfo = [
    ['User Role:', user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A'],
    ['Account Status:', user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'N/A'],
    ['Member Since:', user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'],
    ['Last Updated:', user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'],
  ];
  
  accountInfo.forEach(([label, value]) => {
    doc.text(label, 25, yPos);
    doc.text(value, 80, yPos);
    yPos += 7;
  });
  
  yPos += 15;
  
  // Emergency Contact (if available)
  if (user.emergencyContact) {
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 38);
    doc.text('Emergency Contact', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    
    const emergencyInfo = [
      ['Name:', user.emergencyContact.name || 'N/A'],
      ['Relationship:', user.emergencyContact.relationship || 'N/A'],
      ['Phone:', user.emergencyContact.phone || 'N/A'],
    ];
    
    emergencyInfo.forEach(([label, value]) => {
      doc.text(label, 25, yPos);
      doc.text(value, 80, yPos);
      yPos += 7;
    });
  }
  
  // Add footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Generated on ${new Date().toLocaleString()} | Blood Donation Platform`,
    105,
    doc.internal.pageSize.height - 10,
    { align: 'center' }
  );
  
  return doc;
};

/**
 * Generate PDF for donation history
 * @param {Array} donations - Array of donation history objects
 * @param {Object} user - User object
 * @returns {jsPDF} - PDF document
 */
export const generateDonationHistoryPDF = (donations, user) => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text('Donation History Report', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Donor: ${user.name || 'Unknown'} | Blood Group: ${user.bloodGroup || 'N/A'}`, 105, 30, { align: 'center' });
  
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);
  
  let yPos = 45;
  
  // Summary Statistics
  const totalDonations = donations.length;
  const completedDonations = donations.filter(d => d.status === 'done').length;
  const lastDonation = donations.length > 0 ? new Date(donations[0].donationDate).toLocaleDateString() : 'Never';
  
  doc.setFontSize(14);
  doc.setTextColor(220, 38, 38);
  doc.text('Summary Statistics', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  
  const summary = [
    ['Total Donations:', totalDonations.toString()],
    ['Completed Donations:', completedDonations.toString()],
    ['Success Rate:', totalDonations > 0 ? `${Math.round((completedDonations / totalDonations) * 100)}%` : '0%'],
    ['Last Donation:', lastDonation],
  ];
  
  summary.forEach(([label, value]) => {
    doc.text(label, 25, yPos);
    doc.text(value, 80, yPos);
    yPos += 7;
  });
  
  yPos += 10;
  
  // Donation History Table
  if (donations.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 38);
    doc.text('Donation History', 20, yPos);
    yPos += 10;
    
    // Prepare table data
    const tableData = donations.map(donation => [
      new Date(donation.donationDate).toLocaleDateString(),
      donation.recipientName || 'N/A',
      donation.bloodGroup || 'N/A',
      donation.hospitalName || 'N/A',
      donation.status ? donation.status.charAt(0).toUpperCase() + donation.status.slice(1) : 'N/A',
      donation.unitsDonated || '1',
    ]);
    
    // Generate table
    doc.autoTable({
      head: [['Date', 'Recipient', 'Blood Group', 'Hospital', 'Status', 'Units']],
      body: tableData,
      startY: yPos,
      theme: 'striped',
      headStyles: {
        fillColor: [220, 38, 38],
        textColor: 255,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Date
        1: { cellWidth: 35 }, // Recipient
        2: { cellWidth: 20 }, // Blood Group
        3: { cellWidth: 40 }, // Hospital
        4: { cellWidth: 25 }, // Status
        5: { cellWidth: 15 }, // Units
      },
    });
  } else {
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('No donation history found.', 20, yPos);
  }
  
  yPos = doc.lastAutoTable.finalY + 15;
  
  // Blood Donation Benefits
  doc.setFontSize(12);
  doc.setTextColor(220, 38, 38);
  doc.text('Benefits of Blood Donation:', 20, yPos);
  yPos += 8;
  
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  
  const benefits = [
    '• Reduces risk of heart disease',
    '• Helps in weight management',
    '• Stimulates production of new blood cells',
    '• Free health checkup',
    '• Saves lives - one donation can save up to 3 lives',
  ];
  
  benefits.forEach(benefit => {
    doc.text(benefit, 25, yPos);
    yPos += 6;
  });
  
  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount} | Generated on ${new Date().toLocaleDateString()}`,
      105,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  return doc;
};

/**
 * Generate PDF for admin report
 * @param {Object} reportData - Report data object
 * @param {string} reportType - Type of report
 * @returns {jsPDF} - PDF document
 */
export const generateAdminReportPDF = (reportData, reportType = 'monthly') => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text('Blood Donation Platform - Admin Report', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report | Generated on: ${new Date().toLocaleString()}`, 105, 30, { align: 'center' });
  
  let yPos = 45;
  
  // Platform Statistics
  doc.setFontSize(16);
  doc.setTextColor(220, 38, 38);
  doc.text('Platform Statistics', 20, yPos);
  yPos += 12;
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  
  const stats = [
    ['Total Users:', reportData.totalUsers || '0'],
    ['Active Donors:', reportData.activeDonors || '0'],
    ['Total Donations:', reportData.totalDonations || '0'],
    ['Pending Requests:', reportData.pendingRequests || '0'],
    ['Completed Donations:', reportData.completedDonations || '0'],
    ['Total Funding:', reportData.totalFunding ? `$${reportData.totalFunding.toFixed(2)}` : '$0.00'],
  ];
  
  stats.forEach(([label, value], index) => {
    const xPos = index % 2 === 0 ? 25 : 110;
    const rowY = yPos + Math.floor(index / 2) * 10;
    
    doc.text(label, xPos, rowY);
    doc.text(value, xPos + 40, rowY);
  });
  
  yPos += 35;
  
  // Recent Activity Table
  if (reportData.recentActivity && reportData.recentActivity.length > 0) {
    doc.setFontSize(16);
    doc.setTextColor(220, 38, 38);
    doc.text('Recent Activity', 20, yPos);
    yPos += 10;
    
    const tableData = reportData.recentActivity.map(activity => [
      new Date(activity.timestamp).toLocaleDateString(),
      activity.type || 'N/A',
      activity.description || 'N/A',
      activity.user || 'System',
    ]);
    
    doc.autoTable({
      head: [['Date', 'Type', 'Description', 'User']],
      body: tableData,
      startY: yPos,
      theme: 'striped',
      headStyles: {
        fillColor: [220, 38, 38],
        textColor: 255,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 25 },
        2: { cellWidth: 80 },
        3: { cellWidth: 30 },
      },
    });
    
    yPos = doc.lastAutoTable.finalY + 10;
  }
  
  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      'Confidential - Blood Donation Platform Admin Report',
      105,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  return doc;
};

/**
 * Download PDF file
 * @param {jsPDF} doc - PDF document
 * @param {string} filename - Filename for download
 */
export const downloadPDF = (doc, filename) => {
  doc.save(`${filename}.pdf`);
};

/**
 * Open PDF in new window
 * @param {jsPDF} doc - PDF document
 */
export const viewPDF = (doc) => {
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');
};

export default {
  generateDonorsPDF,
  generateDonationRequestPDF,
  generateProfilePDF,
  generateDonationHistoryPDF,
  generateAdminReportPDF,
  downloadPDF,
  viewPDF,
};