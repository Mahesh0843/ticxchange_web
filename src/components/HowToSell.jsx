import React from "react";
import { User, ShieldCheck, ClipboardList, DollarSign, Handshake, MessageCircle, CheckCircle, Star } from "lucide-react";

const HowToSell = () => {
  const steps = [
    {
      title: "Create an Account",
      description:
        "Sign up for a TicXchange account with your details and log in to access your seller dashboard.",
      icon: <User className="w-6 h-6" />, 
    },
    {
      title: "Verify Your Phone Number",
      description:
        "Verify your phone number via OTP to ensure security and trust on the platform.",
      icon: <ShieldCheck className="w-6 h-6" />,
    },
    {
      title: "List Your Ticket",
      description:
        "Click 'Sell Ticket' and enter event details like name, date, venue, ticket type, and price.",
      icon: <ClipboardList className="w-6 h-6" />,
    },
    {
      title: "Set a Fair Price",
      description:
        "Keep pricing competitive. Overpricing (more than 2x original price) may lead to complaints.",
      icon: <DollarSign className="w-6 h-6" />,
    },
    {
      title: "Receive Connection Requests",
      description:
        "Buyers will send connection requests. Accept requests to enable chat.",
      icon: <Handshake className="w-6 h-6" />,
    },
    {
      title: "Chat with Buyers",
      description:
        "Discuss ticket details, confirm availability, and negotiate pricing in a secure chat.",
      icon: <MessageCircle className="w-6 h-6" />,
    },
    {
      title: "Finalize the Exchange",
      description:
        "Arrange digital or physical transfer upon agreement with the buyer.",
      icon: <CheckCircle className="w-6 h-6" />,
    },
    {
      title: "Maintain a Good Reputation",
      description:
        "Ensure honest transactions to maintain positive seller ratings.",
      icon: <Star className="w-6 h-6" />,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-gray-900 rounded-lg shadow-lg">
        <div className="text-center p-8 border-b border-gray-700">
          <h2 className="text-3xl font-semibold text-white">Seller's Guide to TicXchange</h2>
          <p className="text-gray-400 mt-2">Your comprehensive guide to successful ticket selling</p>
        </div>
        <div className="p-6">
          <div className="grid gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="group relative flex gap-6 rounded-lg border border-gray-700 bg-gray-800 p-6 transition-all hover:bg-gray-700 hover:shadow-md hover:border-gray-600"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-700 text-white group-hover:bg-white group-hover:text-gray-900 transition-colors">
                  {step.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <span className="text-gray-400 font-semibold">0{index + 1}</span>
                    {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </div>
                <div className="absolute left-0 top-0 h-full w-1 bg-white opacity-0 transition-opacity group-hover:opacity-100 rounded-l-lg" />
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gray-800 rounded-lg">
            <p className="text-center text-gray-400 text-sm">
              For additional information or support, contact our business support team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToSell;
