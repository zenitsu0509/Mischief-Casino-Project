import React from 'react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-game-bg to-game-panel/50 text-white">
      <NavigationBar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Privacy <span className="text-game-gem">Policy</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
        </div>
        
        <Card className="bg-game-panel/90 border-game-button/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-white">Our Commitment to Privacy</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>Mischief Casino is committed to protecting your privacy. This Privacy Policy applies to all information collected through our website and services.</p>
            
            <h3 className="text-lg font-semibold text-white pt-4">1. Information We Collect</h3>
            <p>We may collect personal information such as your name, email address, date of birth, and payment information when you register an account, make deposits, or use our services. We also collect non-personal information like IP address, browser type, and usage data.</p>
            
            <h3 className="text-lg font-semibold text-white pt-4">2. How We Use Your Information</h3>
            <p>Your information is used to provide and improve our services, process transactions, communicate with you, personalize your experience, and comply with legal obligations. We may also use your information for marketing purposes, with your consent.</p>
            
            <h3 className="text-lg font-semibold text-white pt-4">3. Information Sharing and Disclosure</h3>
            <p>We do not sell, trade, or otherwise transfer your personal information to outside parties without your consent, except as required by law or to trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.</p>
            
            <h3 className="text-lg font-semibold text-white pt-4">4. Data Security</h3>
            <p>We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>
            
            <h3 className="text-lg font-semibold text-white pt-4">5. Cookies</h3>
            <p>We use cookies to enhance your experience, gather general visitor information, and track visits to our website. You can choose to disable cookies through your browser settings.</p>
            
            <h3 className="text-lg font-semibold text-white pt-4">6. Your Rights</h3>
            <p>You have the right to access, correct, or delete your personal information. You can also object to or restrict certain processing of your data. Please contact us to exercise these rights.</p>
            
            <h3 className="text-lg font-semibold text-white pt-4">7. Changes to This Policy</h3>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
            
            <h3 className="text-lg font-semibold text-white pt-4">8. Contact Us</h3>
            <p>If you have any questions about this Privacy Policy, please contact us via our Support page.</p>
            
            <p className="pt-6 text-sm text-gray-400">Last updated: May 12, 2025</p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
