import { useState } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { RoastDisplay } from "@/components/RoastDisplay";
import { Navigation } from "@/components/Navigation";
import { Code2, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { roastService } from "../../backend/services/roast.service";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [roast, setRoast] = useState<string | null>(null);
  const [isRoasting, setIsRoasting] = useState(false);
  const { toast } = useToast();
  const { refreshProfile } = useAuth();

  const handleRoast = async () => {
    if (!code.trim()) {
      toast({
        title: "No code provided",
        description: "Please paste some code to roast!",
        variant: "destructive",
      });
      return;
    }

    setIsRoasting(true);
    setRoast(null);

    try {
      // Generate roast using backend service
      const { roast: generatedRoast, error: roastError } =
        await roastService.generateRoast(code, language);

      if (roastError) {
        console.error("Function error:", roastError);
        throw roastError;
      }

      if (!generatedRoast) {
        throw new Error("Failed to generate roast");
      }

      setRoast(generatedRoast);

      // Save roast to database
      const { error: saveError } = await roastService.saveRoast({
        code,
        language,
        roast_content: generatedRoast,
        severity_level: Math.floor(Math.random() * 5) + 1, // Random severity 1-5
        is_public: true,
      });

      if (saveError) {
        console.error("Error saving roast:", saveError);
        // Don't fail the whole operation if saving fails
        toast({
          title: "Roast generated but not saved",
          description:
            "The roast was generated but couldn't be saved to your history.",
          variant: "destructive",
        });
      } else {
        // Refresh user profile to update stats
        await refreshProfile();
      }
    } catch (error) {
      console.error("Error generating roast:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      toast({
        title: "Roast generation failed",
        description: errorMessage.includes("429")
          ? "Too many requests! Please try again in a moment."
          : errorMessage.includes("402")
          ? "AI credits depleted. Please add funds."
          : "Failed to generate roast. Please try again.",
        variant: "destructive",
      });

      // Fallback to a generic roast
      setRoast(
        "🔥 Well, I tried to roast your code but the AI got tired just looking at it. " +
          "That's not a good sign!\n\n💡 Improvement: Try submitting less code at once, " +
          "or check your network connection."
      );
    } finally {
      setIsRoasting(false);
    }
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
            Paste your code and receive AI-powered, hilarious roasts. Transform
            debugging into entertainment! 🔥
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
