import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";

interface CodeEditorProps {
  code: string;
  language: string;
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: string) => void;
}

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "ruby", label: "Ruby" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
];

export const CodeEditor = ({
  code,
  language,
  onCodeChange,
  onLanguageChange,
}: CodeEditorProps) => {
  return (
    <div className="terminal-card p-6 space-y-4 glow-border animate-slide-in">
      <div className="flex items-center justify-between">
        <Label htmlFor="code-input" className="text-lg font-semibold text-foreground">
          📝 Paste Your Code
        </Label>
        
        <div className="w-48">
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="bg-muted border-border">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Textarea
        id="code-input"
        placeholder="// Paste your code here and prepare to be roasted...
function badCode() {
  var x = 1;
  var y = 2;
  return x + y;
}"
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        className="min-h-[400px] font-mono text-sm bg-muted/50 border-border resize-none focus:border-primary transition-colors"
      />

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span>Ready to roast</span>
      </div>
    </div>
  );
};
