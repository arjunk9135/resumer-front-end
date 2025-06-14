import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Redirect } from "wouter";
import { insertUserSchema } from "@shared/schema";
import { useLocation } from "wouter";
import { useToast } from '@/hooks/use-toast';
import Cookies from 'js-cookie';
import SignUpPage from "../components/auth/sign-up";
import { FcGoogle } from "react-icons/fc"; // Import Google icon from react-icons

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Checkbox,
  FormMessage,
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui";


import {
  UserRound,
  Mail,
  LockKeyhole,
  ChevronRight,
  BriefcaseBusiness,
  LineChart,
  Clock
} from "lucide-react";
import SignInPage from "../components/auth/sign-in";

import { SignIn, SignUp, useClerk } from "@clerk/clerk-react";


function ParticleCanvas() {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const particles = useRef([]);
  const mousePos = useRef({ x: null, y: null });

  const PARTICLE_COUNT = 100;
  const MAX_DISTANCE = 120;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    // Resize handler
    function handleResize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }
    window.addEventListener("resize", handleResize);

    // Initialize particles
    particles.current = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.5,
      });
    }

    // Mouse move handler
    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      mousePos.current.x = e.clientX - rect.left;
      mousePos.current.y = e.clientY - rect.top;
    }
    function onMouseLeave() {
      mousePos.current.x = null;
      mousePos.current.y = null;
    }
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p1 = particles.current[i];
        for (let j = i + 1; j < PARTICLE_COUNT; j++) {
          const p2 = particles.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAX_DISTANCE) {
            const alpha = 0.4 * (1 - dist / MAX_DISTANCE);
            ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.current.forEach(p => {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x <= 0 || p.x >= width) p.vx *= -1;
        if (p.y <= 0 || p.y >= height) p.vy *= -1;

        // Mouse repulsion
        if (mousePos.current.x !== null) {
          const dx = p.x - mousePos.current.x;
          const dy = p.y - mousePos.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const force = (100 - dist) / 100;
            p.vx += (dx / dist) * force * 0.05;
            p.vy += (dy / dist) * force * 0.05;
          }
        }

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        gradient.addColorStop(0, `rgba(255,255,255,${p.opacity})`);
        gradient.addColorStop(1, "rgba(255,255,255,0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}

// Login Schema
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  // rememberMe: z.boolean().optional(),
});

// Register Schema
const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function AuthPage() {
  const [location, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("login");
  const { user, loginMutation, registerMutation } = useAuth();
  const [animationStep, setAnimationStep] = useState(0);
  const { toast } = useToast();
  const clerk = useClerk(); // Access Clerk instance
  const [verificationStatus, setVerificationStatus] = useState("loading");

  const baseUrlDev = "http://localhost:5001/api/auth";
  // const baseUrlTest = "http://13.60.98.6:5001/api/auth";
  const baseUrlTest = "api/auth"

  const loginForm = useForm({ defaultValues: { email: "", password: "" } });
  const registerForm = useForm({
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      email: "",
      acceptTerms: false,
    },
  });

  useEffect(() => {
    const timer = setInterval(() => setAnimationStep((prev) => (prev + 1) % 4), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (location === "/verify-email") {
      async function verifyEmail() {
        try {
          await clerk.handleEmailLinkVerification({
            redirectUrl: "/dashboard",
            redirectUrlComplete: "/dashboard",
          });
          setVerificationStatus("success");
        } catch (error) {
          console.error("Email verification failed:", error);
          setVerificationStatus("error");
        }
      }
      verifyEmail();
    }
  }, [location, clerk]);

  // authApi.js

  const signup = async (userData) => {
    try {
      const response = await fetch(`${baseUrlTest}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", // important for cookies
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.errors?.[0]?.msg || "Signup failed");
      }
      setActiveTab("login");
      return await response.json();
    } catch (error) {
      console.error("❌ Signup error:", error.message);
      throw error;
    }
  }

  const signin = async (userData) => {
    try {
      const response = await fetch(`${baseUrlTest}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", // to send/receive cookies
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error data:', errorData);
        throw new Error(errorData?.errors?.[0]?.msg || "Login failed");
      }

      return await response.json();
    } catch (error) {
      console.error("❌ Login error:", error.message);
      throw error;
    }
  }

  async function onLoginSubmit(data) {
    try {
      const res = await signin(data);
      if (res) {
        toast({
          title: "Success",
          description: "Login successful. Redirecting...",
          variant: "success",
        });
        Cookies.set("accessToken", res?.accessToken, {
          expires: 1,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        navigate("/dashboard");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Login failed. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function onRegisterSubmit(data) {
    try {
      const { confirmPassword, acceptTerms, ...userData } = data;
      const res = await signup(userData);
      if (res) {
        toast({
          title: "Success",
          description: "Registration complete. Please log in.",
          variant: "success",
        });
        setActiveTab("login");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Registration failed. Please try again.",
        variant: "destructive",
      });
    }
  }


  if (false) return <Redirect to="/" />;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      {/* LEFT PANEL */}
      <div className="relative hidden md:flex md:w-1/2 bg-[rgb(3,7,18)] text-white overflow-hidden items-center justify-center p-10">
        <ParticleCanvas />
        <div className="relative z-10 max-w-lg text-left space-y-6 animate-fade-up">
          <h1 className="text-4xl font-extrabold font-display tracking-tight">
            Resumer AI
          </h1>
          <h2 className="text-3xl font-semibold leading-snug font-display">
            Unlock a Future-Ready Hiring Experience
          </h2>
          <p className="text-white/80 text-lg">
            Make hiring smarter, faster, and jaw-droppingly smooth. Let AI handle the heavy lifting while you sip coffee.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white text-[rgb(3,7,18)]">
        <div className="w-full max-w-md">
          {location === "/login" && (
            <SignIn signInUrl="/login"
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
