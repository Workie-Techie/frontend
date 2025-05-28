import React from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiShield, FiUsers, FiZap, FiAward } from 'react-icons/fi';
import Button from '../../common/Button';

const uspData = [
  { icon: <FiDollarSign />, title: "Unbeatable Value", text: "Access elite Nigerian talent at competitive rates, optimizing your budget without sacrificing quality.", color: "text-green-500", bgColor: "bg-green-100" },
  { icon: <FiShield />, title: "Platform-Managed Quality", text: "We vet all professionals and oversee projects, ensuring high standards and your complete satisfaction.", color: "text-blue-500", bgColor: "bg-blue-100" },
  { icon: <FiUsers />, title: "Curated Nigerian Talent", text: "Tap into a rich pool of skilled, creative, and dedicated professionals specifically from Nigeria.", color: "text-yellow-500", bgColor: "bg-yellow-100" },
  { icon: <FiZap />, title: "Fast & Efficient Process", text: "Streamlined project management and communication lead to quicker turnarounds and effective results.", color: "text-purple-500", bgColor: "bg-purple-100" },
  { icon: <FiAward />, title: "Simplified & Trusted", text: "One platform to find, hire, and manage. We handle the complexities so you can focus on your goals.", color: "text-red-500", bgColor: "bg-red-100" },
];

const WhyWorkieTechie = () => {
  const cardVariants = {
    offscreen: { opacity: 0, y: 50 },
    onscreen: (i) => ({
      opacity: 1, y: 0,
      transition: { type: "spring", stiffness: 40, damping: 10, delay: i * 0.1 }
    })
  };

  return (
    <section id="why-us" className="py-16 sm:py-24 bg-[#154B6C] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity:0, y: -30 }}
          whileInView={{ opacity:1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
            The <span className="font-script text-[#DF9F27] text-4xl sm:text-5xl lg:text-6xl align-bottom">WorkieTechie</span> Advantage
          </h2>
          <p className="text-lg text-indigo-200 max-w-2xl mx-auto">
            More than a marketplace – we're your strategic partner for sourcing and managing exceptional Nigerian talent.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {uspData.map((item, index) => (
            <motion.div
              key={item.title}
              custom={index}
              variants={cardVariants}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.1 }}
              className="flex items-start space-x-4 p-6 bg-white/5 backdrop-blur-md rounded-xl shadow-lg hover:bg-white/10 transition-colors duration-300"
            >
              <div className={`flex-shrink-0 w-12 h-12 rounded-full ${item.bgColor} ${item.color} flex items-center justify-center shadow-md text-2xl`}>
                {item.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1.5">{item.title}</h3>
                <p className="text-indigo-200 leading-relaxed text-sm">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-16"
        >
          <Button primary className="text-base md:text-lg px-10 py-3.5 shadow-xl transform hover:scale-105">
            Discover the Difference
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyWorkieTechie;