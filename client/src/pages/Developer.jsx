import { FiGithub, FiTwitter, FiLinkedin, FiGlobe } from 'react-icons/fi';

export default function Developer() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">About the Developer</h1>
          <p className="text-lg text-gray-600">
            Meet the creator behind MoodTrack
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl">
                <img 
    src="/logo.png" 
    alt="MoodTracker Logo"
    className="h-20 w-25"
  />
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Jacob Mwambwa</h2>
                <p className="text-gray-600 mb-4">Full Stack Developer & Mental Health Advocate</p>
                
                <p className="text-gray-700 mb-6">
                  I created MoodTrack to help people better understand their emotional patterns and 
                  improve their mental wellbeing. With a background in psychology and software 
                  development, I wanted to build a tool that combines both fields to create something 
                  truly helpful.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="https://github.com/jacobkau" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-700 hover:text-blue-600"
                  >
                    <FiGithub className="mr-2" /> GitHub
                  </a>
                  <a 
                    href="https://x.com/jacob_witty4" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-700 hover:text-blue-600"
                  >
                    <FiTwitter className="mr-2" /> Twitter
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/jacob-mwambwa-8b7296362/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-700 hover:text-blue-600"
                  >
                    <FiLinkedin className="mr-2" /> LinkedIn
                  </a>
                  <a 
                    href="https://jacobwittyp.netlify.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-700 hover:text-blue-600"
                  >
                    <FiGlobe className="mr-2" /> Portfolio
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">System Technical Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Frontend</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>React</li>
                    <li>Tailwind CSS</li>
                    <li>Vite</li>
                    <li>React Router</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Backend</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>Node.js</li>
                    <li>Express</li>
                    <li>MongoDB</li>
                    <li>JWT Authentication</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}