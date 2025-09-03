import { useTheme } from '../context/useTheme';

export default function Terms() {
  const { theme, themes } = useTheme();
  const currentTheme = themes[theme];

  return (
    <div className={`${currentTheme.bodyBg} ${currentTheme.bodyText} min-h-screen py-12 px-4 sm:px-6 lg:px-8`}>
      <div className={`${currentTheme.cardBg} ${currentTheme.cardBorder} ${currentTheme.cardShadow} max-w-4xl mx-auto rounded-lg overflow-hidden border`}>
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold bg-gradient-to-r ${currentTheme.headerGradient} bg-clip-text text-transparent`}>
              Terms of Service
            </h1>
            <p className={`mt-2 ${currentTheme.bodyAccent}`}>Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="space-y-8">
            <section>
              <h2 className={`text-xl font-semibold ${currentTheme.bodySecondary} mb-4`}>1. Acceptance of Terms</h2>
              <p className={currentTheme.bodyText}>
                By accessing or using MoodTrack, you agree to be bound by these Terms of Service. 
                If you do not agree to all the terms, you may not use our service.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-semibold ${currentTheme.bodySecondary} mb-4`}>2. Description of Service</h2>
              <p className={currentTheme.bodyText}>
                MoodTrack provides a platform for tracking personal moods and emotions. 
                We reserve the right to modify or discontinue the service at any time.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-semibold ${currentTheme.bodySecondary} mb-4`}>3. User Responsibilities</h2>
              <p className={currentTheme.bodyText}>
                You are responsible for maintaining the confidentiality of your account and password. 
                You agree to immediately notify us of any unauthorized use of your account.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-semibold ${currentTheme.bodySecondary} mb-4`}>4. Privacy</h2>
              <p className={currentTheme.bodyText}>
                Your use of MoodTrack is subject to our Privacy Policy, which explains how we collect, 
                use, and protect your information.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-semibold ${currentTheme.bodySecondary} mb-4`}>5. Limitation of Liability</h2>
              <p className={currentTheme.bodyText}>
                MoodTrack shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use of the service.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-semibold ${currentTheme.bodySecondary} mb-4`}>6. Changes to Terms</h2>
              <p className={currentTheme.bodyText}>
                We reserve the right to modify these terms at any time. Your continued use of the 
                service constitutes acceptance of the modified terms.
              </p>
            </section>

            <div className={`pt-6 mt-6 border-t ${currentTheme.divider}`}>
              <p className={`text-sm ${currentTheme.bodyAccent}`}>
                For questions about these Terms, please contact us at support@moodtrack.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
