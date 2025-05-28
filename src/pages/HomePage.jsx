import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Hero from '../components/homepage/Hero.jsx';
import ProblemSolution from '../components/homepage/ProblemSolution.jsx';
import HowItWorks from '../components/homepage/HowItWorks.jsx';
import ServicesShowcase from '../components/homepage/ServicesShowcase.jsx';
import WhyWorkieTechie from '../components/homepage/WhyWorkieTechie.jsx';
// import Testimonials from '../components/homepage/Testimonials.jsx'; // Placeholder for now
import CallToAction from '../components/homepage/CallToAction.jsx';
import Footer from '../components/homepage/Footer.jsx';

function HomePage() {
  return (
    <div className="App_ overflow-x-hidden"> {/* Basic class to prevent horizontal scroll issues from animations sometimes */}
      <Navbar />
      <main>
        <Hero />
        <ProblemSolution />
        <HowItWorks />
        <ServicesShowcase />
        <WhyWorkieTechie />
        {/* <Testimonials /> */}
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;