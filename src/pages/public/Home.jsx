import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUsers, FaHeartbeat, FaHandsHelping, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import FeatureCard from '../../components/ui/FeatureCard';
import WelcomeBanner from '../../components/ui/WelcomeBanner';
import ContactForm from '../../components/forms/ContactForm';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('features');

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const features = [
    {
      id: 1,
      icon: <FaSearch className="text-3xl text-red-500" />,
      title: 'Find Blood Donors',
      description: 'Search for blood donors by location and blood type in real-time.',
      link: '/search-donors',
      linkText: 'Search Now'
    },
    {
      id: 2,
      icon: <FaUsers className="text-3xl text-blue-500" />,
      title: 'Become a Donor',
      description: 'Join our community of lifesavers and register as a blood donor.',
      link: '/register',
      linkText: 'Join Now'
    },
    {
      id: 3,
      icon: <FaHeartbeat className="text-3xl text-green-500" />,
      title: 'Request Blood',
      description: 'Create urgent blood donation requests for patients in need.',
      link: '/donation-requests',
      linkText: 'View Requests'
    },
    {
      id: 4,
      icon: <FaHandsHelping className="text-3xl text-purple-500" />,
      title: 'Volunteer',
      description: 'Help us coordinate and manage donation requests efficiently.',
      link: '/register',
      linkText: 'Get Involved'
    }
  ];

  const stats = [
    { label: 'Lives Saved', value: '10,000+' },
    { label: 'Active Donors', value: '5,000+' },
    { label: 'Blood Requests', value: '2,500+' },
    { label: 'Cities Covered', value: '64+' }
  ];

  const handleJoinAsDonor = () => {
    navigate('/register');
  };

  const handleSearchDonors = () => {
    navigate('/search-donors');
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="home-page min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Banner */}
      <section className="hero-section relative bg-gradient-to-r from-red-50 to-red-100 py-16 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Every Drop <span className="text-red-600">Counts</span>
            </motion.h1>
            
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto"
            >
              Connecting blood donors with recipients in need. Join our community 
              of lifesavers and make a difference today.
            </motion.p>
            
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={handleJoinAsDonor}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Join as a Donor
                <FaArrowRight />
              </button>
              
              <button
                onClick={handleSearchDonors}
                className="bg-white hover:bg-gray-100 text-red-600 border-2 border-red-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Search Donors
                <FaSearch />
              </button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-red-400 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-red-300 rounded-full"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-gradient-to-br from-red-50 to-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How We Help Save Lives
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform bridges the gap between blood donors and recipients, 
              ensuring timely access to blood when it matters most.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="how-it-works-section py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Simple Process, Lifesaving Impact
              </h2>
              <p className="text-gray-600">
                It takes just a few steps to become a hero
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: 1, title: 'Register', desc: 'Sign up as a donor or recipient' },
                { step: 2, title: 'Search/Request', desc: 'Find donors or create requests' },
                { step: 3, title: 'Connect & Donate', desc: 'Coordinate and save lives' }
              ].map((item) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: item.step * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center p-6"
                >
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold text-lg"
              >
                Learn More About How It Works
                <FaArrowRight />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Preview */}
      <section className="contact-preview-section py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Get in Touch
                </h2>
                <p className="text-gray-600 mb-6">
                  Have questions? Need assistance? Our team is here to help you 
                  24/7. Reach out to us for any inquiries about blood donation, 
                  requests, or partnerships.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <FaHandsHelping className="text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">24/7 Support</h4>
                      <p className="text-gray-600">Emergency assistance available</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <ContactForm compact={true} />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section py-20 bg-gradient-to-r from-red-600 to-red-700">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of lifesavers today. Your blood donation can save up to three lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
              >
                Become a Donor
              </Link>
              <Link
                to="/donation-requests"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300"
              >
                View Urgent Requests
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;