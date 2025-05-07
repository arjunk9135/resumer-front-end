import { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FormLabel } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

// Sample job description templates
const jobTemplates = {
  "frontend-developer": 
    `We're looking for a talented Frontend Developer who is passionate about building intuitive user interfaces. The ideal candidate has 3+ years of experience with modern JavaScript frameworks (React preferred), strong HTML/CSS skills, and experience with responsive design. Responsibilities include implementing UI components, collaborating with designers, and ensuring cross-browser compatibility.`,
  
  "backend-developer":
    `Our team is seeking a Backend Developer with expertise in building scalable services. You should have 4+ years of experience with server-side languages (Node.js, Python, or Java), database design, and API development. Experience with cloud platforms (AWS/Azure/GCP) and containerization is a plus. You'll be responsible for developing APIs, optimizing database performance, and ensuring system reliability.`,
  
  "data-scientist":
    `We're looking for a Data Scientist to extract valuable insights from our data. The ideal candidate has 3+ years of experience with statistical analysis, machine learning algorithms, and data visualization. Proficiency in Python and SQL is required. You'll be responsible for developing predictive models, analyzing trends, and communicating findings to stakeholders.`,
  
  "product-manager":
    `We're seeking a Product Manager to lead product development from conception to launch. The ideal candidate has 5+ years of experience in product management, a track record of shipping successful products, and excellent communication skills. You'll be responsible for defining product strategy, gathering requirements, and working with engineering and design teams to deliver exceptional user experiences.`,
  
  "ux-designer":
    `Our team is looking for a UX Designer who can create intuitive and engaging user experiences. The ideal candidate has 3+ years of experience in user-centered design, proficiency with design tools (Figma, Sketch), and experience conducting user research. You'll be responsible for creating wireframes, prototypes, and high-fidelity designs while collaborating with product and engineering teams.`
};

export default function JobDescriptionInput({ value, onChange, error }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  const generateJobDescription = (template) => {
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      onChange(jobTemplates[template]);
      setIsGenerating(false);
      
      toast({
        title: "Job description generated",
        description: "You can now edit the generated description or continue to the next step.",
      });
    }, 1000);
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <FormLabel>Job Description</FormLabel>
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-primary text-sm font-medium flex items-center"
            onClick={() => document.getElementById('template-dropdown').classList.toggle('hidden')}
          >
            <Wand2 className="h-4 w-4 mr-1" />
            Generate with AI
          </Button>
          
          <div 
            id="template-dropdown"
            className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 hidden"
          >
            <div className="py-1" role="menu" aria-orientation="vertical">
              <button 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={() => generateJobDescription('frontend-developer')}
                disabled={isGenerating}
              >
                Frontend Developer
              </button>
              <button 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={() => generateJobDescription('backend-developer')}
                disabled={isGenerating}
              >
                Backend Developer
              </button>
              <button 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={() => generateJobDescription('data-scientist')}
                disabled={isGenerating}
              >
                Data Scientist
              </button>
              <button 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={() => generateJobDescription('product-manager')}
                disabled={isGenerating}
              >
                Product Manager
              </button>
              <button 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={() => generateJobDescription('ux-designer')}
                disabled={isGenerating}
              >
                UX Designer
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder="Enter detailed job description or generate one with AI..."
        className={error ? 'border-destructive' : ''}
      />
      
      {isGenerating && (
        <div className="text-sm text-muted-foreground animate-pulse">
          Generating job description...
        </div>
      )}
    </div>
  );
}
