import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Redirect } from "wouter";
import { insertUserSchema } from "@shared/schema";
import { useLocation } from "wouter";
import { useToast } from '@/hooks/use-toast';
import Cookies from 'js-cookie';
import { FcGoogle } from "react-icons/fc";
import { motion, AnimatePresence } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import {
  UserRound,
  Mail,
  LockKeyhole,
  ChevronRight,
  BriefcaseBusiness,
  LineChart,
  Clock,
  Sparkles,
  Zap,
  BarChart2,
  Users,
  CheckCircle
} from "lucide-react";
import { SignIn, SignUp, useClerk } from "@clerk/clerk-react";

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Lightning Fast Processing",
    description: "Analyze resumes in seconds with our optimized AI engine"
  },
  {
    icon: <BarChart2 className="w-6 h-6" />,
    title: "Data-Driven Insights",
    description: "Get actionable metrics to improve your hiring process"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Candidate Matching",
    description: "Find the perfect fit based on skills and culture"
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: "Bias Reduction",
    description: "Our algorithms help minimize unconscious bias"
  }
];

const testimonials = [
  {
    quote: "Resumer AI cut our hiring time by 70% while improving candidate quality.",
    author: "Sarah Johnson",
    role: "HR Director at TechCorp"
  },
  {
    quote: "The AI insights helped us identify top talent we would have otherwise missed.",
    author: "Michael Chen",
    role: "Founder at StartupX"
  }
];

function ParticleBackground() {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mousePos = useRef({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Create particles
    particles.current = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.2 + 0.1,
      direction: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.5 + 0.3
    }));

    // Mouse movement handler
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', () => {
      mousePos.current = { x: null, y: null };
    });

    // Animation loop
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.current.forEach(particle => {
        // Update position
        particle.x += Math.cos(particle.direction) * particle.speed;
        particle.y += Math.sin(particle.direction) * particle.speed;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.direction = Math.PI - particle.direction;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.direction = -particle.direction;
        }
        
        // Mouse repulsion
        if (mousePos.current.x && mousePos.current.y) {
          const dx = particle.x - mousePos.current.x;
          const dy = particle.y - mousePos.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const force = (100 - distance) / 100;
            particle.x += dx / distance * force * 2;
            particle.y += dy / distance * force * 2;
          }
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();
      });
      
      // Draw connections between particles
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const p1 = particles.current[i];
          const p2 = particles.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance/100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

export default function AuthPage() {
  const [location, navigate] = useLocation();
  const [activeFeature, setActiveFeature] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const clerk = useClerk();
  const [verificationStatus, setVerificationStatus] = useState("loading");

  // Auto-rotate features and testimonials
  useEffect(() => {
    const featureInterval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    
    const testimonialInterval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    
    return () => {
      clearInterval(featureInterval);
      clearInterval(testimonialInterval);
    };
  }, []);

  if (false) return <Redirect to="/" />;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      {/* LEFT PANEL - Enhanced */}
      <div className="relative hidden md:flex md:w-1/2 bg-[rgb(3,7,18)] text-white overflow-hidden items-center justify-center p-10">
        <ParticleBackground />
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-pink-900/30" />
        
        {/* Floating sparkles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 5 + 2}px`,
                height: `${Math.random() * 5 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.3
              }}
              animate={{
                y: [0, (Math.random() - 0.5) * 50],
                x: [0, (Math.random() - 0.5) * 50],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: Math.random() * 10 + 5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 max-w-lg w-full space-y-12">
          {/* Logo and headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center mb-6">
              <Sparkles className="w-8 h-8 text-purple-400 mr-3" />
              <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                Resumer AI
              </h1>
            </div>
            <h2 className="text-3xl font-semibold leading-tight">
              The Future of <span className="text-purple-300">Intelligent</span> Hiring
            </h2>
          </motion.div>
          
          {/* Features carousel */}
          <div className="relative h-48">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <div className="flex items-start space-x-4 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="p-2 bg-purple-500/20 rounded-lg text-purple-300">
                    {features[activeFeature].icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">
                      {features[activeFeature].title}
                    </h3>
                    <p className="text-white/80">
                      {features[activeFeature].description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className={`w-2 h-2 rounded-full transition-all ${activeFeature === index ? 'bg-white w-4' : 'bg-white/30'}`}
                />
              ))}
            </div>
          </div>
          
          {/* Testimonials */}
          <div className="relative h-40">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <p className="italic text-white/90 mb-3">
                    "{testimonials[activeTestimonial].quote}"
                  </p>
                  <div className="text-right">
                    <p className="font-medium">
                      {testimonials[activeTestimonial].author}
                    </p>
                    <p className="text-sm text-white/60">
                      {testimonials[activeTestimonial].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Animated stats */}
          <motion.div 
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {[
              { value: "10K+", label: "Resumes Analyzed" },
              { value: "95%", label: "Accuracy Rate" },
              { value: "3x", label: "Faster Hiring" },
              { value: "500+", label: "Happy Clients" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="p-4 bg-white/5 rounded-lg border border-white/10 text-center"
              >
                <motion.p 
                  className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    delay: 0.2 + index * 0.1,
                    type: "spring",
                    stiffness: 300
                  }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-sm text-white/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* RIGHT PANEL - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white text-[rgb(3,7,18)]">
        <div className="w-full max-w-md">
          {location === "/login" && (
            <SignIn 
              signInUrl="/login"
              fallbackRedirectUrl="/dashboard"  
            />
          )}

          {location === "/signup" && (
            <SignUp 
              fallbackRedirectUrl="/dashboard" 
            />
          )}
        </div>
      </div>
    </div>
  );
}