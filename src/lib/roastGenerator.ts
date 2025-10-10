// Mock roast generator - can be replaced with real AI later
const roastTemplates = [
  {
    condition: (code: string) => code.includes("var "),
    roast: "🔥 Oh wow, 'var'? What year is this, 2010? Even Internet Explorer has moved on! 'let' and 'const' called - they want their job back. This code belongs in a museum, not a repository.\n\n💡 Improvement: Replace 'var' with 'let' or 'const' for better scoping and modern standards.",
  },
  {
    condition: (code: string) => code.split("\n").some(line => line.length > 120),
    roast: "🔥 These lines are longer than a CVS receipt! Did you forget that horizontal scrolling is NOT a feature? Your future self (and your teammates) will thank you for breaking this up.\n\n💡 Improvement: Keep lines under 80-100 characters for better readability.",
  },
  {
    condition: (code: string) => !code.includes("//") && !code.includes("/*"),
    roast: "🔥 Zero comments? Ah yes, because code is ALWAYS self-documenting... said no developer ever. When you revisit this in 3 months, you'll be wondering who wrote this mess (spoiler: it was you).\n\n💡 Improvement: Add comments to explain complex logic and business rules.",
  },
  {
    condition: (code: string) => code.split("\n").filter(line => line.trim()).length < 5,
    roast: "🔥 Is this code or a haiku? So minimal! While I appreciate brevity, even a fortune cookie has more substance. Add some logic, some error handling, SOMETHING!\n\n💡 Improvement: Consider edge cases and add proper error handling.",
  },
  {
    condition: (code: string) => /function\s+[a-z]+\(\)/.test(code),
    roast: "🔥 Single-letter function names? What are you, a human minifier? Your code reads like alphabet soup. Give your functions names that actually describe what they DO!\n\n💡 Improvement: Use descriptive function names like 'calculateTotal' instead of 'calc' or 'x'.",
  },
];

const defaultRoasts = [
  "🔥 This code is like a mystery novel - I have NO idea what's happening, and the ending is definitely going to be a bug. Add some structure, some naming conventions, maybe a README?\n\n💡 Improvement: Follow consistent naming conventions and add documentation.",
  
  "🔥 I've seen more elegant solutions in 'Hello World' tutorials. This looks like it was written during a caffeine crash at 3 AM. Which, to be fair, might explain everything.\n\n💡 Improvement: Refactor for clarity and consider breaking into smaller, reusable functions.",
  
  "🔥 This code has more red flags than a matador convention. Between the lack of error handling and those nested if statements, it's a disaster waiting to happen. But hey, at least it... exists?\n\n💡 Improvement: Add try-catch blocks and flatten nested conditionals.",
  
  "🔥 Ah yes, the classic 'works on my machine' special! This code is held together by hopes, dreams, and probably some global variables that shouldn't exist. Time for a rewrite?\n\n💡 Improvement: Avoid global state and implement proper scope management.",
  
  "🔥 This code is so inconsistent, it has an identity crisis. Pick a style guide and STICK TO IT! Your indentation looks like a staircase designed by M.C. Escher.\n\n💡 Improvement: Use a linter and formatter like ESLint and Prettier.",
];

export const generateRoast = (code: string, language: string): string => {
  if (!code.trim()) {
    return "🔥 Empty code? That's the most bug-free code I've ever seen! Unfortunately, it also does absolutely nothing. Try adding some actual code first!";
  }

  // Check template conditions
  for (const template of roastTemplates) {
    if (template.condition(code)) {
      return template.roast;
    }
  }

  // Return random default roast
  return defaultRoasts[Math.floor(Math.random() * defaultRoasts.length)];
};
