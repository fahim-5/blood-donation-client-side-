import React from 'react';
import { FaHeartbeat, FaUsers, FaHandsHelping, FaShieldAlt, FaBullseye, FaAward, FaHistory, FaChartLine, FaGlobe, FaLightbulb } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const AboutUs = () => {
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

  const stats = [
    { value: '10,000+', label: 'Lives Saved', icon: <FaHeartbeat /> },
    { value: '5,000+', label: 'Active Donors', icon: <FaUsers /> },
    { value: '64', label: 'Districts Covered', icon: <FaGlobe /> },
    { value: '24/7', label: 'Emergency Support', icon: <FaShieldAlt /> }
  ];

  const values = [
    {
      icon: <FaHeartbeat className="text-3xl text-red-500" />,
      title: 'Compassion',
      description: 'We believe in putting human lives first. Every decision we make is driven by empathy and care for those in need.'
    },
    {
      icon: <FaShieldAlt className="text-3xl text-blue-500" />,
      title: 'Trust',
      description: 'We maintain the highest standards of safety, privacy, and reliability to build lasting trust with our community.'
    },
    {
      icon: <FaHandsHelping className="text-3xl text-green-500" />,
      title: 'Community',
      description: 'We foster a strong network of donors, recipients, and volunteers working together to save lives.'
    },
    {
      icon: <FaLightbulb className="text-3xl text-yellow-500" />,
      title: 'Innovation',
      description: 'We continuously improve our platform using technology to make blood donation more efficient and accessible.'
    }
  ];

  const milestones = [
    { year: '2020', title: 'Foundation', description: 'Platform launched with 100 initial donors' },
    { year: '2021', title: 'Expansion', description: 'Covered all 64 districts of Bangladesh' },
    { year: '2022', title: 'Mobile App', description: 'Launched mobile application for better accessibility' },
    { year: '2023', title: '10K Milestone', description: 'Celebrated saving 10,000+ lives' },
    { year: '2024', title: 'Award Winning', description: 'Received National Digital Innovation Award' }
  ];

  const teamMembers = [
    { name: 'Dr. Sarah Ahmed', role: 'Medical Director', expertise: 'Hematology Specialist' },
    { name: 'Md. Rahman Khan', role: 'Platform Lead', expertise: 'Technology & Operations' },
    { name: 'Fatima Jahan', role: 'Community Manager', expertise: 'Donor Engagement' },
    { name: 'Aminul Islam', role: 'Emergency Response', expertise: 'Crisis Management' }
  ];

  const achievements = [
    { award: 'National Digital Innovation Award 2024', issuer: 'Digital Bangladesh' },
    { award: 'Best Healthcare Platform 2023', issuer: 'Health Tech Association' },
    { award: 'Community Impact Award 2022', issuer: 'Social Welfare Ministry' },
    { award: 'Excellence in Emergency Response 2021', issuer: 'Red Crescent Society' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-6xl font-bold mb-6"
              >
                Saving Lives, One Drop at a Time
              </motion.h1>
              
              <motion.p
                variants={fadeInUp}
                className="text-xl text-red-100 mb-8 max-w-3xl mx-auto"
              >
                We are Bangladesh's largest digital blood donation platform, 
                connecting compassionate donors with patients in need since 2020.
              </motion.p>
            </motion.div>
          </div>
          
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white -mt-8 relative z-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-red-50 to-white p-6 rounded-2xl shadow-sm text-center"
                >
                  <div className="text-red-600 mb-3 flex justify-center">
                    <div className="text-3xl">{stat.icon}</div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
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

        {/* Our Story */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="relative">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                      <FaHistory className="text-2xl text-red-600" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                      Our Journey Began with a Simple Mission
                    </h2>
                    <p className="text-gray-700 text-lg mb-4">
                      In 2020, after witnessing the critical shortage of blood donors 
                      during medical emergencies, our founders created this platform 
                      to bridge the gap between donors and recipients.
                    </p>
                    <p className="text-gray-700 mb-6">
                      What started as a small initiative has grown into Bangladesh's 
                      most trusted blood donation network, saving thousands of lives 
                      across all 64 districts. Our technology-driven approach ensures 
                      that help reaches those in need within minutes, not hours.
                    </p>
                    <div className="bg-red-50 rounded-xl p-6 border-l-4 border-red-500">
                      <p className="text-gray-800 font-medium italic">
                        "Every second counts in an emergency. Our platform ensures 
                        that blood reaches patients when they need it most."
                      </p>
                      <p className="text-red-600 font-semibold mt-2">
                        — Our Founding Team
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="bg-gradient-to-br from-red-100 to-white rounded-2xl p-8 shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Our Impact Timeline
                    </h3>
                    <div className="space-y-6">
                      {milestones.map((milestone, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                            {milestone.year}
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-1">
                              {milestone.title}
                            </h4>
                            <p className="text-gray-600">
                              {milestone.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Core Values
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                These principles guide everything we do and define who we are
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-700">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-gradient-to-r from-red-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 shadow-lg"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <FaBullseye className="text-xl text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Our Mission
                    </h2>
                  </div>
                  <p className="text-gray-700 text-lg mb-4">
                    To eliminate preventable deaths due to blood shortages by 
                    creating an efficient, reliable, and accessible blood donation 
                    ecosystem that connects donors with recipients in real-time.
                  </p>
                  <div className="bg-red-50 rounded-xl p-6 mt-6">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Key Objectives:
                    </h4>
                    <ul className="text-gray-700 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 mt-1">•</span>
                        Reduce emergency blood search time to under 30 minutes
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 mt-1">•</span>
                        Register 100,000+ active blood donors nationwide
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 mt-1">•</span>
                        Achieve 100% district coverage with emergency response teams
                      </li>
                    </ul>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 shadow-lg"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaChartLine className="text-xl text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Our Vision
                    </h2>
                  </div>
                  <p className="text-gray-700 text-lg mb-4">
                    To become the world's most trusted digital blood donation 
                    platform, where no life is lost due to unavailability of blood, 
                    and every community has instant access to safe blood supply.
                  </p>
                  <div className="bg-blue-50 rounded-xl p-6 mt-6">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Future Goals:
                    </h4>
                    <ul className="text-gray-700 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        Expand to neighboring countries by 2026
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        Integrate AI-powered matching and prediction systems
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        Establish mobile blood collection units nationwide
                      </li>
                    </ul>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Meet Our Leadership Team
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Dedicated professionals working tirelessly to make blood donation accessible to all
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-red-200 to-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-red-600">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-red-600 font-semibold mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {member.expertise}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="py-16 bg-gradient-to-r from-red-600 to-red-700">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaAward className="text-2xl text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Recognition & Awards
              </h2>
              <p className="text-red-100 max-w-2xl mx-auto">
                Our commitment to saving lives has been recognized nationally and internationally
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.award}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaAward className="text-xl text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {achievement.award}
                        </h3>
                        <p className="text-red-100">
                          Awarded by {achievement.issuer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Join Us CTA */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-red-50 to-blue-50 rounded-2xl p-12 text-center"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Join Our Lifesaving Mission
                </h2>
                <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
                  Whether you're a donor, volunteer, or partner organization, 
                  together we can save more lives and build a healthier community.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/register"
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Become a Donor
                  </a>
                  <a
                    href="/contact"
                    className="bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300"
                  >
                    Partner With Us
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;