import React from 'react';
import Button from '../../common/Button.jsx';
import { motion } from 'framer-motion';
import { FiArrowRight, FiUserPlus } from 'react-icons/fi';

const CallToAction = () => {
  return (
    <section id="for-talent" className="py-16 sm:py-24 bg-[#F7FAFC]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="bg-gradient-to-br from-[#DF9F27] via-yellow-500 to-orange-500 text-white p-8 sm:p-12 lg:p-16 rounded-2xl shadow-2xl text-center"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6">
            Ready to Transform Your Business or Career?
          </h2>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto mb-10 text-yellow-50">
            Whether you're a U.S. client seeking premium, cost-effective services, or a talented Nigerian professional aiming for global impact – WorkieTechie is your dedicated launchpad.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-5 sm:space-y-0 sm:space-x-6">
            <Button className="bg-white text-[#154B6C] hover:bg-gray-100 text-base md:text-lg px-8 py-3.5 md:px-10 md:py-4 shadow-lg transform hover:scale-105 font-bold" icon={FiArrowRight}>
              Find Top Talent Now
            </Button>
            <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-yellow-600 text-base md:text-lg px-8 py-3.5 md:px-10 md:py-4 shadow-lg transform hover:scale-105 font-bold" icon={FiUserPlus}>
              Join as a Professional
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;