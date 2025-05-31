import React, { useState, useEffect } from 'react';
import logo from '../assets/logo2.png';
import logow from '../assets/logow.png';
import Button from '../common/Button';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { title: "How it Works", href: "#how-it-works" },
    { title: "Services", href: "#services" },
    { title: "Why Us?", href: "#why-us" },
    { title: "For Talent", href: "#for-talent" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed w-full z-50 top-0 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="/" className="flex-shrink-0">
            {isScrolled ?
              <img className="h-12 sm:h-12 w-auto" src={logo} alt="WorkieTechie" /> 
              : 
              <img className="h-12 sm:h-12 w-auto" src={logow} alt="WorkieTechie" />
            }
            
          </a>
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {navLinks.map(link => (
              <a
                key={link.title}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isScrolled || isOpen ? 'text-[#1A202C] hover:text-[#154B6C]' : 'text-white hover:text-[#E4C06A]'}`}
              >
                {link.title}
              </a>
            ))}
            <Button primary className="ml-2 text-xs sm:text-sm px-4 py-2 sm:px-6 sm:py-2.5">Hire Talent</Button>
            <Button secondary outline={!isScrolled} className={`ml-2 text-xs sm:text-sm px-4 py-2 sm:px-6 sm:py-2.5 ${isScrolled ? 'border-[#154B6C] text-[#154B6C] hover:bg-[#154B6C] hover:text-white' : 'border-white text-white hover:bg-white hover:text-[#154B6C]'}`}>Join WorkieTechie</Button>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className={`p-2 rounded-md focus:outline-none ${isScrolled ? 'text-[#154B6C] hover:text-[#DF9F27]' : 'text-white hover:text-[#E4C06A]'}`}
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <HiX className="h-6 w-6" /> : <HiMenuAlt3 className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white shadow-xl"
          id="mobile-menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link => (
              <a
                key={link.title}
                href={link.href}
                className="text-[#4A5568] hover:bg-[#F7FAFC] hover:text-[#154B6C] block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.title}
              </a>
            ))}
            <div className="pt-4 pb-2 px-2 space-y-3">
              <Button primary className="w-full">Hire Talent</Button>
              <Button secondary className="w-full">Join WorkieTechie</Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;