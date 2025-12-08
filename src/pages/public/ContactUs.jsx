import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaPaperPlane, FaCheckCircle, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ContactForm from '../../components/forms/ContactForm';

const ContactUs = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const contactInfo = [
    {
      icon: <FaEnvelope className="text-2xl text-red-600" />,
      title: 'Email Address',
      details: ['support@blooddonation.org', 'info@blooddonation.org'],
      action: 'mailto:support@blooddonation.org'
    },
    {
      icon: <FaPhone className="text-2xl text-blue-600" />,
      title: 'Phone Numbers',
      details: ['+880 1234 567890', '+880 9876 543210'],
      subtext: '24/7 Emergency Helpline: 10666',
      action: 'tel:+8801234567890'
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl text-green-600" />,
      title: 'Office Address',
      details: ['123 Life Saver Road', 'Dhaka 1207, Bangladesh'],
      action: 'https://maps.google.com/?q=Dhaka+Bangladesh'
    },
    {
      icon: <FaClock className="text-2xl text-purple-600" />,
      title: 'Working Hours',
      details: ['Sunday - Thursday: 9:00 AM - 6:00 PM', 'Friday - Saturday: 10:00 AM - 4:00 PM'],
      subtext: 'Emergency services available 24/7'
    }
  ];

  const faqs = [
    {
      question: 'How quickly do you respond to blood requests?',
      answer: 'We prioritize requests based on urgency. Critical requests are processed within 15 minutes, while standard requests are handled within 1-2 hours during working hours.'
    },
    {
      question: 'Can I donate blood if I have a common cold?',
      answer: 'No, you should wait until you have fully recovered from any illness, including the common cold. This ensures both your safety and the safety of the recipient.'
    },
    {
      question: 'How do I register as a blood donor?',
      answer: 'Click on the "Register" button in the top navigation, fill out the registration form with your details, blood type, and location. Once verified, you\'ll be added to our donor database.'
    },
    {
      question: 'Is my personal information safe?',
      answer: 'Yes, we take data privacy very seriously. Your contact information is only shared with recipients when you agree to donate, and all data is encrypted and stored securely.'
    }
  ];

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Form submitted:', formData);
      setSubmitSuccess(true);
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { icon: <FaFacebook />, label: 'Facebook', url: 'https://facebook.com/blooddonation', color: 'bg-blue-600 hover:bg-blue-700' },
    { icon: <FaTwitter />, label: 'Twitter', url: 'https://twitter.com/blooddonation', color: 'bg-sky-500 hover:bg-sky-600' },
    { icon: <FaInstagram />, label: 'Instagram', url: 'https://instagram.com/blooddonation', color: 'bg-pink-600 hover:bg-pink-700' },
    { icon: <FaLinkedin />, label: 'LinkedIn', url: 'https://linkedin.com/company/blooddonation', color: 'bg-blue-700 hover:bg-blue-800' }
  ];

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
                Contact Us
              </h1>
              <p className="text-xl text-red-100 mb-8">
                Get in touch with our team. We're here to help save lives.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Success Message */}
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container mx-auto px-4 mt-8"
          >
            <div className="max-w-4xl mx-auto">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center gap-4">
                <FaCheckCircle className="text-3xl text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-green-700">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Contact Info & Form */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    Get in Touch
                  </h2>
                  
                  <div className="space-y-6 mb-8">
                    {contactInfo.map((info, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-start gap-4"
                      >
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
                          {info.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {info.title}
                          </h3>
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-gray-600">
                              {detail}
                            </p>
                          ))}
                          {info.subtext && (
                            <p className="text-red-600 font-medium mt-1">
                              {info.subtext}
                            </p>
                          )}
                          {info.action && (
                            <a
                              href={info.action}
                              target={info.action.includes('http') ? '_blank' : '_self'}
                              rel="noopener noreferrer"
                              className="text-red-600 hover:text-red-700 font-medium text-sm mt-1 inline-block"
                            >
                              {info.action.includes('mailto') ? 'Send Email' : 
                               info.action.includes('tel') ? 'Call Now' : 
                               'View on Map'}
                            </a>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Social Links */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Follow Us
                    </h3>
                    <div className="flex gap-3">
                      {socialLinks.map((social, index) => (
                        <motion.a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 * index }}
                          className={`${social.color} text-white w-10 h-10 rounded-lg flex items-center justify-center transition-transform hover:scale-110`}
                          aria-label={social.label}
                        >
                          {social.icon}
                        </motion.a>
                      ))}
                    </div>
                  </div>

                  {/* Emergency Notice */}
                  <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaPhone className="text-red-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-red-800 mb-1">
                          Emergency Blood Need?
                        </h4>
                        <p className="text-red-700 mb-2">
                          For urgent blood requirements requiring immediate attention:
                        </p>
                        <a
                          href="tel:10666"
                          className="text-xl font-bold text-red-600 hover:text-red-700"
                        >
                          Call 10666
                        </a>
                        <p className="text-sm text-red-600 mt-1">
                          24/7 National Emergency Blood Service
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <FaPaperPlane className="text-red-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Send us a Message
                      </h2>
                    </div>
                    
                    <ContactForm
                      onSubmit={handleFormSubmit}
                      isSubmitting={isSubmitting}
                    />
                    
                    <div className="mt-8 pt-8 border-t border-gray-200">
                      <p className="text-gray-600 text-sm">
                        We typically respond to inquiries within 24 hours during business days.
                        For emergency blood requests, please use our emergency hotline.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-gray-600">
                  Find quick answers to common questions about blood donation
                </p>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-6"
              >
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-300"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-700">
                      {faq.answer}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Find Our Office
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      {/* Map Placeholder */}
                      <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-xl h-96 flex items-center justify-center">
                        <div className="text-center">
                          <FaMapMarkerAlt className="text-6xl text-red-600 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Dhaka Headquarters
                          </h3>
                          <p className="text-gray-600 mb-4">
                            123 Life Saver Road, Dhaka 1207
                          </p>
                          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                            Open in Google Maps
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Parking Information
                          </h4>
                          <p className="text-gray-600 text-sm">
                            Free parking available in the basement parking lot. 
                            Visitor parking spaces are marked near the entrance.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Public Transportation
                          </h4>
                          <ul className="text-gray-600 text-sm space-y-1">
                            <li>• Nearest metro station: 500m walk</li>
                            <li>• Bus stop: Directly in front</li>
                            <li>• Ride sharing drop-off zone available</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Accessibility
                          </h4>
                          <p className="text-gray-600 text-sm">
                            Wheelchair accessible entrance and facilities available.
                            Elevator service to all floors.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-red-600 to-red-700">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Need Immediate Assistance?
              </h2>
              <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
                Our emergency response team is available 24/7 to handle urgent blood requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:10666"
                  className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105"
                >
                  Call Emergency Hotline
                </a>
                <a
                  href="mailto:emergency@blooddonation.org"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300"
                >
                  Send Emergency Email
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactUs;