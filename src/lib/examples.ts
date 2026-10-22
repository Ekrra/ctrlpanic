export type Example = { id: string; label: string; tag: string; code: string; error: string };

/** Starter snippets students can load. These are inputs only — results always come from the AI. */
export const EXAMPLES: Example[] = [
  {
    id: "colon",
    label: "Missing colon",
    tag: "SyntaxError",
    code: `def greet(name)\n    print("Hello, " + name)\n\ngreet("Ekra")`,
    error: `  File "main.py", line 1\n    def greet(name)\n                   ^\nSyntaxError: expected ':'`,
  },
  {
    id: "indent",
    label: "Wobbly indents",
    tag: "IndentationError",
    code: `for i in range(3):\nprint(i)`,
    error: `IndentationError: expected an indented block after 'for' statement on line 1`,
  },
  {
    id: "type",
    label: "Text + number",
    tag: "TypeError",
    code: `age = 19\nprint("I am " + age + " years old")`,
    error: `TypeError: can only concatenate str (not "int") to str`,
  },
  {
    id: "index",
    label: "Off by one",
    tag: "IndexError",
    code: `nums = [4, 8, 15, 16, 23]\nfor i in range(len(nums) + 1):\n    print(nums[i])`,
    error: `IndexError: list index out of range`,
  },
  {
    id: "cp",
    label: "CP input parsing",
    tag: "ValueError",
    code: `n = int(input())\na = int(input())\nprint(sum(a) // n)`,
    error: `ValueError: invalid literal for int() with base 10: '1 2 3'`,
  },
];
