import type { Problem, Category, Difficulty } from '../types';

const FAMOUS_LEETCODE_PROBLEMS: Record<number, { title: string; category: Category; difficulty: Difficulty; tags: string[] }> = {
  1: { title: 'Two Sum', category: 'Arrays', difficulty: 'Easy', tags: ['Array', 'Hash Table'] },
  2: { title: 'Add Two Numbers', category: 'Algorithms', difficulty: 'Medium', tags: ['Linked List', 'Math'] },
  3: { title: 'Longest Substring Without Repeating Characters', category: 'Strings', difficulty: 'Medium', tags: ['Sliding Window', 'Hash Table'] },
  4: { title: 'Median of Two Sorted Arrays', category: 'Binary Search', difficulty: 'Hard', tags: ['Array', 'Binary Search'] },
  5: { title: 'Longest Palindromic Substring', category: 'Dynamic Programming', difficulty: 'Medium', tags: ['String', 'DP'] },
  6: { title: 'Zigzag Conversion', category: 'Strings', difficulty: 'Medium', tags: ['String'] },
  7: { title: 'Reverse Integer', category: 'Math', difficulty: 'Medium', tags: ['Math'] },
  8: { title: 'String to Integer (atoi)', category: 'Strings', difficulty: 'Medium', tags: ['String'] },
  9: { title: 'Palindrome Number', category: 'Math', difficulty: 'Easy', tags: ['Math'] },
  10: { title: 'Regular Expression Matching', category: 'Dynamic Programming', difficulty: 'Hard', tags: ['DP', 'String'] },
  11: { title: 'Container With Most Water', category: 'Arrays', difficulty: 'Medium', tags: ['Two Pointers', 'Array'] },
  12: { title: 'Integer to Roman', category: 'Math', difficulty: 'Medium', tags: ['Math', 'String'] },
  13: { title: 'Roman to Integer', category: 'Math', difficulty: 'Easy', tags: ['Math', 'String'] },
  14: { title: 'Longest Common Prefix', category: 'Strings', difficulty: 'Easy', tags: ['String'] },
  15: { title: '3Sum', category: 'Arrays', difficulty: 'Medium', tags: ['Array', 'Two Pointers'] },
  16: { title: '3Sum Closest', category: 'Arrays', difficulty: 'Medium', tags: ['Array', 'Two Pointers'] },
  17: { title: 'Letter Combinations of a Phone Number', category: 'Algorithms', difficulty: 'Medium', tags: ['Backtracking'] },
  18: { title: '4Sum', category: 'Arrays', difficulty: 'Medium', tags: ['Array', 'Two Pointers'] },
  19: { title: 'Remove Nth Node From End of List', category: 'Algorithms', difficulty: 'Medium', tags: ['Linked List'] },
  20: { title: 'Valid Parentheses', category: 'Stack', difficulty: 'Easy', tags: ['Stack', 'String'] },
  21: { title: 'Merge Two Sorted Lists', category: 'Algorithms', difficulty: 'Easy', tags: ['Linked List'] },
  22: { title: 'Generate Parentheses', category: 'Algorithms', difficulty: 'Medium', tags: ['Backtracking'] },
  23: { title: 'Merge k Sorted Lists', category: 'Heap', difficulty: 'Hard', tags: ['Heap', 'Linked List'] },
  24: { title: 'Swap Nodes in Pairs', category: 'Algorithms', difficulty: 'Medium', tags: ['Linked List'] },
  25: { title: 'Reverse Nodes in k-Group', category: 'Algorithms', difficulty: 'Hard', tags: ['Linked List'] },
  26: { title: 'Remove Duplicates from Sorted Array', category: 'Arrays', difficulty: 'Easy', tags: ['Two Pointers'] },
  27: { title: 'Remove Element', category: 'Arrays', difficulty: 'Easy', tags: ['Array'] },
  28: { title: 'Find Index of First Occurrence in String', category: 'Strings', difficulty: 'Easy', tags: ['String'] },
  29: { title: 'Divide Two Integers', category: 'Math', difficulty: 'Medium', tags: ['Math', 'Bit Manipulation'] },
  30: { title: 'Substring with Concatenation of All Words', category: 'Strings', difficulty: 'Hard', tags: ['Sliding Window'] },
  31: { title: 'Next Permutation', category: 'Arrays', difficulty: 'Medium', tags: ['Array', 'Two Pointers'] },
  32: { title: 'Longest Valid Parentheses', category: 'Dynamic Programming', difficulty: 'Hard', tags: ['DP', 'Stack'] },
  33: { title: 'Search in Rotated Sorted Array', category: 'Binary Search', difficulty: 'Medium', tags: ['Binary Search'] },
  34: { title: 'Find First and Last Position in Sorted Array', category: 'Binary Search', difficulty: 'Medium', tags: ['Binary Search'] },
  35: { title: 'Search Insert Position', category: 'Binary Search', difficulty: 'Easy', tags: ['Binary Search'] },
  36: { title: 'Valid Sudoku', category: 'Hash Table', difficulty: 'Medium', tags: ['Matrix', 'Hash Table'] },
  37: { title: 'Sudoku Solver', category: 'Algorithms', difficulty: 'Hard', tags: ['Backtracking'] },
  38: { title: 'Count and Say', category: 'Strings', difficulty: 'Medium', tags: ['String'] },
  39: { title: 'Combination Sum', category: 'Algorithms', difficulty: 'Medium', tags: ['Backtracking'] },
  40: { title: 'Combination Sum II', category: 'Algorithms', difficulty: 'Medium', tags: ['Backtracking'] },
  41: { title: 'First Missing Positive', category: 'Arrays', difficulty: 'Hard', tags: ['Array', 'Hash Table'] },
  42: { title: 'Trapping Rain Water', category: 'Arrays', difficulty: 'Hard', tags: ['Two Pointers', 'Stack'] },
  43: { title: 'Multiply Strings', category: 'Math', difficulty: 'Medium', tags: ['Math', 'String'] },
  44: { title: 'Wildcard Matching', category: 'Dynamic Programming', difficulty: 'Hard', tags: ['DP'] },
  45: { title: 'Jump Game II', category: 'Dynamic Programming', difficulty: 'Medium', tags: ['Greedy', 'DP'] },
  46: { title: 'Permutations', category: 'Algorithms', difficulty: 'Medium', tags: ['Backtracking'] },
  47: { title: 'Permutations II', category: 'Algorithms', difficulty: 'Medium', tags: ['Backtracking'] },
  48: { title: 'Rotate Image', category: 'Arrays', difficulty: 'Medium', tags: ['Matrix'] },
  49: { title: 'Group Anagrams', category: 'Hash Table', difficulty: 'Medium', tags: ['Hash Table', 'String'] },
  50: { title: 'Pow(x, n)', category: 'Math', difficulty: 'Medium', tags: ['Math', 'Recursion'] },
  51: { title: 'N-Queens', category: 'Algorithms', difficulty: 'Hard', tags: ['Backtracking'] },
  53: { title: 'Maximum Subarray', category: 'Dynamic Programming', difficulty: 'Medium', tags: ['Array', 'DP'] },
  54: { title: 'Spiral Matrix', category: 'Arrays', difficulty: 'Medium', tags: ['Matrix'] },
  55: { title: 'Jump Game', category: 'Dynamic Programming', difficulty: 'Medium', tags: ['Greedy'] },
  56: { title: 'Merge Intervals', category: 'Arrays', difficulty: 'Medium', tags: ['Sorting'] },
  57: { title: 'Insert Interval', category: 'Arrays', difficulty: 'Medium', tags: ['Intervals'] },
  62: { title: 'Unique Paths', category: 'Dynamic Programming', difficulty: 'Medium', tags: ['DP', 'Math'] },
  64: { title: 'Minimum Path Sum', category: 'Dynamic Programming', difficulty: 'Medium', tags: ['DP'] },
  70: { title: 'Climbing Stairs', category: 'Dynamic Programming', difficulty: 'Easy', tags: ['DP'] },
  72: { title: 'Edit Distance', category: 'Dynamic Programming', difficulty: 'Hard', tags: ['DP', 'String'] },
  74: { title: 'Search a 2D Matrix', category: 'Binary Search', difficulty: 'Medium', tags: ['Binary Search'] },
  75: { title: 'Sort Colors', category: 'Arrays', difficulty: 'Medium', tags: ['Two Pointers'] },
  76: { title: 'Minimum Window Substring', category: 'Strings', difficulty: 'Hard', tags: ['Sliding Window'] },
  78: { title: 'Subsets', category: 'Algorithms', difficulty: 'Medium', tags: ['Backtracking'] },
  79: { title: 'Word Search', category: 'Graphs', difficulty: 'Medium', tags: ['DFS', 'Matrix'] },
  84: { title: 'Largest Rectangle in Histogram', category: 'Stack', difficulty: 'Hard', tags: ['Monotonic Stack'] },
  88: { title: 'Merge Sorted Array', category: 'Arrays', difficulty: 'Easy', tags: ['Two Pointers'] },
  91: { title: 'Decode Ways', category: 'Dynamic Programming', difficulty: 'Medium', tags: ['DP'] },
  94: { title: 'Binary Tree Inorder Traversal', category: 'Trees', difficulty: 'Easy', tags: ['Tree', 'DFS'] },
  98: { title: 'Validate Binary Search Tree', category: 'Trees', difficulty: 'Medium', tags: ['Tree', 'BST'] },
  102: { title: 'Binary Tree Level Order Traversal', category: 'Trees', difficulty: 'Medium', tags: ['Tree', 'BFS'] },
  104: { title: 'Maximum Depth of Binary Tree', category: 'Trees', difficulty: 'Easy', tags: ['Tree'] },
  105: { title: 'Construct Binary Tree from Preorder & Inorder', category: 'Trees', difficulty: 'Medium', tags: ['Tree'] },
  121: { title: 'Best Time to Buy and Sell Stock', category: 'Arrays', difficulty: 'Easy', tags: ['Array', 'DP'] },
  124: { title: 'Binary Tree Maximum Path Sum', category: 'Trees', difficulty: 'Hard', tags: ['Tree', 'DFS'] },
  128: { title: 'Longest Consecutive Sequence', category: 'Hash Table', difficulty: 'Medium', tags: ['Hash Table'] },
  133: { title: 'Clone Graph', category: 'Graphs', difficulty: 'Medium', tags: ['Graph', 'BFS'] },
  136: { title: 'Single Number', category: 'Math', difficulty: 'Easy', tags: ['Bit Manipulation'] },
  139: { title: 'Word Break', category: 'Dynamic Programming', difficulty: 'Medium', tags: ['DP'] },
  141: { title: 'Linked List Cycle', category: 'Algorithms', difficulty: 'Easy', tags: ['Linked List', 'Two Pointers'] },
  146: { title: 'LRU Cache', category: 'Hash Table', difficulty: 'Medium', tags: ['Hash Table', 'Design'] },
  152: { title: 'Maximum Product Subarray', category: 'Dynamic Programming', difficulty: 'Medium', tags: ['DP'] },
  155: { title: 'Min Stack', category: 'Stack', difficulty: 'Medium', tags: ['Stack'] },
  198: { title: 'House Robber', category: 'Dynamic Programming', difficulty: 'Medium', tags: ['DP'] },
  200: { title: 'Number of Islands', category: 'Graphs', difficulty: 'Medium', tags: ['Graph', 'BFS', 'DFS'] },
  206: { title: 'Reverse Linked List', category: 'Algorithms', difficulty: 'Easy', tags: ['Linked List'] },
  207: { title: 'Course Schedule', category: 'Graphs', difficulty: 'Medium', tags: ['Graph', 'Topological Sort'] },
  208: { title: 'Implement Trie (Prefix Tree)', category: 'Trees', difficulty: 'Medium', tags: ['Trie'] },
  215: { title: 'Kth Largest Element in an Array', category: 'Heap', difficulty: 'Medium', tags: ['Heap', 'Quickselect'] },
  230: { title: 'Kth Smallest Element in a BST', category: 'Trees', difficulty: 'Medium', tags: ['Tree', 'BST'] },
  238: { title: 'Product of Array Except Self', category: 'Arrays', difficulty: 'Medium', tags: ['Array'] },
  239: { title: 'Sliding Window Maximum', category: 'Heap', difficulty: 'Hard', tags: ['Monotonic Queue'] },
  242: { title: 'Valid Anagram', category: 'Strings', difficulty: 'Easy', tags: ['String', 'Hash Table'] },
  297: { title: 'Serialize & Deserialize Binary Tree', category: 'Trees', difficulty: 'Hard', tags: ['Tree', 'Design'] },
  300: { title: 'Longest Increasing Subsequence', category: 'Dynamic Programming', difficulty: 'Medium', tags: ['DP', 'Binary Search'] },
  322: { title: 'Coin Change', category: 'Dynamic Programming', difficulty: 'Medium', tags: ['DP'] },
  347: { title: 'Top K Frequent Elements', category: 'Heap', difficulty: 'Medium', tags: ['Heap', 'Hash Table'] },
  416: { title: 'Partition Equal Subset Sum', category: 'Dynamic Programming', difficulty: 'Medium', tags: ['DP'] },
  560: { title: 'Subarray Sum Equals K', category: 'Hash Table', difficulty: 'Medium', tags: ['Prefix Sum'] },
  739: { title: 'Daily Temperatures', category: 'Stack', difficulty: 'Medium', tags: ['Monotonic Stack'] }
};

const CATEGORY_LIST: Category[] = [
  'Arrays', 'Strings', 'Trees', 'Graphs', 'Dynamic Programming',
  'SQL', 'Algorithms', 'Binary Search', 'Stack', 'Hash Table', 'Math', 'Heap'
];

const TOPIC_TEMPLATES = [
  'Subarray Optimization', 'Tree Traversal Matrix', 'Graph Connectivity',
  'Bitwise Shift Query', 'Sliding Window Bounds', 'Monotonic Stack Evaluation',
  'Dynamic State Transition', 'Binary Search Range', 'Interval Scheduling',
  'Prefix Sum Lookup', 'Kth Element Partition', 'Cycle Detection Graph'
];

export const generateLeetCode2000Problems = (): Problem[] => {
  const problems: Problem[] = [];

  for (let num = 1; num <= 2000; num++) {
    const famous = FAMOUS_LEETCODE_PROBLEMS[num];
    const category = famous ? famous.category : CATEGORY_LIST[(num * 7) % CATEGORY_LIST.length];
    const difficulty: Difficulty = famous ? famous.difficulty : num % 4 === 0 ? 'Hard' : num % 3 === 0 ? 'Medium' : 'Easy';
    const topic = TOPIC_TEMPLATES[num % TOPIC_TEMPLATES.length];

    const title = famous ? famous.title : `Problem #${num}: ${topic} ${num % 2 === 0 ? 'II' : 'I'}`;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const tags = famous ? famous.tags : [category, 'Algorithm', 'LeetCode'];

    const acceptanceRate = Number((35 + (num % 50) + Math.sin(num) * 10).toFixed(1));
    const totalSubmissions = 50000 + (num * 340) % 1500000;

    problems.push({
      id: num.toString(),
      number: num,
      title,
      slug,
      difficulty,
      category,
      tags,
      acceptanceRate,
      totalSubmissions,
      solvedStatus: 'todo',
      description: `Given input data structure for **LeetCode Problem #${num} (${title})**, write an efficient solution in O(N) or O(N log N) time complexity.

Return the target optimal result according to problem constraints.`,
      examples: [
        {
          input: `Input: data = [${(num * 3) % 20}, ${(num * 7) % 20}, ${(num * 11) % 20}]`,
          output: `Output: ${(num * 13) % 42}`,
          explanation: `Example execution for LeetCode Problem #${num}.`
        }
      ],
      constraints: [
        '1 <= N <= 10^5',
        '-10^9 <= Value <= 10^9',
        'Time limit: 2.0 seconds'
      ],
      hints: [
        `Consider standard ${category} techniques.`,
        'Optimize space using iterative or sliding window methods.'
      ],
      starterCode: {
        cpp: `class Solution {\npublic:\n    int solve(vector<int>& nums) {\n        // Solution for LeetCode #${num}\n        return 0;\n    }\n};`,
        python: `class Solution:\n    def solve(self, nums: List[int]) -> int:\n        # Solution for LeetCode #${num}\n        return 0`,
        javascript: `function solve(nums) {\n    // Solution for LeetCode #${num}\n    return 0;\n}`,
        java: `class Solution {\n    public int solve(int[] nums) {\n        return 0;\n    }\n}`,
        go: `func solve(nums []int) int {\n    return 0\n}`,
        rust: `impl Solution {\n    pub fn solve(nums: Vec<i32>) -> i32 {\n        0\n    }\n}`
      },
      testCases: [
        { id: 1, input: `[${num}, ${num + 1}]`, expectedOutput: `${num * 2}`, isHidden: false },
        { id: 2, input: `[${num * 2}]`, expectedOutput: `${num}`, isHidden: true }
      ]
    });
  }

  return problems;
};
