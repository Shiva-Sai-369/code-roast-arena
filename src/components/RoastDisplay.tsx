import { Bot, Share2, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

interface RoastDisplayProps {
  roast: string | null;
  isRoasting: boolean;
}

export const RoastDisplay = ({ roast, isRoasting }: RoastDisplayProps) => {
  const { toast } = useToast();

  const handleCopy = () => {
    if (roast) {
      navigator.clipboard.writeText(roast);
      toast({
        title: "Copied!",
        description: "Roast copied to clipboard",
      });
    }
  };

  const handleShare = () => {
    toast({
      title: "Share coming soon!",
      description: "Social sharing will be available in the next update",
    });
  };

  return (
    <div className="terminal-card p-6 space-y-4 glow-border animate-slide-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-primary animate-pulse-glow" />
          <Label className="text-lg font-semibold text-foreground">
            AI Roast Chef
          </Label>
        </div>

        {roast && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="border-border hover:border-primary"
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="border-border hover:border-primary"
            >
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
          </div>
        )}
      </div>

      <div className="min-h-[400px] bg-muted/30 rounded-lg p-6 border border-border">
        {isRoasting ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <Bot className="w-16 h-16 text-primary animate-pulse-glow" />
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">Analyzing your code...</p>
              <p className="text-sm text-muted-foreground">
                Preparing a perfectly roasted response 🔥
              </p>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-3 h-3 bg-warning rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        ) : roast ? (
          <div className="space-y-4 animate-fade-in">
            <div className="roast-bubble">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {roast}
              </p>
            </div>
            
            <div className="flex items-center gap-2 pt-4 border-t border-border">
              <span className="text-xs text-muted-foreground">
                💡 Tip: Share your roast with friends and see how yours compares on the leaderboard!
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <Bot className="w-16 h-16 text-muted-foreground" />
            <div>
              <p className="text-lg font-semibold text-muted-foreground mb-2">
                No roast yet...
              </p>
              <p className="text-sm text-muted-foreground">
                Paste your code and hit the "Roast My Code" button to get started!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={className}>{children}</div>;
};
