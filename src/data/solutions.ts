import type { SolutionPost } from '../types';

export const MOCK_SOLUTIONS: SolutionPost[] = [
  {
    id: 'sol-1',
    problemId: '1',
    problemTitle: 'Two Sum',
    author: 'alex_code',
    authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
    language: 'cpp',
    title: 'Clean O(N) One-Pass Hash Table Solution with Detailed Diagram',
    runtimeMs: 38,
    memoryMb: 11.4,
    upvotes: 342,
    views: 4820,
    isBestRuntime: true,
    isMostUpvoted: true,
    code: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); ++i) {
            int needed = target - nums[i];
            if (seen.count(needed)) {
                return {seen[needed], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};`,
    explanation: `### Intuition
Instead of nested loops O(N^2), we store each element and its index in a hash map as we iterate.

### Complexity
- **Time Complexity:** O(N) since map lookup is O(1) on average.
- **Space Complexity:** O(N) to store elements in hash map.`,
    createdAt: '2 hours ago'
  },
  {
    id: 'sol-2',
    problemId: '1',
    problemTitle: 'Two Sum',
    author: 'python_wizard',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    language: 'python',
    title: 'Pythonic 4 lines dictionary solution with edge cases handling',
    runtimeMs: 42,
    memoryMb: 14.8,
    upvotes: 219,
    views: 2910,
    isMostElegant: true,
    code: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        lookup = {}
        for idx, num in enumerate(nums):
            if target - num in lookup:
                return [lookup[target - num], idx]
            lookup[num] = idx
        return []`,
    explanation: `Use a python dict \`lookup\` to maintain {value: index}. Linear traversal ensures single-pass lookup.`,
    createdAt: '1 day ago'
  }
];
