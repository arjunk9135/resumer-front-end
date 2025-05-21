import { useState, useEffect , useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Redirect } from "wouter";
import { insertUserSchema } from "@shared/schema";
import { useLocation } from "wouter";

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
  rememberMe: z.boolean().optional(),
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

  const loginForm = useForm({ defaultValues: { username: "", password: "", rememberMe: false } });
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

  function onLoginSubmit(data) {
    loginMutation.mutate(data);
    navigate("/dashboard");
  }

  function onRegisterSubmit(data) {
    const { confirmPassword, acceptTerms, ...userData } = data;
    registerMutation.mutate(userData);
  }

  if (false) return <Redirect to="/" />;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white text-[rgb(3,7,18)]">
     {/* LEFT PANEL — ULTRA ANIMATED */}
      <div className="relative hidden md:flex md:w-1/2 bg-[rgb(3,7,18)] text-white overflow-hidden items-center justify-center p-10">
        <ParticleCanvas />

        {/* TEXT CONTENT */}
        <div className="relative z-10 max-w-lg text-left space-y-6 animate-fade-up">
          <div className="flex items-center space-x-3">
            <div className="bg-white text-[rgb(3,7,18)] p-2 rounded-lg shadow-lg">
              <BriefcaseBusiness className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-extrabold font-display tracking-tight">Resumer AI</h1>
          </div>

          <h2 className="text-3xl font-semibold leading-snug font-display">
            Unlock a Future-Ready Hiring Experience
          </h2>
          <p className="text-white/80 text-lg">
            Make hiring smarter, faster and jaw-droppingly smooth. Let AI handle the heavy lifting while you sip coffee.
          </p>

          {/* Dynamic Highlights */}
          <div className="space-y-8">
            {[
              {
                title: "Smart Resume Screening",
                icon: <UserRound className="h-6 w-6" />,
                desc: "Analyze 200+ resumes in seconds using smart AI.",
              },
              {
                title: "Powerful Visual Analytics",
                icon: <LineChart className="h-6 w-6" />,
                desc: "Gain rich insights into candidate metrics with visuals.",
              },
              {
                title: "Lightning-Fast Workflows",
                icon: <Clock className="h-6 w-6" />,
                desc: "Cut resume review time by 75% via automation.",
              },
              {
                title: "Deep AI Insights",
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
                desc: "Find hidden gems in seconds with advanced ML models.",
              },
            ].map((item, index) => (
              <div key={index} className={`transition-all duration-700 ${animationStep === index ? "opacity-100" : "opacity-0 absolute"} flex items-start space-x-4`}>
                <div className="bg-white/20 p-3 rounded-xl shadow-lg">{item.icon}</div>
                <div>
                  <h3 className="text-xl font-medium">{item.title}</h3>
                  <p className="text-white/80">{item.desc}</p>
                  <Button variant="link" className="text-white mt-2 p-0 group">
                    Learn more <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* RIGHT PANEL — LOGIN/REGISTER */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white text-[rgb(3,7,18)]">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{activeTab === "login" ? "Login" : "Register"}</CardTitle>
            <CardDescription>Welcome back to Resumer AI</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              {/* LOGIN FORM */}
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField name="username" control={loginForm.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField name="password" control={loginForm.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl><Input type="password" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField name="rememberMe" control={loginForm.control} render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <FormLabel>Remember me</FormLabel>
                      </FormItem>
                    )} />

                    <Button type="submit" className="w-full">Login</Button>
                  </form>
                </Form>
              </TabsContent>

              {/* REGISTER FORM */}
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField name="fullName" control={registerForm.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField name="email" control={registerForm.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input type="email" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField name="username" control={registerForm.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField name="password" control={registerForm.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl><Input type="password" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField name="confirmPassword" control={registerForm.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl><Input type="password" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField name="acceptTerms" control={registerForm.control} render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <FormLabel>I agree to the terms</FormLabel>
                      </FormItem>
                    )} />

                    <Button type="submit" className="w-full">Create Account</Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
