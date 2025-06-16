import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import { useRef, useState, useEffect } from "react";

// Array of high-quality background images
const backgroundImages = [
  "https://pngtree.com/free-backgrounds-photos/high-tech"
];

export default function LandingPage() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityBg = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Auto-rotate background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden" ref={ref}>
      {/* Interactive Hero Section with Image Transition */}
      <section className="h-screen relative overflow-hidden flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentBgIndex}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImages[currentBgIndex]})`,
              y: yBg,
              opacity: opacityBg
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          />
        </AnimatePresence>
        
        {/* Animated gradient overlay */}
        <motion.div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(168,85,247,0.2) 50%, rgba(236,72,153,0.2) 100%)"
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
        />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white bg-opacity-10"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, (Math.random() - 0.5) * 100],
              x: [0, (Math.random() - 0.5) * 100],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}
        
        <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
        
        <motion.div 
          className="z-10 relative text-center px-6 w-full max-w-6xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 10
            }}
          >
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-8xl font-extrabold drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
            >
              Resumer AI
            </motion.h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl mt-6 max-w-2xl mx-auto text-gray-200"
          >
            Revolutionizing hiring with cutting-edge AI. Build smarter, faster, and better workflows.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
          >
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-full shadow-xl transform transition-all duration-300"
              onClick={() => (window.location.href = "/signup")}
            >
              Get Started
              <span className="ml-2">→</span>
            </motion.button>
            
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 20px rgba(236, 72, 153, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gray-900 bg-opacity-60 border border-gray-700 text-white font-semibold rounded-full shadow-xl transform transition-all duration-300"
              onClick={() => {
                const features = document.getElementById("features");
                features?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Learn More
              <span className="ml-2">↓</span>
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16"
          >
            <Player
              autoplay
              loop
              src="https://lottie.host/7ef4f72f-2f53-4b65-a8e9-c12952ed6f5b/LD78mEkaZL.json"
              style={{ height: "300px", width: "300px" }}
            />
          </motion.div>
          
          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
            animate={{ 
              y: [0, 10, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            onClick={() => {
              const features = document.getElementById("features");
              features?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Animated Features Section */}
      <section id="features" className="py-28 px-6 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center"
          >
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400"
            >
              What We Do
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl mt-4 max-w-3xl mx-auto text-gray-300"
            >
              AI-based resume analysis and insights tailored to modern hiring workflows.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">
            {[
              {
                title: "Resume Analysis",
                desc: "AI analyzes structure, keywords, and patterns to rank resumes.",
                icon: "📊",
                color: "from-purple-500 to-indigo-600",
                animation: "https://lottie.host/5b2ae7d9-8a7e-4f7a-a9f9-0a0b5b5b5b5b/7JX6w5W5Zw.json"
              },
              {
                title: "AI Insights",
                desc: "Real-time insights help your team hire 3x faster and smarter.",
                icon: "🧠", 
                color: "from-blue-500 to-teal-600",
                animation: "https://lottie.host/5b2ae7d9-8a7e-4f7a-a9f9-0a0b5b5b5b5b/7JX6w5W5Zw.json"
              },
              {
                title: "Streamlined Process",
                desc: "Integrate and automate with seamless hiring workflows.",
                icon: "⚡",
                color: "from-pink-500 to-red-600",
                animation: "https://lottie.host/5b2ae7d9-8a7e-4f7a-a9f9-0a0b5b5b5b5b/7JX6w5W5Zw.json"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className={`bg-gradient-to-br ${item.color} p-0.5 rounded-2xl shadow-xl`}
              >
                <div className="bg-gray-900 rounded-2xl p-8 h-full flex flex-col">
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-32 h-32 mb-6">
                      <Player
                        autoplay
                        loop
                        src={item.animation}
                        style={{ height: "100%", width: "100%" }}
                      />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-center">{item.title}</h3>
                    <p className="text-gray-300 text-center">{item.desc}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 px-6 py-2 bg-white bg-opacity-10 backdrop-blur-sm text-white rounded-lg border border-white border-opacity-20"
                  >
                    Learn More
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Testimonials */}
      <section className="py-28 px-6 bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-20"
          >
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Industry Leaders</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {[
              {
                quote: "Resumer AI streamlined our process and gave us incredible insights.",
                name: "John Doe",
                role: "HR Manager",
                company: "TechCorp",
                rating: 5
              },
              {
                quote: "We saved weeks of manual screening using Resumer's smart tools.", 
                name: "Jane Smith",
                role: "Startup Founder",
                company: "NextGen",
                rating: 5
              }
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-900 bg-opacity-70 backdrop-blur-lg p-8 rounded-2xl border border-gray-800 shadow-lg"
              >
                <div className="flex items-start">
                  <div className="text-4xl mr-4 text-gray-500">"</div>
                  <div>
                    <p className="text-xl italic text-gray-200 mb-6">"{t.quote}"</p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold mr-4">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold">{t.name}</h4>
                        <p className="text-sm text-gray-400">{t.role} • {t.company}</p>
                        <div className="flex mt-1">
                          {[...Array(t.rating)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Stats */}
      <section className="py-28 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {[
              { number: "10K+", label: "Resumes Analyzed" },
              { number: "95%", label: "Accuracy Rate" },
              { number: "3x", label: "Faster Hiring" },
              { number: "500+", label: "Happy Clients" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-900 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 text-center"
              >
                <motion.p 
                  className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400"
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  {stat.number}
                </motion.p>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section with Floating Elements */}
      <section className="py-28 px-6 bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute w-64 h-64 rounded-full bg-purple-500 blur-3xl -top-32 -left-32"></div>
          <div className="absolute w-64 h-64 rounded-full bg-blue-500 blur-3xl bottom-0 right-0"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Transform</span> Your Hiring?
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Questions or feedback? Let's build something great together.
            </motion.p>
          </motion.div>
          
          <motion.form
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gray-900 bg-opacity-50 backdrop-blur-lg p-8 md:p-10 rounded-2xl border border-gray-800 shadow-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div whileHover={{ scale: 1.02 }}>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-4 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }}>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-4 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </motion.div>
            </div>
            
            <motion.div whileHover={{ scale: 1.01 }} className="mt-6">
              <textarea
                placeholder="Your Message"
                className="w-full p-4 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[150px]"
              ></textarea>
            </motion.div>
            
            <motion.div 
              className="mt-8 text-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300"
              >
                Send Message
                <span className="ml-2">✉️</span>
              </button>
            </motion.div>
          </motion.form>
        </div>
      </section>
    </div>
  );
}