import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { contactSupport } from '../services/api';

const FAQ = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await contactSupport(contactForm);
      setSubmitStatus('success');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
      console.error('Support request failed:', error);
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
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Frequently Asked Questions" 
        description="Find answers to common questions about Witty MoodTracker"
      />
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">{item.question}</h3>
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${activeIndex === index ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </button>
              {activeIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Still have questions?</h2>
          <p className="text-indigo-100 mb-6">Our support team is here to help you</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-indigo-600 hover:bg-indigo-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
              Contact Support
            </button>
            <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-indigo-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
              Visit Help Center
            </button>
          </div>
        </div>
      </div>
    </div>
     <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Contact Support</h3>
      <form onSubmit={handleContactSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Your Name"
            value={contactForm.name}
            onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
            className="p-2 border rounded-md"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={contactForm.email}
            onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
            className="p-2 border rounded-md"
            required
          />
        </div>
        <input
          type="text"
          placeholder="Subject"
          value={contactForm.subject}
          onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
          className="p-2 border rounded-md w-full"
          required
        />
        <textarea
          placeholder="How can we help you?"
          value={contactForm.message}
          onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
          className="p-2 border rounded-md w-full h-32"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
        {submitStatus === 'success' && (
          <p className="text-green-600">Message sent successfully!</p>
        )}
        {submitStatus === 'error' && (
          <p className="text-red-600">Failed to send message. Please try again.</p>
        )}
      </form>
    </div>
  );
};

export default FAQ;
