import { Navigation } from "@/components/Navigation";
import { Trophy, Medal, Award, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LeaderboardEntry {
  rank: number;
  username: string;
  language: string;
  roastScore: number;
  codeSnippet: string;
  roastHighlight: string;
}

const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    username: "CodeNewbie2024",
    language: "JavaScript",
    roastScore: 95,
    codeSnippet: "var x = 1; var y = 2; return x + y;",
    roastHighlight: "Used 'var' in 2024. Museum-quality code!"
  },
  {
    rank: 2,
    username: "PythonPro",
    language: "Python",
    roastScore: 89,
    codeSnippet: "def func(a,b,c,d,e,f,g,h,i,j): ...",
    roastHighlight: "10 parameters? That's not a function, it's a grocery list!"
  },
  {
    rank: 3,
    username: "JavaJunkie",
    language: "Java",
    roastScore: 87,
    codeSnippet: "public static void main...",
    roastHighlight: "If verbosity was a language, this would be its Bible."
  },
  {
    rank: 4,
    username: "CSSWizard",
    language: "CSS",
    roastScore: 82,
    codeSnippet: "margin-left: 0.0000001px !important;",
    roastHighlight: "!important everywhere? You're not important, you're desperate."
  },
  {
    rank: 5,
    username: "RustBuster",
    language: "Rust",
    roastScore: 78,
    codeSnippet: "unsafe { ... }",
    roastHighlight: "Rust's whole selling point is safety. You had ONE JOB!"
  },
];

const Leaderboard = () => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-8 h-8 text-warning" />;
      case 2:
        return <Medal className="w-7 h-7 text-muted-foreground" />;
      case 3:
        return <Award className="w-7 h-7 text-accent" />;
      default:
        return <div className="w-8 h-8 flex items-center justify-center font-bold text-muted-foreground">#{rank}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-12 h-12 text-warning" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-warning via-accent to-primary bg-clip-text text-transparent">
              Hall of Shame
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            The most brutally roasted code in history 🔥
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {mockLeaderboard.map((entry) => (
            <div
              key={entry.rank}
              className="terminal-card p-6 glow-border hover:scale-[1.02] transition-transform animate-fade-in"
              style={{ animationDelay: `${entry.rank * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                {/* Rank Icon */}
                <div className="flex-shrink-0">
                  {getRankIcon(entry.rank)}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-foreground">
                        {entry.username}
                      </h3>
                      <Badge variant="outline" className="border-primary text-primary">
                        {entry.language}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-warning" />
                      <span className="text-2xl font-bold text-warning">
                        {entry.roastScore}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Roast Score
                      </span>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4 border border-border">
                    <code className="text-sm font-mono text-foreground">
                      {entry.codeSnippet}
                    </code>
                  </div>

                  <div className="roast-bubble">
                    <p className="text-sm text-foreground italic">
                      "{entry.roastHighlight}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 p-8 terminal-card glow-border max-w-2xl mx-auto">
          <p className="text-muted-foreground">
            Think your code can make it to the Hall of Shame? 
            <br />
            <span className="text-primary font-semibold">Submit your code now!</span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
