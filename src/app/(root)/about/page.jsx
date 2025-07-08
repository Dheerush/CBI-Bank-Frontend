"use client"; // This directive is necessary for client-side interactivity in Next.js

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // For animations
import { FaAward, FaChartLine, FaUsers, FaArrowLeft, FaArrowRight, FaQuoteLeft, FaBuilding, FaEnvelope } from 'react-icons/fa'; // Added FaEnvelope for developer contact
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Recharts imports for the graph

const About = () => {
  // Testimonial data
  const testimonials = [
    {
      id: 1,
      quote: "CBI Bank has been an incredible partner in my financial journey. Their seamless digital services and supportive staff make banking a breeze. Highly recommended!",
      author: "Priyashu Sharma",
      title: "Small Business Owner"
    },
    {
      id: 2,
      quote: "The personalized attention I receive from CBI Bank is unmatched. Their investment advice helped me grow my savings significantly. Truly a bank that cares.",
      author: "Sohan Jha",
      title: "Senior Software Engineer at Infosys"
    },
    {
      id: 3,
      quote: "Getting a home loan was so easy with CBI Bank. The process was transparent, and the interest rates were very competitive. Thank you for making my dream come true!",
      author: "Neha Patel",
      title: "First-Time Homebuyer"
    },
    {
      id: 4,
      quote: "Their 24/7 customer support is a lifesaver! I had an issue late at night, and it was resolved within minutes. Excellent service!",
      author: "Rajesh Kumar",
      title: "Freelancer"
    },
    {
      id: 5,
      quote: "Availailing education loan at a low interest rate from them was an easy process ",
      author: "Dheeraj Sharma",
      title: "Student"
    },
    {
      id: 6,
      quote: "CBI is my go to app for any banking related problems. I have been their customer since 2020 and never been disappointed with them. Kudos to the great work they have been doing ",
      author: "Tamanna Sharma",
      title: "Teacher"
    },
  ];

  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonialIndex((prevIndex) =>
      (prevIndex + 1) % testimonials.length
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIndex((prevIndex) =>
      (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  const currentTestimonial = testimonials[currentTestimonialIndex];

  // Framer Motion variants for section animations
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  // Framer Motion variants for testimonial slide animation
  const testimonialVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      transition: { duration: 0.5, ease: "easeIn" },
    }),
  };

  // Data for the Growth Rate & Profit Graph
  const growthData = [
    { year: '2021', growth: 12, profit: 500 },
    { year: '2022', growth: 15, profit: 620 },
    { year: '2023', growth: 18, profit: 750 },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-900 mb-4 leading-tight">
        About <span className="text-blue-600">CBI Bank</span>
      </h1>

      {/* Foundation Section */}
      <motion.section
        className="bg-white p-8 rounded-xl shadow-lg mb-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <h2 className="text-base font-bold text-gray-800 mb-6 flex items-center">
          <FaBuilding className="text-blue-500 mr-3" /> Our Foundation
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          Founded in 2020 with a vision to empower individuals and businesses across India, CBI Bank embarked on a journey to redefine banking. Our commitment to trust, innovation, and customer-centricity has been the bedrock of our operations since day one. We started with a handful of branches and a strong belief in financial inclusion, aiming to serve every segment of society with integrity and excellence.
        </p>
      </motion.section>

      {/* Journey Section */}
      <motion.section
        className="bg-gray-50 p-8 rounded-xl shadow-lg mb-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <h2 className="text-base font-bold text-gray-800 mb-6 flex items-center">
          <FaChartLine className="text-green-500 mr-3" /> Our Journey of Growth
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          Over the decades, CBI Bank has evolved from a nascent institution into a leading financial powerhouse. Our journey is marked by significant milestones:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 text-xs">
          <li>2021-2022: Rapid expansion of branch network, reaching underserved <span className='text-blue-600 font-semibold underline'>rural areas</span>.</li>
          <li>2022-2023: Pioneering digital banking initiatives, introducing mobile and internet banking platforms.</li>
          <li>2023-Present: Focus on sustainable finance, FinTech partnerships, and enhancing customer experience through <span className='text-blue-600 font-semibold underline'>AI-driven solutions</span>.</li>
          <li>Today, we serve millions of customers with a comprehensive suite of banking products and services.</li>
        </ul>
      </motion.section>

      {/* Awards & Recognition Section */}
      <motion.section
        className="bg-white p-8 rounded-xl shadow-lg mb-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <h2 className="text-base font-bold text-gray-800 mb-6 flex items-center">
          <FaAward className="text-yellow-500 mr-3" /> Awards & Recognition
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          CBI Bank's unwavering dedication to excellence has been recognized by various prestigious organizations. Some of our recent accolades include:
        </p>
        <ul className="list-disc list-inside text-xs text-gray-700 space-y-2">
          <li> <span className='text-blue-700 font-semibold'>Best Digital Bank of the Year (2023) </span> - (Global Banking Awards)</li>
          <li> <span className='text-blue-700 font-semibold'> Most Trusted Bank in India (2022)</span> - (National Consumer Survey)</li>
          <li> <span className='text-blue-700 font-semibold'> Excellence in Financial Inclusion (2021)</span> -  (RBI Governor's Award)</li>
          <li> <span className='text-blue-700 font-semibold'>Top Performer in Sustainable Banking (2020) </span> - (Asia Finance Review)</li>
        </ul>
      </motion.section>

      {/* Growth Rate & Profit Graph Section */}
      <motion.section
        className="bg-gray-50 p-8 rounded-xl shadow-lg mb-8 "
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <h2 className="text-base font-bold text-gray-800 mb-6 flex items-center ">
          <FaChartLine className="text-purple-600 mr-3" /> Our Financial Performance
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-8">
          CBI Bank has consistently demonstrated robust financial health and impressive growth. Below is a representation of our growth rate and profit over the past three years, reflecting our strong market position and efficient operations.
        </p>
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-400 min-h-[300px] flex items-center justify-center">
          {/* Recharts Line Chart for Growth Rate and Profit */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={growthData}
              margin={{
                top: 5, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" label={{ value: 'Growth Rate (%)', angle: -90, position: 'insideLeft', fill: '#8884d' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'Profit (₹ Cr)', angle: 90, position: 'insideRight', fill: '#82ca9d' }} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="growth" stroke="#8884d8" activeDot={{ r: 8 }} name="Growth Rate (%)" />
              <Line yAxisId="right" type="monotone" dataKey="profit" stroke="#82ca9d" name="Profit (₹ Cr)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      {/* Customer Testimonials Section */}
      <motion.section
        className="bg-blue-600 text-white p-8 rounded-xl shadow-lg mb-4 text-center relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <h2 className="text-2xl font-bold mb-8 flex items-center justify-center">
          <FaUsers className="text-white mr-3" /> Reviews
        </h2>

        <div className="relative w-full max-w-3xl mx-auto h-48 sm:h-56 flex items-center justify-center">
          <AnimatePresence initial={false} custom={currentTestimonialIndex}>
            <motion.div
              key={currentTestimonial.id}
              custom={currentTestimonialIndex} // Pass index as custom prop for direction
              variants={testimonialVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full bg-white text-gray-800 p-6 rounded-lg shadow-xl"
            >
              <FaQuoteLeft className="text-blue-400 text-3xl mb-4 mx-auto" />
              <p className="text-sm italic mb-4">"{currentTestimonial.quote}"</p>
              <p className="font-semibold text-blue-600">{currentTestimonial.author}</p>
              <p className="text-sm text-gray-500">{currentTestimonial.title}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
          <button
            onClick={prevTestimonial}
            className="bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-3 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Previous testimonial"
          >
            <FaArrowLeft className="text-xl" />
          </button>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          <button
            onClick={nextTestimonial}
            className="bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-3 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Next testimonial"
          >
            <FaArrowRight className="text-xl" />
          </button>
        </div>
      </motion.section>

      {/* Call to Action ) */}
      <motion.section
        className="bg-blue-50 p-8 rounded-xl shadow-lg text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <h2 className="text-xl font-bold text-blue-800 mb-4">Join the CBI Bank Family</h2>
        <p className="text-sm text-blue-700 mb-6">
          Experience banking that's built on trust, innovation, and a deep understanding of your financial needs.
        </p>
        <a
          href="/auth/register" // Link to your registration page
          className="inline-block bg-blue-600 text-white px-8 py-3 text-xs rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg"
        >
          Open an Account Today
        </a>
      </motion.section>

      {/* Developer Section */}
      <motion.section
        className="bg-gray-100 p-8 rounded-xl shadow-lg text-center mt-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <h2 className="text-sm font-bold text-gray-800 mb-1">Developed By</h2>
        <p className="text-xs text-gray-700 mb-2">This app was developed by <span className="font-semibold text-blue-700">Dheeraj Sharma</span>.</p>
        <p className="text-xs text-gray-700 mb-4">For any suggestions or feedback, please feel free to reach out:</p>
        <a
          href="mailto:sharmdheeraj1996@gmail.com"
          className="inline-flex items-center px-6 py-3 text-xs bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
        >
          <FaEnvelope className="mr-2" /> Contact Developer
        </a>
        <p className="text-xs text-gray-500 mt-2">Email: sharmdheeraj1996@gmail.com</p>
      </motion.section>

    </div>
  );
};

export default About;
