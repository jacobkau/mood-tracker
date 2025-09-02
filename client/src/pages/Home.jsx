// pages/Home.jsx
import { Link } from "react-router-dom";

const Home = () => {
  const { theme, themes } = useContext(ThemeContext);
  const currentTheme = themes[theme];
  return (
    <div className={' ${currentTheme.bodyBg} ${currentTheme.bodyText} min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col'}>



      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Understand Your Emotions, 
              <span className="text-indigo-600"> Improve Your Well-being</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Witty MoodTracker is your personal emotional wellness assistant. Track your moods, identify patterns, 
              and gain valuable insights into your mental health with our intuitive platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg shadow-md hover:shadow-lg text-center"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg text-center"
              >
                Sign In
              </Link>
            </div>
            
            <div className="mt-8 flex items-center text-gray-500">
              <div className="flex -space-x-2 mr-4">
                <div className="w-8 h-8 rounded-full bg-indigo-200 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-purple-200 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-pink-200 border-2 border-white"></div>
              </div>
              <p>Join <span className="font-semibold text-indigo-700">5,000+</span> users tracking their mood daily</p>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-100 transform rotate-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Today's Mood</h3>
                <span className="text-sm text-indigo-600">June 12, 2023</span>
              </div>
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white text-4xl">
                  😊
                </div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-indigo-800 text-sm">"Had a productive day at work and enjoyed my evening walk. Feeling balanced and content."</p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-100 rounded-full blur-xl opacity-70 z-0"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-indigo-100 rounded-full blur-xl opacity-70 z-0"></div>
          </div>
        </div>
      </main>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-indigo-600">92%</div>
              <div className="text-gray-600 mt-2">Users report better mood awareness</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-indigo-600">30+</div>
              <div className="text-gray-600 mt-2">Mood indicators tracked</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-indigo-600">10K+</div>
              <div className="text-gray-600 mt-2">Mood entries logged</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-indigo-600">24/7</div>
              <div className="text-gray-600 mt-2">Secure data protection</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How Witty MoodTracker Helps You</h2>
            <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
              Our comprehensive features are designed to give you a complete picture of your emotional well-being
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Easy Tracking</h3>
              <p className="text-gray-600 mb-4">
                Log your mood in seconds with our intuitive interface. Add notes, tags, and context to each entry for richer insights.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>One-tap mood selection</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Customizable tags and categories</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Daily reminders and prompts</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Insightful Analytics</h3>
              <p className="text-gray-600 mb-4">
                Visualize your emotional patterns with beautiful charts and graphs. Identify triggers, trends, and correlations in your mood data.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Weekly and monthly trends</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Mood correlation analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Exportable reports</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Private & Secure</h3>
              <p className="text-gray-600 mb-4">
                Your emotional data is sensitive. We use bank-level encryption and never share your information with third parties.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>End-to-end encryption</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Biometric authentication</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Local data storage option</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Our Users Say</h2>
            <p className="text-xl text-gray-600 mt-4">Join thousands of users who have transformed their emotional awareness</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-indigo-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-800 font-bold mr-4">JD</div>
                <div>
                  <h4 className="font-semibold">James D.</h4>
                  <div className="flex text-yellow-400">
                    ★★★★★
                  </div>
                </div>
              </div>
              <p className="text-gray-700">
                "Using Witty MoodTracker helped me identify patterns in my anxiety. I now recognize my triggers and can take proactive steps. It's been life-changing."
              </p>
            </div>
            
            <div className="bg-indigo-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center text-purple-800 font-bold mr-4">SR</div>
                <div>
                  <h4 className="font-semibold">Sarah R.</h4>
                  <div className="flex text-yellow-400">
                    ★★★★★
                  </div>
                </div>
              </div>
              <p className="text-gray-700">
                "As a therapist, I recommend Witty MoodTracker to my clients. The analytics provide valuable insights that support our sessions and track progress between visits."
              </p>
            </div>
            
            <div className="bg-indigo-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center text-pink-800 font-bold mr-4">MJ</div>
                <div>
                  <h4 className="font-semibold">Michael J.</h4>
                  <div className="flex text-yellow-400">
                    ★★★★★
                  </div>
                </div>
              </div>
              <p className="text-gray-700">
                "The simple act of tracking my mood daily has made me more mindful. I've noticed positive changes in my emotional resilience since I started using this app."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-indigo-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 mt-4">Everything you need to know about Witty MoodTracker</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-indigo-800 mb-2">How does mood tracking help me?</h3>
              <p className="text-gray-700">
                Regular mood tracking helps you identify patterns, triggers, and trends in your emotional well-being. 
                This awareness can help you make positive changes, recognize early warning signs of mood changes, 
                and communicate more effectively with healthcare providers if needed.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-indigo-800 mb-2">Is my data private?</h3>
              <p className="text-gray-700">
                Absolutely. We take your privacy seriously. Your mood entries are encrypted and stored securely. 
                We never sell your data to third parties, and you can delete your data at any time.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-indigo-800 mb-2">Can I use Witty MoodTracker for free?</h3>
              <p className="text-gray-700">
                Yes, our basic mood tracking and analytics are completely free. We offer premium features for advanced analytics 
                and customization, but the core functionality will always remain free to use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Start Your Journey to Emotional Wellness Today</h2>
          <p className="text-xl text-indigo-100 mb-10">
            Join thousands of users who have discovered the power of mood tracking
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-indigo-600 hover:bg-indigo-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg shadow-md hover:shadow-lg"
            >
              Create Your Account
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-indigo-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              Sign In
            </Link>
          </div>
          
          <p className="text-indigo-200 mt-8">No credit card required • Free forever plan</p>
        </div>
      </section>   
    </div>
  );
};

export default Home;
