import React from 'react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-game-bg to-game-panel/50 text-white">
      <NavigationBar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Terms & <span className="text-game-gem">Conditions</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Please read our terms and conditions carefully before using our platform.
          </p>
        </div>
        
        <Card className="bg-game-panel/90 border-game-button/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-white">Our Terms</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>Welcome to Mischief Casino! These terms and conditions outline the rules and regulations for the use of Mischief Casino's Website, located at [Your Website URL].</p>
            <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use Mischief Casino if you do not agree to take all of the terms and conditions stated on this page.</p>
            
            <h3 className="text-lg font-semibold text-white pt-4">1. Eligibility</h3>
            <p>You must be at least 18 years of age to use our services. By using our services, you represent and warrant that you meet this age requirement.</p>
            
            <h3 className="text-lg font-semibold text-white pt-4">2. Account Registration</h3>
            <p>To access certain features of our platform, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</p>
            
            <h3 className="text-lg font-semibold text-white pt-4">3. User Conduct</h3>
            <p>You agree not to use the platform for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the platform in any way that could damage the platform, the services, or the general business of Mischief Casino.</p>
            
            <h3 className="text-lg font-semibold text-white pt-4">4. Deposits and Withdrawals</h3>
            <p>Details about deposit and withdrawal processes, limits, and fees will be available on the platform. We reserve the right to change these at any time.</p>
            
            <h3 className="text-lg font-semibold text-white pt-4">5. Responsible Gaming</h3>
            <p>We are committed to responsible gaming. We provide tools and resources to help you manage your gaming activity. Please refer to our Responsible Gaming page for more information.</p>
            
            <h3 className="text-lg font-semibold text-white pt-4">6. Intellectual Property</h3>
            <p>All content on this platform, including text, graphics, logos, images, and software, is the property of Mischief Casino or its content suppliers and protected by international copyright laws.</p>
            
            <h3 className="text-lg font-semibold text-white pt-4">7. Limitation of Liability</h3>
            <p>Mischief Casino will not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>
            
            <h3 className="text-lg font-semibold text-white pt-4">8. Changes to Terms</h3>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
            
            <h3 className="text-lg font-semibold text-white pt-4">9. Contact Us</h3>
            <p>If you have any questions about these Terms, please contact us via our Support page.</p>
            
            <p className="pt-6 text-sm text-gray-400">Last updated: May 12, 2025</p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default TermsPage;
