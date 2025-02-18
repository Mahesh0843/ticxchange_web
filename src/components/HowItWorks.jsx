import React from 'react';
import { ClipboardList, Search, Handshake, MessageCircle, Ticket, Shield } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <ClipboardList className="w-6 h-6" />,
      title: "List Your Ticket",
      description: "Easily list your event ticket with essential details and pricing to maximize exposure to potential buyers.",
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Explore Opportunities",
      description: "Use advanced search and filters to find tickets that align with your needs and budget.",
    },
    {
      icon: <Handshake className="w-6 h-6" />,
      title: "Establish Connections",
      description: "Initiate secure interactions with sellers through our trusted verification system.",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Communicate Seamlessly",
      description: "Engage in professional discussions to finalize ticket details and ensure authenticity.",
    },
    {
      icon: <Ticket className="w-6 h-6" />,
      title: "Finalize Transactions",
      description: "Complete secure transactions with confidence, supported by our platform's reliability.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Ensuring Trust",
      description: "Report concerns for prompt resolution, ensuring fair and transparent exchanges.",
    },
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="bg-gray-900 text-white rounded-lg shadow-xl">
        <div className="text-center p-10 border-b border-gray-700">
          <h2 className="text-3xl font-bold">How TicXchange Works</h2>
          <p className="text-gray-400 mt-2">A professional and secure ticket exchange platform</p>
        </div>
        <div className="p-8">
          <div className="grid gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="group relative flex gap-6 rounded-lg border border-gray-700 bg-gray-800 p-6 transition-all hover:bg-gray-700 hover:border-gray-600"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-700 text-white">
                  {step.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-gray-400 font-bold">0{index + 1}</span>
                    {step.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 opacity-0 transition-opacity group-hover:opacity-100 rounded-l-lg" />
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gray-800 rounded-lg text-center">
            <p className="text-gray-400 text-sm">
              For business inquiries or support, contact us at <span className="text-blue-400">business@ticxchange.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;