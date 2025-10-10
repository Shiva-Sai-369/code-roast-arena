import { Link, useLocation } from "react-router-dom";
import { Code2, Trophy, Award } from "lucide-react";
import { Button } from "./ui/button";

export const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Code2 className="w-6 h-6 text-primary group-hover:text-accent transition-colors" />
            <span className="font-bold text-xl">Roast My Code</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant={isActive("/") ? "default" : "ghost"}
              className={isActive("/") ? "bg-primary" : ""}
            >
              <Link to="/">
                <Code2 className="mr-2 h-4 w-4" />
                Roast
              </Link>
            </Button>
            
            <Button
              asChild
              variant={isActive("/leaderboard") ? "default" : "ghost"}
              className={isActive("/leaderboard") ? "bg-primary" : ""}
            >
              <Link to="/leaderboard">
                <Trophy className="mr-2 h-4 w-4" />
                Leaderboard
              </Link>
            </Button>
            
            <Button
              asChild
              variant={isActive("/badges") ? "default" : "ghost"}
              className={isActive("/badges") ? "bg-primary" : ""}
            >
              <Link to="/badges">
                <Award className="mr-2 h-4 w-4" />
                Badges
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
