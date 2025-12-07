import { Link } from 'react-router-dom';
import { FaHeart, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Search Donors', path: '/search' },
    { name: 'Donation Requests', path: '/donation-requests' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'About Us', path: '/about' },
  ];

  const dashboardLinks = [
    { name: 'My Dashboard', path: '/dashboard' },
    { name: 'My Profile', path: '/dashboard/profile' },
    { name: 'My Donation Requests', path: '/dashboard/my-donation-requests' },
    { name: 'Create Request', path: '/dashboard/create-donation-request' },
    { name: 'Funding', path: '/dashboard/funding' },
  ];

  const resourcesLinks = [
    { name: 'Blood Donation Guide', path: '/guide' },
    { name: 'Eligibility Criteria', path: '/eligibility' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
  ];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const socialLinks = [
    { icon: <FaFacebook />, url: 'https://facebook.com', label: 'Facebook' },
    { icon: <FaTwitter />, url: 'https://twitter.com', label: 'X (Twitter)' },
    { icon: <FaInstagram />, url: 'https://instagram.com', label: 'Instagram' },
    { icon: <FaLinkedin />, url: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaHeart className="text-red-500 text-2xl" />
              <span className="text-2xl font-bold">
                Blood<span className="text-red-500">Connect</span>
              </span>
            </div>
            <p className="text-gray-300 mb-4">
              Connecting donors with recipients, saving lives one donation at a time. 
              Join our community of heroes who make a difference.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-red-400 transition-colors flex items-center"
                  >
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboard Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Dashboard</h3>
            <ul className="space-y-2">
              {dashboardLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-red-400 transition-colors flex items-center"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-red-400 mt-1" />
                <span className="text-gray-300">
                  123 Life Street, Dhaka 1207<br />
                  Bangladesh
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-red-400" />
                <a href="tel:+8801700000000" className="text-gray-300 hover:text-red-400">
                  +880 1700 000000
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-red-400" />
                <a href="mailto:support@bloodconnect.com" className="text-gray-300 hover:text-red-400">
                  support@bloodconnect.com
                </a>
              </li>
            </ul>

            {/* Blood Groups */}
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Blood Groups We Support</h4>
              <div className="flex flex-wrap gap-2">
                {bloodGroups.map((group) => (
                  <span
                    key={group}
                    className="px-3 py-1 bg-red-900 text-red-200 rounded-full text-sm"
                  >
                    {group}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400">
              &copy; {currentYear} BloodConnect. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Made with <FaHeart className="inline text-red-500" /> to save lives
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <Link to="/privacy" className="text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white">
              Terms of Service
            </Link>
            <Link to="/sitemap" className="text-gray-400 hover:text-white">
              Sitemap
            </Link>
            <Link to="/contact" className="text-gray-400 hover:text-white">
              Contact
            </Link>
          </div>
        </div>

        {/* Emergency Banner */}
        <div className="mt-8 p-4 bg-red-900/30 border border-red-800 rounded-lg text-center">
          <p className="font-bold text-lg mb-1">🚨 Emergency?</p>
          <p className="text-gray-300">
            Call our 24/7 emergency hotline: <span className="font-bold text-white">+880 1700 123456</span>
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Available for urgent blood requests
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 text-center">
          <div className="p-4 bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-red-400">1,234+</p>
            <p className="text-gray-400 text-sm">Lives Saved</p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-red-400">5,678+</p>
            <p className="text-gray-400 text-sm">Active Donors</p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-red-400">2,345+</p>
            <p className="text-gray-400 text-sm">Requests Fulfilled</p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-red-400">89%</p>
            <p className="text-gray-400 text-sm">Success Rate</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;