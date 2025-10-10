import { useState } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { RoastDisplay } from "@/components/RoastDisplay";
import { Navigation } from "@/components/Navigation";
import { Code2, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateRoast } from "@/lib/roastGenerator";

const Index = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [roast, setRoast] = useState<string | null>(null);
  const [isRoasting, setIsRoasting] = useState(false);

  const handleRoast = async () => {
    if (!code.trim()) return;
    
    setIsRoasting(true);
    setRoast(null);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const generatedRoast = generateRoast(code, language);
    setRoast(generatedRoast);
    setIsRoasting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Code2 className="w-12 h-12 text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Roast My Code
            </h1>
            <Flame className="w-12 h-12 text-warning animate-pulse" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Paste your code and receive AI-powered, hilarious roasts. 
            Transform debugging into entertainment! 🔥
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {/* Code Editor Section */}
          <div className="space-y-4">
            <CodeEditor
              code={code}
              language={language}
              onCodeChange={setCode}
              onLanguageChange={setLanguage}
            />
            
            <Button
              onClick={handleRoast}
              disabled={!code.trim() || isRoasting}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              size="lg"
            >
              {isRoasting ? (
                <>
                  <Flame className="mr-2 h-5 w-5 animate-pulse" />
                  Roasting Your Code...
                </>
              ) : (
                <>
                  <Flame className="mr-2 h-5 w-5" />
                  Roast My Code!
                </>
              )}
            </Button>
          </div>

          {/* Roast Display Section */}
          <RoastDisplay roast={roast} isRoasting={isRoasting} />
        </div>

        {/* Stats/Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="terminal-card p-6 text-center glow-border">
            <div className="text-4xl font-bold text-primary mb-2">10K+</div>
            <div className="text-muted-foreground">Codes Roasted</div>
          </div>
          <div className="terminal-card p-6 text-center glow-border">
            <div className="text-4xl font-bold text-accent mb-2">50+</div>
            <div className="text-muted-foreground">Languages Supported</div>
          </div>
          <div className="terminal-card p-6 text-center glow-border">
            <div className="text-4xl font-bold text-warning mb-2">100%</div>
            <div className="text-muted-foreground">Brutal Honesty</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
