import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-extrabold"
        >
          Resumer AI
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg mt-4 max-w-2xl"
        >
          Revolutionizing industries with cutting-edge AI solutions. Transform hiring, streamline workflows, and unlock new possibilities.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 px-6 py-3 bg-white text-black font-semibold rounded-lg shadow-lg hover:bg-gray-200 transform transition-all duration-300 hover:scale-105"
          onClick={() => window.location.href = "/signup"}
        >
          Get Started
        </motion.button>
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          src="https://via.placeholder.com/1200x600"
          alt="Hero Image"
          className="mt-12 rounded-lg shadow-lg"
        />
      </section>

      {/* What We Do Section */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold"
          >
            What We Do
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg mt-4 max-w-3xl mx-auto text-gray-300"
          >
            Resumer AI leverages artificial intelligence to transform hiring processes, analyze resumes, and provide actionable insights for HR teams.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="p-6 bg-gray-800 rounded-lg shadow-lg"
            >
              <h3 className="text-xl font-bold text-white">Resume Analysis</h3>
              <p className="mt-2 text-gray-400">
                Analyze resumes with precision and uncover the best candidates for your team.
              </p>
              <img
                src="https://via.placeholder.com/400x300"
                alt="Resume Analysis"
                className="mt-4 rounded-lg shadow-lg"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="p-6 bg-gray-800 rounded-lg shadow-lg"
            >
              <h3 className="text-xl font-bold text-white">AI-Powered Insights</h3>
              <p className="mt-2 text-gray-400">
                Gain actionable insights to make smarter hiring decisions.
              </p>
              <img
                src="https://via.placeholder.com/400x300"
                alt="AI Insights"
                className="mt-4 rounded-lg shadow-lg"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="p-6 bg-gray-800 rounded-lg shadow-lg"
            >
              <h3 className="text-xl font-bold text-white">Streamlined Processes</h3>
              <p className="mt-2 text-gray-400">
                Automate and streamline your hiring workflows with ease.
              </p>
              <img
                src="https://via.placeholder.com/400x300"
                alt="Streamlined Processes"
                className="mt-4 rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold"
          >
            Testimonials
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="p-6 bg-gray-800 rounded-lg shadow-lg"
            >
              <p className="text-lg text-gray-300">
                "Resumer AI has completely transformed our hiring process. It's fast, efficient, and incredibly accurate."
              </p>
              <p className="mt-4 text-sm text-gray-500">- John Doe, HR Manager</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="p-6 bg-gray-800 rounded-lg shadow-lg"
            >
              <p className="text-lg text-gray-300">
                "The AI-powered insights have helped us make smarter decisions and save countless hours."
              </p>
              <p className="mt-4 text-sm text-gray-500">- Jane Smith, CEO</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-white"
          >
            Contact Us
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg mt-4 max-w-3xl mx-auto text-gray-300"
          >
            Have questions? Reach out to us and let’s discuss how Resumer AI can help your business.
          </motion.p>
          <form className="mt-12 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Your Name"
                className="p-4 rounded-lg border border-gray-700 bg-gray-800 text-white"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="p-4 rounded-lg border border-gray-700 bg-gray-800 text-white"
              />
            </div>
            <textarea
              placeholder="Your Message"
              className="p-4 rounded-lg border border-gray-700 bg-gray-800 text-white mt-6 w-full"
              rows="5"
            ></textarea>
            <button
              type="submit"
              className="mt-6 px-6 py-3 bg-white text-black font-semibold rounded-lg shadow-lg hover:bg-gray-200 transform transition-all duration-300 hover:scale-105"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}