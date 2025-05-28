import React from 'react';
import { motion } from 'framer-motion';
import { FaPaintBrush, FaCode, FaBullhorn, FaKeyboard, FaVideo, FaTasks } from 'react-icons/fa';

const servicesData = [
  { name: "Graphic & UI/UX Design", icon: <FaPaintBrush />, description: "Logos, branding, web/app interfaces, illustrations." },
  { name: "Development (Web & Mobile)", icon: <FaCode />, description: "Frontend, backend, full-stack, e-commerce, app dev." },
  { name: "Digital Marketing & SEO", icon: <FaBullhorn />, description: "Strategy, SEO, SMM, content marketing, PPC." },
  { name: "Content Creation & Writing", icon: <FaKeyboard />, description: "Articles, copywriting, technical writing, scripts." },
  { name: "Video Editing & Animation", icon: <FaVideo />, description: "Promotional videos, explainers, motion graphics." },
  { name: "Virtual Assistance & Support", icon: <FaTasks />, description: "Admin, scheduling, customer service, research." },
];

const ServicesShowcase = () => {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 100, duration: 0.5 } }
  };

  return (
    <section id="services" className="py-16 sm:py-24 bg-gradient-to-b from-[#F7FAFC] via-white to-[#F7FAFC]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity:0, y: -30 }}
          whileInView={{ opacity:1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#154B6C] mb-4">
            A Spectrum of <span className="text-[#DF9F27]">Expert Services</span>
          </h2>
          <p className="text-lg text-[#4A5568] max-w-xl mx-auto">
            Our curated network of Nigerian professionals offers diverse skills to meet your business needs.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {servicesData.map((service) => (
            <motion.div
              key={service.name}
              variants={itemVariants}
              className="bg-white p-6 md:p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 group flex flex-col text-center items-center"
            >
              <div className="flex items-center justify-center mb-5 w-16 h-16 bg-[#DF9F27]/10 text-[#DF9F27] rounded-full group-hover:bg-[#DF9F27] group-hover:text-white transition-colors duration-300 text-3xl">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-[#154B6C] mb-2">{service.name}</h3>
              <p className="text-[#4A5568] text-sm leading-relaxed flex-grow">{service.description}</p>
              <a href="#" className="inline-block mt-5 text-[#154B6C] font-semibold hover:text-[#DF9F27] transition-colors duration-300 group-hover:text-[#DF9F27] text-sm">
                Learn More <span aria-hidden="true">&rarr;</span>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesShowcase;