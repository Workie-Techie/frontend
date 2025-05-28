import React from 'react';
import logo from '../../assets/logo.png';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <FaFacebookF />, href: "#", label: "Facebook" },
    { icon: <FaTwitter />, href: "#", label: "Twitter" },
    { icon: <FaLinkedinIn />, href: "#", label: "LinkedIn" },
    { icon: <FaInstagram />, href: "#", label: "Instagram" },
  ];

  const footerLinkSections = [
    { title: "Platform", links: [ { name: "How it Works (Clients)", href: "#how-it-works" }, { name: "How it Works (Talent)", href: "#for-talent" }, { name: "Services", href: "#services" }, { name: "Pricing", href: "#pricing" } ] },
    { title: "Company", links: [ { name: "About Us", href: "#about" }, { name: "Why WorkieTechie?", href: "#why-us" }, { name: "Careers", href: "#careers" }, { name: "Contact Us", href: "#contact" } ] },
    { title: "Legal", links: [ { name: "Terms of Service", href: "#terms" }, { name: "Privacy Policy", href: "#privacy" }, { name: "Cookie Policy", href: "#cookies" } ] },
  ];

  return (
    <footer className="bg-[#1A202C] text-gray-300 pt-16 sm:pt-20 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1 mb-6 md:mb-0">
            <a href="/" className="inline-block mb-5">
              <img src={logo} alt="WorkieTechie" className="h-10 w-auto filter brightness-0 invert" />
            </a>
            <p className="text-sm text-gray-400 mb-6 max-w-xs">
              Bridging U.S. businesses with elite Nigerian talent. Quality, affordability, managed for you.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#DF9F27] transition-colors duration-300 p-2.5 bg-gray-700 hover:bg-gray-600 rounded-full text-lg"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {footerLinkSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-base font-semibold text-white uppercase tracking-wider mb-5">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map(link => (
                  <li key={link.name}>
                    <a href={link.href} className="text-sm text-gray-400 hover:text-[#DF9F27] transition-colors duration-300">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 pt-8 text-center md:flex md:justify-between">
          <p className="text-xs sm:text-sm text-gray-500">
            &copy; {currentYear} WorkieTechie. All rights reserved. A platform connecting global opportunities.
          </p>
          <div className="flex justify-center space-x-4 mt-4 md:mt-0">
             {/* You can add other small links here if needed */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;