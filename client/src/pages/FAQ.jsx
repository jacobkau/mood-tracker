import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { contactSupport } from '../services/api';
import { toast } from 'react-toastify';
import { useTheme } from '../context/useTheme';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const { theme, themes } = useTheme();
  const currentTheme = themes[theme];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await contactSupport(contactForm);
      setSubmitStatus('success');
      setContactForm({ name: '', email: '', subject: '', message: '' });
      toast.success('Support request submitted successfully!');
    } catch (error) {
      setSubmitStatus('error');
      console.error('Support request failed:', error);
      toast.error(error.response?.data?.error || 'Failed to submit support request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqItems = [
    {
      question: "How does mood tracking work?",
      answer: "Mood tracking involves regularly recording your emotional state, along with any relevant notes about what might be influencing your mood. Witty MoodTracker makes this process simple with an intuitive interface, reminders, and analytics to help you spot patterns over time."
    },
    {
      question: "Is my data private and secure?",
      answer: "Yes, we take your privacy very seriously. All your data is encrypted, and we never share your personal information with third parties. You can also enable additional security features like biometric authentication for extra protection."
    },
    {
      question: "Can I use Witty MoodTracker for free?",
      answer: "Yes, we offer a free plan that includes basic mood tracking and limited history. Our premium plans unlock advanced features like extended history, detailed analytics, and custom reminders."
    },
    {
      question: "How often should I track my mood?",
      answer: "We recommend tracking your mood at least once daily, but you can do it more frequently if you prefer. Many users find it helpful to check in at consistent times, such as morning, afternoon, and evening, to get a complete picture of their emotional patterns."
    },
    {
      question: "Can I export my mood data?",
      answer: "Yes, with our Pro and Premium plans, you can export your mood data in various formats (CSV, PDF) to share with healthcare providers or for your personal records."
    },
    {
      question: "Does Witty MoodTracker replace therapy?",
      answer: "No, Witty MoodTracker is designed to complement mental health care, not replace it. While our app can help you better understand your emotional patterns, it's not a substitute for professional therapy or medical treatment when needed."
    },
    {
      question: "How do I set up reminders?",
      answer: "You can set up reminders in the app settings. Choose the times that work best for you, and we'll send you gentle notifications to check in with your mood."
    },
    {
      question: "Can I use the app on multiple devices?",
      answer: "Yes, your account syncs across all your devices. Simply log in on any device to access your mood history and preferences."
    },
    {
      question: "What if I forget to track my mood?",
      answer: "Don't worry! The app is designed to be flexible. You can always go back and add entries for previous days. Regular tracking is helpful, but occasional missed entries won't disrupt your overall patterns."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription at any time from your account settings. Your access to premium features will continue until the end of your current billing period."
    }
  ];

  return (
    <div className={'${currentTheme.bodyBg} ${currentTheme.bodyText} min-h-screen bg-gray-50'}>
      <PageHeader 
        title="Frequently Asked Questions" 
        description="Find answers to common questions about Witty MoodTracker"
      />
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
              <button
                className="w-full px-6 py-4 text-left focus:outline-none flex items-center justify-between"
                onClick={() => toggleFAQ(index)}
                aria-expanded={activeIndex === index}
              >
                <h3 className="text-lg font-medium text-gray-900 pr-4">{item.question}</h3>
                <svg
                  className={`w-5 h-5 transition-transform duration-200 flex-shrink-0 ${
                    activeIndex === index ? 'transform rotate-180 text-indigo-600' : 'text-gray-400'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              {activeIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Contact Support Section */}
        <div className="mt-16 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Still have questions?</h2>
          <p className="text-gray-600 text-center mb-6">
            Our support team is here to help you with any questions or issues you might have
          </p>
          
          <form onSubmit={handleContactSubmit} className="space-y-4 max-w-md mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                value={contactForm.name}
                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={contactForm.email}
                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              value={contactForm.subject}
              onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
              className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <textarea
              placeholder="How can we help you?"
              value={contactForm.message}
              onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
              className="p-3 border border-gray-300 rounded-md w-full h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </span>
              ) : (
                'Send Message to Support'
              )}
            </button>
            
            {submitStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <p className="text-green-700 text-sm">Message sent successfully! We'll get back to you within 24 hours.</p>
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-700 text-sm">Failed to send message. Please try again or email us directly at support@wtymoodtracker.com</p>
              </div>
            )}
          </form>
        </div>

        {/* Additional Help Resources */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/guides"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-center group"
          >
            <div className="text-2xl mb-2">📚</div>
            <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">User Guides</h3>
            <p className="text-sm text-gray-600 mt-1">Step-by-step instructions</p>
          </Link>
          
          <Link
            to="/blog"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-center group"
          >
            <div className="text-2xl mb-2">✍️</div>
            <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">Blog</h3>
            <p className="text-sm text-gray-600 mt-1">Tips and insights</p>
          </Link>
          
          <Link
            to="/contact"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-center group"
          >
            <div className="text-2xl mb-2">📞</div>
            <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">Contact</h3>
            <p className="text-sm text-gray-600 mt-1">Get in touch with us</p>
          </Link>
        </div>

        {/* Quick Support Info */}
        <div className="mt-8 bg-indigo-50 rounded-lg p-6">
          <h3 className="font-semibold text-indigo-900 mb-2">Quick Support</h3>
          <p className="text-indigo-700 text-sm">
            Email: support@wtymoodtracker.com<br />
            Response time: Typically within 24 hours<br />
            Hours: Monday-Friday, 9AM-6PM EST
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
