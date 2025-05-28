import React from 'react';
import Button from '../../common/Button';
import { motion } from 'framer-motion';
import { FiArrowRight, FiUsers, FiDollarSign, FiShield } from 'react-icons/fi';
// Consider a relevant background image or video here for a more modern feel
// import heroBg from '../assets/images/hero-background.jpg'; // Example

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
  };

  const itemVariants = (delay = 0) => ({
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut', delay } },
  });

  // Style for background image (if you use one)
  // const heroStyle = {
  //   backgroundImage: `linear-gradient(rgba(0, 51, 102, 0.85), rgba(0, 31, 62, 0.95)), url(${heroBg})`,
  //   backgroundSize: 'cover',
  //   backgroundPosition: 'center',
  // };

  return (
    // <section className="relative text-white pt-40 pb-24 md:pt-48 md:pb-32 min-h-screen flex items-center justify-center" style={heroStyle}>
    // Default gradient if no image:
    <section className="relative bg-gradient-to-br from-[#154B6C] via-[#1275B2] to-[#16629E] text-white pt-40 pb-24 md:pt-48 md:pb-32 min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-20"></div> {/* Subtle overlay */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.h1
            variants={itemVariants()}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
          >
            Unlock Top Nigerian Talent. <br className="hidden sm:block" />
            <span className="text-gradient-gold-blue">Achieve More, Spend Less.</span>
          </motion.h1>
          <motion.p
            variants={itemVariants(0.2)}
            className="text-lg sm:text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto mb-10"
          >
            WorkieTechie connects U.S. clients with elite, vetted Nigerian professionals. We manage the process, you get premium quality service, hassle-free.
          </motion.p>
          <motion.div
            variants={itemVariants(0.4)}
            className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16"
          >
            <Button primary className="text-base md:text-lg px-8 py-3.5 md:px-10 md:py-4" icon={FiArrowRight}>
              Find Your Expert
            </Button>
            <Button secondary outline className="text-base md:text-lg px-8 py-3.5 md:px-10 md:py-4 border-white text-white hover:bg-white hover:text-[#154B6C]">
              Join as a Professional
            </Button>
          </motion.div>

          <motion.div
            variants={itemVariants(0.6)}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto"
          >
            {[
              { icon: <FiDollarSign className="w-7 h-7 text-[#DF9F27] mb-2"/>, title: "Cost-Effective", desc: "Premium services at competitive global rates." },
              { icon: <FiShield className="w-7 h-7 text-[#DF9F27] mb-2"/>, title: "Quality Assured", desc: "Vetted talent & platform-managed projects." },
              { icon: <FiUsers className="w-7 h-7 text-[#DF9F27] mb-2"/>, title: "Simplified Hiring", desc: "We handle matchmaking & coordination." },
            ].map((item) => (
              <div key={item.title} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg text-center transform transition-all duration-300 hover:bg-white/20 hover:scale-105">
                {item.icon}
                <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-indigo-200 text-xs sm:text-sm">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;