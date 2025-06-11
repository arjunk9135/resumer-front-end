import { useState } from 'react';
import { Wand2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FormLabel } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import FullScreenLoader from '../ui/Loader2/FullScreenLoader';
import { BookText } from 'lucide-react';


export default function JobDescriptionInput({ field, error }) {
  const apiKey = import.meta.env.VITE_GEN_AI_KEY;
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);


  function cleanJobDescription(text) {
    return text
      // Remove markdown code blocks (``` or ```plaintext etc)
      .replace(/```[a-zA-Z]*\n?/g, '')
      .replace(/```/g, '')
      // Remove lines containing only 'plainText' or similar tags
      .replace(/^\s*plainText\s*$/gm, '')
      // Remove markdown headings (##, ###, ####)
      .replace(/^#{2,6}\s*/gm, '')
      // Remove markdown bold (**text**) and italic (*text*)
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      // Remove markdown bullet points like "-" or "•"
      .replace(/^\s*[-•]\s*/gm, '')
      // Remove stray characters like <<#
      .replace(/<<#+/g, '')
      // Remove multiple blank lines (keep max 2)
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  const generateWithAI = async () => {
    if (!field.value?.trim()) {
      toast({
        title: "JD is empty",
        description: "Please enter a base idea or job title before generating.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setLoading(true);
    toast({
      title: "Generating JD...",
      description: "This may take a few seconds.",
    });
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          // 'Authorization': `Bearer ${}`
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-prover-v2:free",
          messages: [
            {
              role: "user",
              content: `Write a 100-word only job description for ${field?.value}. Make it concise, clear, and professional.
            It should include key responsibilities, required skills, and any specific qualifications. 
            Do NOT use any Markdown formatting, no asterisks (*), no bold (**), no hash (#) and no special characters for styling. 
            Only return plain text.If the input is not a valid job title, default to a software engineer job description.`
            }
          ],
          response_format: {
            type: "json_object"
          }
        }),
      });

      const data = await res.json();
      console.log('data', data)
      if (!res.ok) throw new Error(data.error || "AI generation failed.");

      const generatedJD = data?.choices?.[0]?.message?.content || "";

      field?.onChange(cleanJobDescription(generatedJD));

      toast({
        title: "Job description generated",
        description: "You can now edit the generated description or continue.",
      });
      setLoading(false);
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong while generating.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!field.value) return;
    try {
      await navigator.clipboard.writeText(field.value);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Job description copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {loading && <FullScreenLoader />}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                      <BookText className="w-5 h-5 text-purple-500" />
                      Job Description
                    </FormLabel>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={generateWithAI}
              disabled={isGenerating}
              className="text-primary text-sm font-medium flex items-center hover:bg-indigo-50 hover:text-black-500"
            >
              <Wand2 className="h-4 w-4 mr-1" />
              Generate with AI
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className={`flex items-center border-indigo-200 hover:bg-indigo-50 transition-all duration-150 ${copied ? "bg-green-100 border-green-300" : ""}`}
              disabled={!field.value}
              aria-label="Copy job description"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1 text-green-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="relative rounded-xl overflow-hidden shadow-sm border border-gray-100">
          <Textarea
            value={field.value}
            onChange={field.onChange}
            rows={6}
            placeholder="Enter detailed job description or generate one with AI..."
            className={`resize-none p-4 bg-transparent focus:ring-2 focus:ring-indigo-300 transition-all duration-150 text-base ${error ? 'border-destructive' : ''}`}
            style={{ minHeight: 120 }}
          />
          <div className="absolute right-3 bottom-2 text-xs text-indigo-400 select-none pointer-events-none">
            {field.value?.length || 0} chars
          </div>
        </div>

        {isGenerating && (
          <div className="text-sm text-muted-foreground animate-pulse">
            Generating job description...
          </div>
        )}
      </div>
    </>
  );
}

