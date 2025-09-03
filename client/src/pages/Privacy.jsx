
import { useContext } from 'react';
import { useTheme } from '../context/useTheme';

export default function Privacy() {
  const { theme, themes } = useContext(ThemeContext);
  const currentTheme = themes[theme];

  return (
    <div className={`min-h-screen ${currentTheme.bodyBg} ${currentTheme.bodyText} flex flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-3xl w-full">
        <div className={`${currentTheme.cardBg} ${currentTheme.cardShadow} ${currentTheme.cardBorder} rounded-xl p-6 mb-8 border`}>
          <h1 className={`text-3xl font-bold mb-6 bg-gradient-to-r ${currentTheme.headerGradient} bg-clip-text text-transparent`}>
            Privacy Policy
          </h1>
          <p className="mb-6 leading-relaxed">
            Your privacy is important to us. This Privacy Policy explains how we
            collect, use, and protect your information when you use MoodTracker.
          </p>
        </div>

        <div className="space-y-8">
          <div className={`${currentTheme.cardBg} ${currentTheme.cardShadow} ${currentTheme.cardBorder} rounded-xl p-6 border`}>
            <h2 className={`text-xl font-semibold mb-4 ${currentTheme.bodySecondary}`}>
              1. Information We Collect
            </h2>
            <p className="leading-relaxed">
              We may collect personal information such as your name, email address,
              and any data you provide while using the app.
            </p>
          </div>

          <div className={`${currentTheme.cardBg} ${currentTheme.cardShadow} ${currentTheme.cardBorder} rounded-xl p-6 border`}>
            <h2 className={`text-xl font-semibold mb-4 ${currentTheme.bodySecondary}`}>
              2. How We Use Your Information
            </h2>
            <p className="leading-relaxed">
              The information is used to provide and improve our services, personalize
              your experience, and ensure secure access.
            </p>
          </div>

          <div className={`${currentTheme.cardBg} ${currentTheme.cardShadow} ${currentTheme.cardBorder} rounded-xl p-6 border`}>
            <h2 className={`text-xl font-semibold mb-4 ${currentTheme.bodySecondary}`}>
              3. Data Protection
            </h2>
            <p className="leading-relaxed">
              We implement security measures to protect your personal data. However,
              no method of transmission over the Internet is completely secure.
            </p>
          </div>

          <div className={`${currentTheme.cardBg} ${currentTheme.cardShadow} ${currentTheme.cardBorder} rounded-xl p-6 border`}>
            <h2 className={`text-xl font-semibold mb-4 ${currentTheme.bodySecondary}`}>
              4. Contact Us
            </h2>
            <p className="leading-relaxed">
              If you have questions about this Privacy Policy, you can contact us at
              <a 
                href="mailto:support@moodtracker.com" 
                className={`${currentTheme.bodyAccent} underline font-medium ml-1`}
              >
                support@moodtracker.com
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
