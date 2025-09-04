import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { FiHeart, FiUsers, FiTarget, FiGlobe, FiAward, FiCode } from 'react-icons/fi';
import { useTheme } from '../context/useTheme';

const About = () => {
  const { theme, themes } = useTheme();
  const currentTheme = themes[theme];
  
  const teamMembers = [
    
    {
      name: "Dr. Sarah Chen",
      role: "Clinical Psychologist",
      bio: "Specialized in cognitive behavioral therapy and digital mental health interventions. Leads our clinical research team.",
      image: "SC",
      expertise: ["Cognitive Therapy", "Digital Health", "Research"]
    },
    {
      name: "Michael Rodriguez",
      role: "Product Lead",
      bio: "10+ years experience in health tech product development. Passionate about creating tools that make mental health accessible.",
      image: "MR",
      expertise: ["Product Strategy", "UX Design", "Health Tech"]
    },
    {
      name: "Emily Watson",
      role: "Software Engineer",
      bio: "Full-stack developer with focus on secure, scalable applications for healthcare. Ensures your data stays private and safe.",
      image: "EW",
      expertise: ["React", "Node.js", "Security"]
    },
    {
      name: "David Kim",
      role: "Data Scientist",
      bio: "Machine learning expert who develops our mood prediction algorithms and pattern recognition systems.",
      image: "DK",
      expertise: ["Machine Learning", "Data Analysis", "AI"]
    }
  ];

  const values = [
    {
      icon: <FiHeart className="w-8 h-8" />,
      title: "Empathy First",
      description: "We design with compassion and understanding, recognizing that mental health is deeply personal and unique to each individual."
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: "User-Centered",
      description: "Our users guide our development. We continuously incorporate feedback to create tools that truly meet your needs."
    },
    {
      icon: <FiTarget className="w-8 h-8" />,
      title: "Evidence-Based",
      description: "We ground our features in scientific research and collaborate with mental health professionals to ensure effectiveness."
    },
    {
      icon: <FiGlobe className="w-8 h-8" />,
      title: "Accessibility",
      description: "Mental health support should be available to everyone. We strive to make our platform inclusive and accessible to all."
    }
  ];

  const milestones = [
    {
      year: "2021",
      title: "Concept Born",
      description: "Initial research began after identifying the need for better mood tracking tools in mental health care."
    },
    {
      year: "2022",
      title: "Beta Launch",
      description: "First version released to a small group of users for testing and feedback collection."
    },
    {
      year: "2023",
      title: "Clinical Validation",
      description: "Partnership with mental health professionals to validate our approach and methodologies."
    },
    {
      year: "2024",
      title: "Public Launch",
      description: "Official launch with advanced features and expanded platform availability."
    }
  ];

  return (
    <div className={`min-h-screen ${currentTheme.bodyBg} ${currentTheme.bodyText}`}>
      <PageHeader 
        title="About Witty MoodTracker" 
        description="Learn about our mission, team, and the technology behind your emotional wellness journey"
      />
      
      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            At Witty MoodTracker, we believe that understanding your emotional patterns is the first step 
            toward better mental health. Our mission is to provide intuitive, powerful tools that help 
            people track, understand, and improve their emotional well-being through data-driven insights.
          </p>
          <div className={`bg-gradient-to-r ${currentTheme.headerGradient} rounded-xl p-8 text-white`}>
            <p className="text-lg italic">
              "We're not just building an app—we're creating a companion for your mental health journey, 
              empowering you with knowledge and insights to live a more balanced life."
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={`py-16 ${currentTheme.cardBg} px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className={`text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300 ${currentTheme.highlight}`}>
                <div className={`mb-4 flex justify-center ${currentTheme.bodyAccent}`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className={`py-16 ${currentTheme.bodyBg} px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Technology</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with cutting-edge technology to ensure security, reliability, and the best user experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className={`p-6 rounded-xl shadow-md ${currentTheme.cardBg}`}>
              <div className="flex items-center mb-4">
                <FiCode className={`w-8 h-8 mr-3 ${currentTheme.bodyAccent}`} />
                <h3 className="text-xl font-semibold">Modern Stack</h3>
              </div>
              <p className="text-gray-600">
                Built with React, Node.js, and MongoDB for a fast, responsive experience across all devices.
              </p>
            </div>
            
            <div className={`p-6 rounded-xl shadow-md ${currentTheme.cardBg}`}>
              <div className="flex items-center mb-4">
                <FiAward className={`w-8 h-8 mr-3 ${currentTheme.bodyAccent}`} />
                <h3 className="text-xl font-semibold">Advanced Analytics</h3>
              </div>
              <p className="text-gray-600">
                Machine learning algorithms identify patterns and trends in your mood data to provide meaningful insights.
              </p>
            </div>
            
            <div className={`p-6 rounded-xl shadow-md ${currentTheme.cardBg}`}>
              <div className="flex items-center mb-4">
                <FiHeart className={`w-8 h-8 mr-3 ${currentTheme.bodyAccent}`} />
                <h3 className="text-xl font-semibold">Privacy First</h3>
              </div>
              <p className="text-gray-600">
                End-to-end encryption and strict data policies ensure your emotional data remains private and secure.
              </p>
            </div>
          </div>

          <div className={`rounded-xl p-8 shadow-md ${currentTheme.cardBg}`}>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Security & Privacy</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Data Protection</h4>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className={`text-green-500 mr-2 ${currentTheme.bodyAccent}`}>✓</span>
                    <span>End-to-end encryption</span>
                  </li>
                  <li className="flex items-start">
                    <span className={`text-green-500 mr-2 ${currentTheme.bodyAccent}`}>✓</span>
                    <span>Regular security audits</span>
                  </li>
                  <li className="flex items-start">
                    <span className={`text-green-500 mr-2 ${currentTheme.bodyAccent}`}>✓</span>
                    <span>GDPR and HIPAA compliant</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Privacy Commitment</h4>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className={`text-green-500 mr-2 ${currentTheme.bodyAccent}`}>✓</span>
                    <span>No data sold to third parties</span>
                  </li>
                  <li className="flex items-start">
                    <span className={`text-green-500 mr-2 ${currentTheme.bodyAccent}`}>✓</span>
                    <span>Transparent data policies</span>
                  </li>
                  <li className="flex items-start">
                    <span className={`text-green-500 mr-2 ${currentTheme.bodyAccent}`}>✓</span>
                    <span>User control over data</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={`py-16 ${currentTheme.cardBg} px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className={`text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300 ${currentTheme.bodyBg}`}>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 ${currentTheme.highlight}`}>
                  {member.image}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className={`font-medium mb-3 ${currentTheme.bodyAccent}`}>{member.role}</p>
                <p className="text-gray-600 mb-4 text-sm">{member.bio}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {member.expertise.map((skill, skillIndex) => (
                    <span key={skillIndex} className={`text-xs px-2 py-1 rounded-full ${currentTheme.highlight}`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className={`py-16 ${currentTheme.bodyBg} px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Journey</h2>
          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${currentTheme.btnPrimary}`}>
                    {milestone.year}
                  </div>
                  <div className={`w-1 h-full mt-2 ${currentTheme.divider}`}></div>
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-16 bg-gradient-to-r ${currentTheme.headerGradient} px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Join Our Community</h2>
          <p className="text-indigo-100 text-xl mb-8">
            Start your journey to better emotional awareness today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className={`${currentTheme.btnPrimary} font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg`}
            >
              Get Started Free
            </Link>
            <Link
              to="/contact"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-indigo-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-16 ${currentTheme.cardBg} px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className={`text-3xl md:text-4xl font-bold ${currentTheme.bodyAccent}`}>10,000+</div>
              <div className="text-gray-600 mt-2">Active Users</div>
            </div>
            <div>
              <div className={`text-3xl md:text-4xl font-bold ${currentTheme.bodyAccent}`}>500K+</div>
              <div className="text-gray-600 mt-2">Mood Entries</div>
            </div>
            <div>
              <div className={`text-3xl md:text-4xl font-bold ${currentTheme.bodyAccent}`}>95%</div>
              <div className="text-gray-600 mt-2">User Satisfaction</div>
            </div>
            <div>
              <div className={`text-3xl md:text-4xl font-bold ${currentTheme.bodyAccent}`}>24/7</div>
              <div className="text-gray-600 mt-2">Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
