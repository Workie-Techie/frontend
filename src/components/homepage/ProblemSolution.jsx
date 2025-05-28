import React from 'react';
import { motion } from 'framer-motion';
import { FaSearchDollar, FaLaptopCode } from 'react-icons/fa'; // Using a different icon for FaBridge if not available
import { GiBridge } from 'react-icons/gi'; // Alternative bridge icon

const ProblemSolution = () => {
  const cardVariants = {
    offscreen: { y: 60, opacity: 0 },
    onscreen: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 50, duration: 0.9 } }
  };

  const sectionAnimation = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="problem-solution" className="py-16 sm:py-24 bg-[#F7FAFC]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionAnimation}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#154B6C] text-center mb-5">
            Connecting Talent <span className="text-[#DF9F27]">with</span> Opportunity
          </h2>
          <p className="text-lg text-workie-gray max-w-3xl mx-auto text-center mb-12 sm:mb-20">
            Connecting global talent with opportunity shouldn't be complex. We make it simple, reliable, and effective for both sides.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch mb-12 sm:mb-16">
          <motion.div variants={cardVariants} initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.2 }}
            className="bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300 flex flex-col">
            <div className="flex items-start text-[#DF9F27] mb-4">
              <FaLaptopCode className="text-4xl mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold text-[#154B6C] mb-1">For Nigerian Professionals</h3>
                <p className="text-sm text-[#DF9F27] font-medium">The Hurdle</p>
              </div>
            </div>
            <p className="text-workie-gray mb-3 grow">
              Highly skilled Nigerian professionals often struggle to access consistent, high-value global remote job opportunities. Existing platforms can be saturated or lack focus on their unique strengths.
            </p>
          </motion.div>

          <motion.div variants={cardVariants} initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.2 }}
            className="bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300 flex flex-col">
            <div className="flex items-start text-[#DF9F27] mb-4">
              <FaSearchDollar className="text-4xl mr-4 flex-shrink-0" />
               <div>
                <h3 className="text-2xl font-semibold text-[#154B6C] mb-1">For U.S. Clients</h3>
                <p className="text-sm text-[#DF9F27] font-medium">The Hurdle</p>
              </div>
            </div>
            <p className="text-workie-gray mb-3 grow">
              U.S. businesses and individuals seek affordable, quality services but face high domestic costs. Sourcing reliable international talent independently can be risky and time-consuming.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity:0, y: 30 }}
          whileInView={{ opacity:1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center bg-gradient-to-r from-[#154B6C] to-indigo-600 text-white p-8 sm:p-12 rounded-xl shadow-2xl"
        >
            <GiBridge className="text-6xl text-[#DF9F27] mx-auto mb-5 animate-subtle-bounce" /> {/* Using GiBridge */}
            <h3 className="text-3xl sm:text-4xl font-bold mb-4">WorkieTechie: Your Bridge to Success</h3>
            <p className="text-lg sm:text-xl max-w-3xl mx-auto text-indigo-100">
              We provide a dedicated, managed platform that vets Nigerian talent and connects them with U.S. clients. WorkieTechie oversees projects, ensuring quality, fair pricing, and seamless communication, benefiting everyone involved.
            </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSolution;