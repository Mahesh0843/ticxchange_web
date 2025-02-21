


import React, { useEffect, useState } from 'react';
import { Shield, MessageSquare, Scale, Linkedin, Github } from 'lucide-react';

const teamMembers = [
  {
    name: "Mahesh Chandra",
    role: "Full Stack Developer",
    github: "Mahesh0843",
    linkedin: "https://www.linkedin.com/in/mahesh-chandra-singuluri-27349a25a/",
  },
  {
    name: "Ameer Khan",
    role: "Backend Specialist",
    github: "sayyadameer",
    linkedin: "https://www.linkedin.com/in/ameer-sayyad-98554a251",
  },
  {
    name: "Sai Phanindra",
    role: "UI/UX Designer",
    github: "",
    linkedin: "https://www.linkedin.com/in/sai-phanindra-27ab65220/",
  },
  {
    name: "Vinay Thota",
    role: "DevOps Engineer",
    github: "vinaythota03",
    linkedin: "https://www.linkedin.com/in/vinay-thota-2b4537251/",
  },
];

const AboutUs = () => {
  const [profiles, setProfiles] = useState({});

  useEffect(() => {
    const fetchGitHubAvatars = async () => {
      const profileData = {};
      for (const member of teamMembers) {
        try {
          const response = await fetch(`https://api.github.com/users/${member.github}`);
          const data = await response.json();
          profileData[member.github] = data.avatar_url;
        } catch (error) {
          console.error(`Error fetching GitHub avatar for ${member.name}:`, error);
          profileData[member.github] = "https://via.placeholder.com/150";
        }
      }
      setProfiles(profileData);
    };
    fetchGitHubAvatars();
  }, []);

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Safe & Secure",
      description: "Advanced security measures and real-time monitoring ensure every transaction is protected against fraud.",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Direct Communication",
      description: "Integrated messaging system allows seamless communication between buyers and sellers.",
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Fair Pricing",
      description: "Market-driven pricing algorithm prevents ticket scalping and ensures fair value.",
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 text-white py-16 px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Revolutionizing Ticket Resale</h1>
            <p className="text-slate-200 text-xl leading-relaxed">
              TicXchange bridges the gap between last-minute plan changes and unforgettable experiences through secure, transparent ticket exchanges.
            </p>
          </div>
        </div>

        {/* Core Features */}
        <div className="px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="group p-8 rounded-xl border border-slate-100 bg-white transition-all hover:border-slate-200 hover:shadow-lg">
                <div className="flex flex-col items-start">
                  <div className="p-3 rounded-xl bg-blue-100 text-blue-600 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Team Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Leadership Team</h2>
            <p className="text-slate-600 max-w-2xl mx-auto mb-12">
              A diverse group of passionate professionals committed to transforming the ticket resale industry.
            </p>
            <div className="grid md:grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <div key={member.name} className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <img
                    src={profiles[member.github]}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
                  />
                  <h3 className="text-xl font-semibold text-slate-800 mb-1">{member.name}</h3>
                  {/* <p className="text-slate-500 text-sm mb-4">{member.role}</p> */}
                  <div className="flex justify-center space-x-4">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      <Linkedin className="w-6 h-6" />
                    </a>
                    <a
                      href={`https://github.com/${member.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <Github className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-slate-50 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">Join Our Community</h3>
            <p className="text-slate-600 mb-6 max-w-xl mx-auto">
              Become part of a growing network that values fair access to events and sustainable ticket practices.
            </p>
            <div className="bg-white inline-block px-8 py-4 rounded-lg shadow-sm">
              <p className="text-slate-600">
                Contact us at {' '}
                <a
                  href="mailto:ticxchange.helpdesk@gmail.com"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  ticxchange.helpdesk@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;