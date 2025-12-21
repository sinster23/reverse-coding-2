const challenges = [
  {
    id: 1,
    level: "Easy",
    title: "Mystery Sum",
    description: "Analyze the pattern between input and output. Write a function that takes a single integer and produces the corresponding output.",
    samples: [
      { input: "5", output: "15" },
      { input: "4", output: "10" },
      { input: "7", output: "28" },
    ],
    testCases: [
      { input: "5", output: "15" },
      { input: "4", output: "10" },
      { input: "7", output: "28" },
      { input: "1", output: "1" },
      { input: "3", output: "6" },
      { input: "10", output: "55" },
      { input: "6", output: "21" },
      { input: "8", output: "36" },
    ],
  },
    {
    id: 2,
    level: "Medium",
    title: "Number Transformer",
    description: "Discover the hidden logic behind these transformations. Write a function that takes a single integer and produces the pattern-based output.",
    samples: [
      { input: "6", output: "36" },
      { input: "9", output: "90" },
      { input: "4", output: "16" },
    ],
    testCases: [
      { input: "6", output: "36" },
      { input: "9", output: "90" },
      { input: "4", output: "16" },
      { input: "2", output: "4" },
      { input: "8", output: "64" },
      { input: "5", output: "30" },
      { input: "7", output: "56" },
      { input: "3", output: "12" },
      { input: "10", output: "100" },
    ],
  },
  {
    id: 3,
    level: "Medium",
    title: "Array Mystery",
    description: "Study the relationship between the input arrays and their outputs. Write a function that takes a space-separated list of integers and returns the decoded value. Note: The input array may or may not be sorted.",
    samples: [
      { input: "3 1 4 2 5", output: "24" },
      { input: "10 5 2 8", output: "40" },
      { input: "7 9 1 6 3", output: "126" },
    ],
    testCases: [
      { input: "3 1 4 2 5", output: "24" },
      { input: "10 5 2 8", output: "40" },
      { input: "7 9 1 6 3", output: "126" },
      { input: "5 3 7 2 9", output: "105" },
      { input: "1 2 3 4 5", output: "24" },
      { input: "8 6 4 2 1", output: "48" },
      { input: "15 10 20 5", output: "150" },
      { input: "100 50 25 75", output: "3750" },
    ],
  },
];

export default challenges;