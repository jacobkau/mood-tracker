import { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiUsers, FiBriefcase } from "react-icons/fi";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [activeTab, setActiveTab] = useState("contact"); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formEndpoint = activeTab === "contact" 
        ? 'https://formspree.io/f/mnnzapdn' 
        : 'https://formspree.io/f/xnnzaoya'; 
      
      const response = await fetch(formEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      setSubmitMessage(activeTab === "contact" 
        ? 'Thank you! Your message has been sent.' 
        : 'Thank you for your partnership interest! We will contact you soon.');
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setSubmitMessage('Error sending message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {activeTab === "contact" ? "Contact Us" : "Partner With Us"}
          </h1>
          <p className="text-lg text-gray-600">
            {activeTab === "contact" 
              ? "Have questions? We're here to help!" 
              : "Let's work together to make a difference!"}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("contact")}
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === "contact"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FiMail />
                Contact Us
              </div>
            </button>
            <button
              onClick={() => setActiveTab("partnership")}
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === "partnership"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FiUsers />
                Partner With Us
              </div>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {activeTab === "contact" ? "Get in Touch" : "Partnership Opportunities"}
              </h2>

              <div className="space-y-4">
                {activeTab === "contact" ? (
                  <>
                    <div className="flex items-start">
                      <FiMail className="text-blue-500 mt-1 mr-4" size={20} />
                      <div>
                        <h3 className="font-medium text-gray-900">Email</h3>
                        <p className="text-gray-600">kaujacob4@gmail.com</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FiPhone className="text-blue-500 mt-1 mr-4" size={20} />
                      <div>
                        <h3 className="font-medium text-gray-900">Phone</h3>
                        <p className="text-gray-600">+(254) 768 374 497</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FiMapPin className="text-blue-500 mt-1 mr-4" size={20} />
                      <div>
                        <h3 className="font-medium text-gray-900">Address</h3>
                        <p className="text-gray-600">Kitui, Eastern Kenya.</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start">
                      <FiBriefcase className="text-blue-500 mt-1 mr-4" size={20} />
                      <div>
                        <h3 className="font-medium text-gray-900">Business Partnerships</h3>
                        <p className="text-gray-600">Collaborate with us to expand mental health support</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FiUsers className="text-blue-500 mt-1 mr-4" size={20} />
                      <div>
                        <h3 className="font-medium text-gray-900">Community Programs</h3>
                        <p className="text-gray-600">Join our initiatives to promote mental wellness</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FiMail className="text-blue-500 mt-1 mr-4" size={20} />
                      <div>
                        <h3 className="font-medium text-gray-900">Sponsorships</h3>
                        <p className="text-gray-600">Support our mission through sponsorships</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {activeTab === "contact" ? "Message" : "Tell us about your partnership interest"}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={activeTab === "partnership" ? "What type of partnership are you interested in? How can we work together?" : ""}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isSubmitting 
                      ? "Sending..." 
                      : activeTab === "contact" 
                        ? "Send Message" 
                        : "Submit Partnership Request"}
                  </button>
                </div>

                {submitMessage && (
                  <p
                    className={`text-sm ${
                      submitMessage.includes("Thank you") || submitMessage.includes("contact you")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {submitMessage}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
