import type { Analysis } from "./debug.schema";
import type { CompetitiveAnalysis } from "./competitive.schema";
import type { Language } from "./language";

/**
 * Offline demo samples, written in advance by hand. They are NOT AI output and
 * are never presented as analysis of the student's own code. The UI always
 * labels them as offline samples. Used when live AI is unavailable.
 */

export type DebugSample = { code: string; error: string; analysis: Analysis };
export type CompetitiveSample = {
  statement: string; sampleInput: string; sampleOutput: string; constraints: string; code: string;
  analysis: CompetitiveAnalysis;
};

const DEBUG_CODE = `age = 19\nprint("I am " + age + " years old")`;
const DEBUG_ERROR = `Traceback (most recent call last):\n  File "main.py", line 2, in <module>\n    print("I am " + age + " years old")\nTypeError: can only concatenate str (not "int") to str`;
const DEBUG_FIXED = `age = 19\nprint("I am " + str(age) + " years old")`;

export const DEBUG_SAMPLES: Record<Language, DebugSample> = {
  en: {
    code: DEBUG_CODE, error: DEBUG_ERROR,
    analysis: {
      hasError: true, errorType: "TypeError", lineNumber: 2, lineCode: `print("I am " + age + " years old")`,
      friendlyQuip: "Text and numbers want to hang out, they just need an introduction first.",
      simpleExplanation: "Python can join text to text with +, but here it is trying to join text to the number 19. It doesn't know how to glue those two different kinds of values together, so it stops.",
      whyItHappened: "Every value in Python has a type. \"I am \" is a string (text) and age is an int (a whole number). The + sign means \"join\" for strings and \"add\" for numbers, so mixing them is ambiguous. You must convert the number to text first with str().",
      correctedCode: DEBUG_FIXED,
      steps: [
        "Read the last line of the error: it says str and int were mixed with +.",
        "Find line 2, where \"I am \" (text) is joined with age (a number).",
        "Wrap the number in str() so it becomes text: str(age).",
        "Run it again. It prints: I am 19 years old",
      ],
      practice: {
        question: "score = 42. Write one line that prints: Your score is 42",
        hint: "Convert score to text before joining, or use an f-string.",
        answer: `print("Your score is " + str(score))\n# or\nprint(f"Your score is {score}")`,
      },
    },
  },
  bn: {
    code: DEBUG_CODE, error: DEBUG_ERROR,
    analysis: {
      hasError: true, errorType: "TypeError", lineNumber: 2, lineCode: `print("I am " + age + " years old")`,
      friendlyQuip: "লেখা আর সংখ্যা বন্ধু হতে চায়, শুধু আগে পরিচয় করিয়ে দিতে হবে।",
      simpleExplanation: "Python + দিয়ে লেখার সঙ্গে লেখা জুড়তে পারে, কিন্তু এখানে লেখার সঙ্গে 19 সংখ্যাটি জুড়তে চেষ্টা করছে। দুই ধরনের মান কীভাবে জোড়া লাগাবে Python তা জানে না, তাই থেমে যায়।",
      whyItHappened: "Python-এ প্রতিটি মানের একটি ধরন (type) থাকে। \"I am \" হলো string (লেখা), আর age হলো int (পূর্ণ সংখ্যা)। string-এর জন্য + মানে \"জোড়া লাগানো\", সংখ্যার জন্য + মানে \"যোগ করা\"। তাই দুটো মেশালে বিভ্রান্তি হয়। আগে str() দিয়ে সংখ্যাকে লেখায় বদলাতে হবে।",
      correctedCode: DEBUG_FIXED,
      steps: [
        "ত্রুটির শেষ লাইনটি পড়ুন: সেখানে বলা আছে + দিয়ে str আর int মেশানো হয়েছে।",
        "লাইন 2 খুঁজুন, যেখানে \"I am \" (লেখা) আর age (সংখ্যা) জোড়া হচ্ছে।",
        "সংখ্যাটিকে str() দিয়ে ঘিরে দিন, যাতে এটি লেখা হয়ে যায়: str(age)।",
        "আবার চালান। এটি দেখাবে: I am 19 years old",
      ],
      practice: {
        question: "score = 42। এমন একটি লাইন লিখুন যা দেখাবে: Your score is 42",
        hint: "জোড়ার আগে score-কে লেখায় বদলান, অথবা f-string ব্যবহার করুন।",
        answer: `print("Your score is " + str(score))\n# অথবা\nprint(f"Your score is {score}")`,
      },
    },
  },
};

const SOLVER_STATEMENT_EN = "You are given n integers. Print the largest of them.\nInput: the first line contains n. The second line contains n integers separated by spaces.\nOutput: print one integer, the largest value.";
const SOLVER_STATEMENT_BN = "আপনাকে n টি পূর্ণ সংখ্যা দেওয়া হবে। এদের মধ্যে সবচেয়ে বড়টি প্রিন্ট করুন।\nইনপুট: প্রথম লাইনে n। দ্বিতীয় লাইনে স্পেস দিয়ে আলাদা করা n টি সংখ্যা।\nআউটপুট: একটি সংখ্যা, সবচেয়ে বড় মানটি।";
const SOLVER_SOLUTION = `n = int(input())\nnums = list(map(int, input().split()))\nlargest = nums[0]\nfor x in nums:\n    if x > largest:\n        largest = x\nprint(largest)`;

const REVIEW_STATEMENT_EN = "Read n, then n integers on one line. Print their sum.";
const REVIEW_STATEMENT_BN = "n পড়ুন, তারপর এক লাইনে n টি সংখ্যা। তাদের যোগফল প্রিন্ট করুন।";
const REVIEW_CODE = `n = int(input())\nnums = list(map(int, input().split()))\ntotal = 0\nfor i in range(1, n):\n    total += nums[i]\nprint(total)`;
const REVIEW_FIXED = `n = int(input())\nnums = list(map(int, input().split()))\ntotal = 0\nfor i in range(n):\n    total += nums[i]\nprint(total)`;

export const SOLVER_SAMPLES: Record<Language, CompetitiveSample> = {
  en: {
    statement: SOLVER_STATEMENT_EN, sampleInput: "5\n3 9 2 7 4", sampleOutput: "9", constraints: "1 ≤ n ≤ 100000; -10^9 ≤ each value ≤ 10^9", code: "",
    analysis: {
      summary: "Walk through the list once, remember the biggest number you've seen. That's it!",
      problemExplanation: "We get a list of numbers and must find the biggest one. Think of looking at cards one by one and always keeping the highest card in your hand.",
      inputBreakdown: "Line 1: n, how many numbers there are.\nLine 2: the n numbers, separated by spaces. Example: 3 9 2 7 4.",
      outputBreakdown: "Print a single number: the largest value. For the sample, that is 9.",
      concepts: [
        { name: "input().split()", explanation: "Reads one line and cuts it at the spaces into separate pieces of text." },
        { name: "Running maximum", explanation: "A variable that always holds the biggest value seen so far while you loop." },
      ],
      hints: [
        "You only need to remember one number while reading the list. Which one?",
        "Start by assuming the first number is the largest.",
        "For every number, if it is bigger than your current largest, replace it.",
      ],
      algorithm: [
        "Read n.",
        "Read the n numbers into a list.",
        "Set largest to the first number.",
        "Go through each number; if it is bigger than largest, update largest.",
        "Print largest.",
      ],
      solution: SOLVER_SOLUTION,
      lineExplanations: [
        { line: 1, explanation: "Read the first line and turn it into a whole number n." },
        { line: 2, explanation: "Read the second line, split it at spaces, turn each piece into an int and store them in a list." },
        { line: 3, explanation: "Assume the first number is the largest for now." },
        { line: 4, explanation: "Look at every number x in the list, one by one." },
        { line: 5, explanation: "Check whether x beats the current largest." },
        { line: 6, explanation: "If it does, x becomes the new largest." },
        { line: 7, explanation: "After the loop, print the answer." },
      ],
      complexity: { time: "O(n)", space: "O(n)", explanation: "n is how many numbers there are. We look at each number once, and we store the list. With n up to 100000 this is very fast. Python's built-in max(nums) does the same job in one line." },
      issues: [],
      testCases: [
        { input: "5\n3 9 2 7 4", expectedOutput: "9", reason: "The sample from the problem." },
        { input: "3\n-5 -2 -8", expectedOutput: "-2", reason: "All negative numbers: starting from 0 instead of nums[0] would give a wrong answer." },
        { input: "1\n42", expectedOutput: "42", reason: "Only one number." },
      ],
      caveats: ["This is a pre-written sample for a made-up problem, not an analysis of your input."],
    },
  },
  bn: {
    statement: SOLVER_STATEMENT_BN, sampleInput: "5\n3 9 2 7 4", sampleOutput: "9", constraints: "1 ≤ n ≤ 100000; -10^9 ≤ প্রতিটি মান ≤ 10^9", code: "",
    analysis: {
      summary: "তালিকাটি একবার ঘুরে দেখুন, এ পর্যন্ত দেখা সবচেয়ে বড় সংখ্যাটি মনে রাখুন। ব্যস!",
      problemExplanation: "আমরা কিছু সংখ্যার একটি তালিকা পাব, আর সবচেয়ে বড়টি খুঁজতে হবে। ভাবুন, একটা একটা করে কার্ড দেখছেন আর হাতে সবসময় সবচেয়ে বড় কার্ডটি রাখছেন।",
      inputBreakdown: "লাইন 1: n, মোট কয়টি সংখ্যা।\nলাইন 2: স্পেস দিয়ে আলাদা করা n টি সংখ্যা। উদাহরণ: 3 9 2 7 4।",
      outputBreakdown: "একটি সংখ্যা প্রিন্ট করুন: সবচেয়ে বড় মানটি। উদাহরণে উত্তর 9।",
      concepts: [
        { name: "input().split()", explanation: "একটি লাইন পড়ে স্পেসের জায়গায় কেটে আলাদা আলাদা টুকরো (লেখা) বানায়।" },
        { name: "চলমান সর্বোচ্চ (running maximum)", explanation: "লুপ চলার সময় এ পর্যন্ত দেখা সবচেয়ে বড় মানটি ধরে রাখে এমন একটি ভেরিয়েবল।" },
      ],
      hints: [
        "তালিকা পড়ার সময় শুধু একটি সংখ্যা মনে রাখলেই চলে। কোনটি?",
        "শুরুতে ধরে নিন প্রথম সংখ্যাটিই সবচেয়ে বড়।",
        "প্রতিটি সংখ্যার জন্য: যদি সেটি এখনকার সবচেয়ে বড়টির চেয়ে বড় হয়, তাহলে বদলে দিন।",
      ],
      algorithm: [
        "n পড়ুন।",
        "n টি সংখ্যা একটি তালিকায় পড়ুন।",
        "largest-এ প্রথম সংখ্যাটি রাখুন।",
        "প্রতিটি সংখ্যা দেখুন; largest-এর চেয়ে বড় হলে largest বদলান।",
        "largest প্রিন্ট করুন।",
      ],
      solution: SOLVER_SOLUTION,
      lineExplanations: [
        { line: 1, explanation: "প্রথম লাইন পড়ে পূর্ণ সংখ্যা n বানানো হয়।" },
        { line: 2, explanation: "দ্বিতীয় লাইন পড়ে স্পেসে ভাগ করা হয়, প্রতিটি টুকরোকে int বানিয়ে একটি তালিকায় রাখা হয়।" },
        { line: 3, explanation: "আপাতত ধরে নেওয়া হয় প্রথম সংখ্যাটিই সবচেয়ে বড়।" },
        { line: 4, explanation: "তালিকার প্রতিটি সংখ্যা x একটি একটি করে দেখা হয়।" },
        { line: 5, explanation: "x কি এখনকার largest-এর চেয়ে বড়? তা যাচাই করা হয়।" },
        { line: 6, explanation: "বড় হলে x হয়ে যায় নতুন largest।" },
        { line: 7, explanation: "লুপ শেষে উত্তর প্রিন্ট করা হয়।" },
      ],
      complexity: { time: "O(n)", space: "O(n)", explanation: "n হলো মোট সংখ্যার পরিমাণ। প্রতিটি সংখ্যা একবার দেখা হয়, আর তালিকাটি জমা রাখা হয়। n সর্বোচ্চ 100000 হলেও এটি খুব দ্রুত। Python-এর নিজস্ব max(nums) এক লাইনেই একই কাজ করে।" },
      issues: [],
      testCases: [
        { input: "5\n3 9 2 7 4", expectedOutput: "9", reason: "প্রশ্নের দেওয়া উদাহরণ।" },
        { input: "3\n-5 -2 -8", expectedOutput: "-2", reason: "সব সংখ্যা ঋণাত্মক: nums[0]-এর বদলে 0 দিয়ে শুরু করলে ভুল উত্তর আসবে।" },
        { input: "1\n42", expectedOutput: "42", reason: "মাত্র একটি সংখ্যা।" },
      ],
      caveats: ["এটি একটি বানানো প্রশ্নের জন্য আগে থেকে লেখা নমুনা, আপনার ইনপুটের বিশ্লেষণ নয়।"],
    },
  },
};

export const REVIEW_SAMPLES: Record<Language, CompetitiveSample> = {
  en: {
    statement: REVIEW_STATEMENT_EN, sampleInput: "4\n1 2 3 4", sampleOutput: "10", constraints: "1 ≤ n ≤ 100000", code: REVIEW_CODE,
    analysis: {
      summary: "So close! The loop skips the very first number, so the sum comes out too small.",
      problemExplanation: "The code reads n numbers and adds them up. The reading part is correct; the loop is where things go wrong.",
      inputBreakdown: "Line 1: n. Line 2: n integers separated by spaces.",
      outputBreakdown: "One integer: the sum of all n numbers. For the sample, 1 + 2 + 3 + 4 = 10.",
      concepts: [{ name: "range(start, stop)", explanation: "range(1, n) gives 1, 2, …, n-1. List indexes start at 0, so index 0 is never visited." }],
      hints: [],
      algorithm: ["Read n.", "Read the numbers into a list.", "Start total at 0.", "Add every number, starting from index 0.", "Print total."],
      solution: REVIEW_FIXED,
      lineExplanations: [
        { line: 1, explanation: "Read how many numbers there are." },
        { line: 2, explanation: "Read the numbers into a list of ints." },
        { line: 3, explanation: "The running sum starts at 0." },
        { line: 4, explanation: "range(n) visits indexes 0 to n-1, so no number is skipped." },
        { line: 5, explanation: "Add the current number to the total." },
        { line: 6, explanation: "Print the final sum." },
      ],
      complexity: { time: "O(n)", space: "O(n)", explanation: "n is how many numbers there are. Each number is added once, which is fast for n up to 100000. sum(nums) would also work." },
      issues: [
        { category: "logic", line: 4, explanation: "range(1, n) starts at index 1, so nums[0] is never added. For the sample, the code prints 9 instead of 10.", suggestion: "Use range(n) so the loop starts at index 0." },
        { category: "edge case", line: 4, explanation: "With n = 1, range(1, 1) is empty, so the code prints 0 instead of the only number.", suggestion: "The same fix, range(n), handles this case." },
      ],
      testCases: [
        { input: "4\n1 2 3 4", expectedOutput: "10", reason: "The sample; the original code would print 9." },
        { input: "1\n7", expectedOutput: "7", reason: "Single number; the original code would print 0." },
      ],
      caveats: ["This is a pre-written sample review of example code, not a review of your solution."],
    },
  },
  bn: {
    statement: REVIEW_STATEMENT_BN, sampleInput: "4\n1 2 3 4", sampleOutput: "10", constraints: "1 ≤ n ≤ 100000", code: REVIEW_CODE,
    analysis: {
      summary: "প্রায় হয়ে গেছে! লুপটি একদম প্রথম সংখ্যাটি বাদ দিয়ে যায়, তাই যোগফল কম আসে।",
      problemExplanation: "কোডটি n টি সংখ্যা পড়ে যোগ করে। পড়ার অংশটি ঠিক আছে; সমস্যা লুপে।",
      inputBreakdown: "লাইন 1: n। লাইন 2: স্পেস দিয়ে আলাদা করা n টি পূর্ণ সংখ্যা।",
      outputBreakdown: "একটি সংখ্যা: n টি সংখ্যার যোগফল। উদাহরণে 1 + 2 + 3 + 4 = 10।",
      concepts: [{ name: "range(start, stop)", explanation: "range(1, n) দেয় 1, 2, …, n-1। তালিকার ইনডেক্স শুরু হয় 0 থেকে, তাই ইনডেক্স 0 কখনও দেখা হয় না।" }],
      hints: [],
      algorithm: ["n পড়ুন।", "সংখ্যাগুলো একটি তালিকায় পড়ুন।", "total 0 দিয়ে শুরু করুন।", "ইনডেক্স 0 থেকে শুরু করে প্রতিটি সংখ্যা যোগ করুন।", "total প্রিন্ট করুন।"],
      solution: REVIEW_FIXED,
      lineExplanations: [
        { line: 1, explanation: "মোট কয়টি সংখ্যা তা পড়া হয়।" },
        { line: 2, explanation: "সংখ্যাগুলো পড়ে int-এর একটি তালিকায় রাখা হয়।" },
        { line: 3, explanation: "চলমান যোগফল 0 থেকে শুরু।" },
        { line: 4, explanation: "range(n) ইনডেক্স 0 থেকে n-1 পর্যন্ত যায়, তাই কোনো সংখ্যা বাদ পড়ে না।" },
        { line: 5, explanation: "এখনকার সংখ্যাটি total-এ যোগ করা হয়।" },
        { line: 6, explanation: "শেষ যোগফল প্রিন্ট করা হয়।" },
      ],
      complexity: { time: "O(n)", space: "O(n)", explanation: "n হলো মোট সংখ্যার পরিমাণ। প্রতিটি সংখ্যা একবার যোগ হয়, n সর্বোচ্চ 100000 হলেও তা দ্রুত। sum(nums)-ও কাজ করবে।" },
      issues: [
        { category: "logic", line: 4, explanation: "range(1, n) ইনডেক্স 1 থেকে শুরু হয়, তাই nums[0] কখনও যোগ হয় না। উদাহরণে কোডটি 10-এর বদলে 9 দেখায়।", suggestion: "range(n) ব্যবহার করুন, যাতে লুপ ইনডেক্স 0 থেকে শুরু হয়।" },
        { category: "edge case", line: 4, explanation: "n = 1 হলে range(1, 1) ফাঁকা, তাই একমাত্র সংখ্যাটির বদলে কোডটি 0 দেখায়।", suggestion: "একই সমাধান, range(n), এই ক্ষেত্রটিও ঠিক করে।" },
      ],
      testCases: [
        { input: "4\n1 2 3 4", expectedOutput: "10", reason: "প্রশ্নের উদাহরণ; মূল কোডটি 9 দেখাত।" },
        { input: "1\n7", expectedOutput: "7", reason: "মাত্র একটি সংখ্যা; মূল কোডটি 0 দেখাত।" },
      ],
      caveats: ["এটি উদাহরণ কোডের আগে থেকে লেখা নমুনা রিভিউ, আপনার সমাধানের রিভিউ নয়।"],
    },
  },
};
