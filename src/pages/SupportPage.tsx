import React, { useState } from 'react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const SupportPage: React.FC = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We will get back to you shortly.",
      variant: "default",
    });
    // Reset form
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-game-bg to-game-panel/50 text-white">
      <NavigationBar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Support <span className="text-game-gem">Center</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Need help? Fill out the form below or check our FAQ.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <Card className="bg-game-panel/90 border-game-button/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-white">Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                  <Input 
                    type="text" 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Your Name" 
                    required 
                    className="bg-game-bg/50 border-game-button/30 text-white focus:border-game-gem"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                  <Input 
                    type="email" 
                    id="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="your.email@example.com" 
                    required 
                    className="bg-game-bg/50 border-game-button/30 text-white focus:border-game-gem"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                  <Input 
                    type="text" 
                    id="subject" 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    placeholder="How can we help?" 
                    required 
                    className="bg-game-bg/50 border-game-button/30 text-white focus:border-game-gem"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                  <Textarea 
                    id="message" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    placeholder="Describe your issue or question..." 
                    required 
                    rows={5}
                    className="bg-game-bg/50 border-game-button/30 text-white focus:border-game-gem"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-game-button hover:bg-opacity-90 text-black font-semibold py-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card className="bg-game-panel/90 border-game-button/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-white">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>Before contacting us, you might find your answer in our FAQ section.</p>
              <div className="mt-6">
                <Button asChild className="w-full bg-game-button/30 hover:bg-game-button/50 text-white border border-game-button/50">
                  <a href="/faq">Go to FAQ</a>
                </Button>
              </div>
              <div className="mt-8 pt-6 border-t border-game-button/20">
                <h4 className="font-semibold text-white mb-2">Other Ways to Reach Us:</h4>
                <p><strong>Email:</strong> support@mischiefcasino.example.com</p>
                <p><strong>Live Chat:</strong> Available 24/7 (Coming Soon)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SupportPage;
