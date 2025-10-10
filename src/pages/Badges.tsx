import { Navigation } from "@/components/Navigation";
import { Award, Lock, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
}

const mockBadges: BadgeItem[] = [
  {
    id: "1",
    name: "First Roast",
    description: "Submit your first code for roasting",
    icon: "🔥",
    unlocked: true,
    rarity: "common",
  },
  {
    id: "2",
    name: "Syntax Slayer",
    description: "Get roasted for 10 syntax errors",
    icon: "⚔️",
    unlocked: true,
    rarity: "common",
  },
  {
    id: "3",
    name: "Indentation Criminal",
    description: "Your indentation was so bad it's a crime",
    icon: "🚨",
    unlocked: true,
    rarity: "rare",
  },
  {
    id: "4",
    name: "Comment Ghost",
    description: "Submit code with zero comments 5 times",
    icon: "👻",
    unlocked: false,
    rarity: "rare",
  },
  {
    id: "5",
    name: "Var Veteran",
    description: "Use 'var' in JavaScript in 2024",
    icon: "🦕",
    unlocked: true,
    rarity: "epic",
  },
  {
    id: "6",
    name: "Bug Whisperer",
    description: "Code so buggy it speaks to insects",
    icon: "🐛",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "7",
    name: "Hall of Shame",
    description: "Reach #1 on the leaderboard",
    icon: "👑",
    unlocked: false,
    rarity: "legendary",
  },
  {
    id: "8",
    name: "Roast Master",
    description: "Submit 100 code snippets for roasting",
    icon: "🎖️",
    unlocked: false,
    rarity: "legendary",
  },
];

const Badges = () => {
  const getRarityColor = (rarity: BadgeItem["rarity"]) => {
    switch (rarity) {
      case "common":
        return "border-muted-foreground";
      case "rare":
        return "border-accent";
      case "epic":
        return "border-primary";
      case "legendary":
        return "border-warning";
    }
  };

  const getRarityBadge = (rarity: BadgeItem["rarity"]) => {
    const colors = {
      common: "bg-muted text-muted-foreground",
      rare: "bg-accent/20 text-accent border-accent",
      epic: "bg-primary/20 text-primary border-primary",
      legendary: "bg-warning/20 text-warning border-warning",
    };

    return (
      <Badge variant="outline" className={colors[rarity]}>
        {rarity.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="w-12 h-12 text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-warning bg-clip-text text-transparent">
              Badge Collection
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Earn badges for your coding mishaps and achievements 🏆
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
          <div className="terminal-card p-4 text-center">
            <div className="text-3xl font-bold text-primary">3</div>
            <div className="text-sm text-muted-foreground">Unlocked</div>
          </div>
          <div className="terminal-card p-4 text-center">
            <div className="text-3xl font-bold text-muted-foreground">5</div>
            <div className="text-sm text-muted-foreground">Locked</div>
          </div>
          <div className="terminal-card p-4 text-center">
            <div className="text-3xl font-bold text-accent">37%</div>
            <div className="text-sm text-muted-foreground">Progress</div>
          </div>
          <div className="terminal-card p-4 text-center">
            <div className="text-3xl font-bold text-warning">1,250</div>
            <div className="text-sm text-muted-foreground">XP Points</div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {mockBadges.map((badge, index) => (
            <div
              key={badge.id}
              className={`terminal-card p-6 text-center space-y-4 ${
                badge.unlocked ? "glow-border" : "opacity-60"
              } hover:scale-105 transition-transform animate-fade-in`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Badge Icon */}
              <div className="relative inline-block">
                <div
                  className={`text-6xl ${
                    !badge.unlocked && "filter grayscale"
                  }`}
                >
                  {badge.icon}
                </div>
                {!badge.unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                {badge.unlocked && (
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-primary rounded-full p-1">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                )}
              </div>

              {/* Badge Info */}
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-foreground">
                  {badge.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {badge.description}
                </p>
                {getRarityBadge(badge.rarity)}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 p-8 terminal-card glow-border max-w-2xl mx-auto">
          <p className="text-muted-foreground">
            Keep roasting your code to unlock more badges!
            <br />
            <span className="text-primary font-semibold">
              {mockBadges.filter(b => !b.unlocked).length} badges left to collect
            </span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Badges;
