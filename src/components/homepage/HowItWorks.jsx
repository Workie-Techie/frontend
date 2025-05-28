import React from 'react';
import { motion } from 'framer-motion';
import { FiClipboard, FiUserCheck, FiMessageSquare, FiCheckSquare, FiGift } from 'react-icons/fi';

const HowItWorks = () => {
  const steps = [
    { id: 1, icon: <FiClipboard />, title: "1. Submit Your Project", description: "Clearly outline your project needs, goals, and timeline through our simple request form." },
    { id: 2, icon: <FiUserCheck />, title: "2. We Match & Assign", description: "WorkieTechie carefully reviews your request and assigns the project to the best-suited, pre-vetted Nigerian professional(s) from our network." },
    { id: 3, icon: <FiMessageSquare />, title: "3. Managed Collaboration", description: "We facilitate project kick-off. You'll communicate with your dedicated WorkieTechie project manager who oversees the talent and ensures smooth progress." },
    { id: 4, icon: <FiCheckSquare />, title: "4. Review & Approve", description: "Receive high-quality deliverables. Provide feedback through our platform, and we ensure revisions are handled promptly until you're satisfied." },
    { id: 5, icon: <FiGift />, title: "5. Secure Handoff & Payment", description: "Once you approve the final work, the project is complete. Secure payment is processed, and the talent is compensated." },
  ];

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity:0, y: -30 }}
          whileInView={{ opacity:1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#154B6C] mb-4">
            Getting Started is <span className="text-[#DF9F27]">Easy</span>
          </h2>
          <p className="text-lg text-[#4A5568] max-w-2xl mx-auto">
            Our streamlined, platform-managed process ensures a hassle-free experience for clients.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              variants={itemVariants}
              className={`flex flex-col md:flex-row items-start mb-10 md:mb-12 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-[#DF9F27] text-white rounded-full flex items-center justify-center text-3xl md:text-4xl shadow-lg mb-4 md:mb-0 ${index % 2 !== 0 ? 'md:ml-8' : 'md:mr-8'}`}>
                {step.icon}
              </div>
              <div className={`text-center md:text-left ${index % 2 !== 0 ? 'md:text-right' : ''}`}>
                <h3 className="text-xl sm:text-2xl font-semibold text-[#154B6C] mb-2">{step.title}</h3>
                <p className="text-[#4A5568] leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;