export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          
          <div className="prose prose-blue max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600">
                By accessing or using MoodTrack, you agree to be bound by these Terms of Service. 
                If you do not agree to all the terms, you may not use our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Description of Service</h2>
              <p className="text-gray-600">
                MoodTrack provides a platform for tracking personal moods and emotions. 
                We reserve the right to modify or discontinue the service at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">3. User Responsibilities</h2>
              <p className="text-gray-600">
                You are responsible for maintaining the confidentiality of your account and password. 
                You agree to immediately notify us of any unauthorized use of your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Privacy</h2>
              <p className="text-gray-600">
                Your use of MoodTrack is subject to our Privacy Policy, which explains how we collect, 
                use, and protect your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Limitation of Liability</h2>
              <p className="text-gray-600">
                MoodTrack shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Changes to Terms</h2>
              <p className="text-gray-600">
                We reserve the right to modify these terms at any time. Your continued use of the 
                service constitutes acceptance of the modified terms.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}