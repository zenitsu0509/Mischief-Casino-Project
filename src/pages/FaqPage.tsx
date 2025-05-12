import React from 'react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const faqData = [
  {
    question: "How do I create an account?",
    answer: "Click on the 'Login / Register' button in the top right corner. Fill in the required details and submit the form. You will receive a confirmation email to verify your account."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept various payment methods including credit/debit cards (Visa, MasterCard), e-wallets (PayPal, Skrill, Neteller), and cryptocurrency (Bitcoin, Ethereum). Please check the cashier section for a full list available in your region."
  },
  {
    question: "How long do withdrawals take?",
    answer: "Withdrawal times vary depending on the method used. E-wallet withdrawals are typically processed within 24 hours, while card payments and bank transfers may take 3-5 business days. Cryptocurrency withdrawals are usually processed within a few hours."
  },
  {
    question: "Is my personal information secure?",
    answer: "Yes, we use advanced SSL encryption and security protocols to protect your personal and financial information. Please see our Privacy Policy for more details."
  },
  {
    question: "What if I forget my password?",
    answer: "Click on the 'Forgot Password?' link on the login page. Enter your registered email address, and we will send you instructions on how to reset your password."
  },
  {
    question: "How can I set deposit limits?",
    answer: "You can set daily, weekly, or monthly deposit limits in your account settings under the 'Responsible Gaming' section. Alternatively, you can contact our support team for assistance."
  },
  {
    question: "Are the games fair?",
    answer: "Yes, all our games use a certified Random Number Generator (RNG) to ensure fair and random outcomes. Our platform is regularly audited by independent third parties."
  },
  {
    question: "How do I contact customer support?",
    answer: "You can contact our customer support team via the contact form on our Support page, by emailing support@mischiefcasino.example.com, or through our 24/7 live chat service (when available)."
  }
];

const FaqPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-game-bg to-game-panel/50 text-white">
      <NavigationBar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Frequently Asked <span className="text-game-gem">Questions</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions about our platform and services.
          </p>
        </div>
        
        <Card className="bg-game-panel/90 border-game-button/20 shadow-lg">
          <CardContent className="p-6 md:p-8">
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index} className="border-b-game-button/20">
                  <AccordionTrigger className="text-left hover:no-underline text-white hover:text-game-gem text-base md:text-lg">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 pt-2 pb-4 text-sm md:text-base">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default FaqPage;
