export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          
          <div className="prose prose-blue max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Information We Collect</h2>
              <p className="text-gray-600">
                We collect personal information you provide when creating an account, including your 
                name, email address, and mood data you choose to track.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-600">
                Your information is used to provide and improve our services, communicate with you, 
                and personalize your experience. We do not sell your personal data to third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Data Security</h2>
              <p className="text-gray-600">
                We implement industry-standard security measures to protect your data. However, no 
                method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Cookies and Tracking</h2>
              <p className="text-gray-600">
                We use cookies to enhance your experience. You can disable cookies in your browser 
                settings, but some features may not function properly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Third-Party Services</h2>
              <p className="text-gray-600">
                We may use third-party services that collect information for analytics and performance 
                monitoring. These services have their own privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Changes to This Policy</h2>
              <p className="text-gray-600">
                We may update this policy periodically. We will notify you of significant changes 
                through the email associated with your account.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}