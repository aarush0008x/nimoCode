import type { Problem } from '../types';

export const MOCK_PROBLEMS: Problem[] = [
  {
    id: '1',
    number: 1,
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    category: 'Arrays',
    tags: ['Array', 'Hash Table'],
    acceptanceRate: 49.2,
    totalSubmissions: 1420580,
    solvedStatus: 'solved',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have ***exactly one solution***, and you may not use the *same* element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    hints: [
      'A really brute force way would be to search for all possible pairs, but that takes O(N^2) time. Can we do better?',
      'Can we use extra space? Hash tables can look up values in O(1) time.',
      'As we iterate through the array, check if (target - current_element) exists in the hash map.'
    ],
    starterCode: {
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> mp;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (mp.find(complement) != mp.end()) {
                return {mp[complement], i};
            }
            mp[nums[i]] = i;
        }
        return {};
    }
};`,
      python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}
        for i, num in enumerate(nums):
            diff = target - num
            if diff in seen:
                return [seen[diff], i]
            seen[num] = i
        return []`,
      javascript: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (map.has(diff)) {
            return [map.get(diff), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int diff = target - nums[i];
            if (map.containsKey(diff)) {
                return new int[] { map.get(diff), i };
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}`,
      go: `func twoSum(nums []int, target int) []int {
    m := make(map[int]int)
    for i, num := range nums {
        if idx, ok := m[target-num]; ok {
            return []int{idx, i}
        }
        m[num] = i
    }
    return nil
}`,
      rust: `impl Solution {
    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
        use std::collections::HashMap;
        let mut map = HashMap::new();
        for (i, &num) in nums.iter().enumerate() {
            if let Some(&idx) = map.get(&(target - num)) {
                return vec![idx as i32, i as i32];
            }
            map.insert(num, i);
        }
        vec![]
    }
}`
    },
    testCases: [
      { id: 1, input: '[2,7,11,15]\n9', expectedOutput: '[0,1]', isHidden: false },
      { id: 2, input: '[3,2,4]\n6', expectedOutput: '[1,2]', isHidden: false },
      { id: 3, input: '[3,3]\n6', expectedOutput: '[0,1]', isHidden: true },
      { id: 4, input: '[1,5,8,3]\n11', expectedOutput: '[2,3]', isHidden: true }
    ]
  },
  {
    id: '2',
    number: 2,
    title: 'Add Two Numbers',
    slug: 'add-two-numbers',
    difficulty: 'Medium',
    category: 'Algorithms',
    tags: ['Linked List', 'Math', 'Recursion'],
    acceptanceRate: 41.5,
    totalSubmissions: 890420,
    solvedStatus: 'todo',
    description: `You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.`,
    examples: [
      {
        input: 'l1 = [2,4,3], l2 = [5,6,4]',
        output: '[7,0,8]',
        explanation: '342 + 465 = 807.'
      },
      {
        input: 'l1 = [0], l2 = [0]',
        output: '[0]'
      }
    ],
    constraints: [
      'The number of nodes in each linked list is in the range [1, 100].',
      '0 <= Node.val <= 9',
      'It is guaranteed that the list represents a number that does not have leading zeros.'
    ],
    hints: [
      'Keep track of the carry using an integer variable and simulate digits-by-digits addition starting from the head of list.'
    ],
    starterCode: {
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        ListNode dummy(0);
        ListNode* tail = &dummy;
        int carry = 0;
        while (l1 || l2 || carry) {
            int sum = carry + (l1 ? l1->val : 0) + (l2 ? l2->val : 0);
            carry = sum / 10;
            tail->next = new ListNode(sum % 10);
            tail = tail->next;
            if (l1) l1 = l1->next;
            if (l2) l2 = l2->next;
        }
        return dummy.next;
    }
};`,
      python: `class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode(0)
        curr = dummy
        carry = 0
        while l1 or l2 or carry:
            val1 = l1.val if l1 else 0
            val2 = l2.val if l2 else 0
            total = val1 + val2 + carry
            carry = total // 10
            curr.next = ListNode(total % 10)
            curr = curr.next
            if l1: l1 = l1.next
            if l2: l2 = l2.next
        return dummy.next`,
      javascript: `function addTwoNumbers(l1, l2) {
    let dummy = new ListNode(0);
    let curr = dummy;
    let carry = 0;
    while (l1 || l2 || carry) {
        let sum = carry + (l1 ? l1.val : 0) + (l2 ? l2.val : 0);
        carry = Math.floor(sum / 10);
        curr.next = new ListNode(sum % 10);
        curr = curr.next;
        if (l1) l1 = l1.next;
        if (l2) l2 = l2.next;
    }
    return dummy.next;
}`,
      java: `class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        int carry = 0;
        while (l1 != null || l2 != null || carry != 0) {
            int sum = carry + (l1 != null ? l1.val : 0) + (l2 != null ? l2.val : 0);
            carry = sum / 10;
            curr.next = new ListNode(sum % 10);
            curr = curr.next;
            if (l1 != null) l1 = l1.next;
            if (l2 != null) l2 = l2.next;
        }
        return dummy.next;
    }
}`,
      go: `func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {
    dummy := &ListNode{}
    curr := dummy
    carry := 0
    for l1 != nil || l2 != nil || carry != 0 {
        sum := carry
        if l1 != nil { sum += l1.Val; l1 = l1.Next }
        if l2 != nil { sum += l2.Val; l2 = l2.Next }
        carry = sum / 10
        curr.Next = &ListNode{Val: sum % 10}
        curr = curr.Next
    }
    return dummy.Next
}`,
      rust: `// Rust ListNode solution
impl Solution {
    pub fn add_two_numbers(l1: Option<Box<ListNode>>, l2: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
        // Implementation
        None
    }
}`
    },
    testCases: [
      { id: 1, input: '[2,4,3]\n[5,6,4]', expectedOutput: '[7,0,8]', isHidden: false },
      { id: 2, input: '[0]\n[0]', expectedOutput: '[0]', isHidden: false }
    ]
  },
  {
    id: '3',
    number: 3,
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    category: 'Strings',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    acceptanceRate: 34.4,
    totalSubmissions: 1250910,
    solvedStatus: 'todo',
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.'
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3.'
      }
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    hints: [
      'Use a Sliding Window with a hash map to keep track of character indices.'
    ],
    starterCode: {
      cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        vector<int> dict(256, -1);
        int maxLen = 0, start = -1;
        for (int i = 0; i < s.length(); i++) {
            if (dict[s[i]] > start)
                start = dict[s[i]];
            dict[s[i]] = i;
            maxLen = max(maxLen, i - start);
        }
        return maxLen;
    }
};`,
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        charMap = {}
        left = 0
        max_len = 0
        for right in range(len(s)):
            if s[right] in charMap:
                left = max(left, charMap[s[right]] + 1)
            charMap[s[right]] = right
            max_len = max(max_len, right - left + 1)
        return max_len`,
      javascript: `function lengthOfLongestSubstring(s) {
    let map = new Map();
    let left = 0, maxLen = 0;
    for (let right = 0; right < s.length; right++) {
        if (map.has(s[right])) {
            left = Math.max(left, map.get(s[right]) + 1);
        }
        map.set(s[right], right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> map = new HashMap<>();
        int maxLen = 0, left = 0;
        for (int right = 0; right < s.length(); right++) {
            if (map.containsKey(s.charAt(right))) {
                left = Math.max(left, map.get(s.charAt(right)) + 1);
            }
            map.put(s.charAt(right), right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}`,
      go: `func lengthOfLongestSubstring(s string) int {
    m := make(map[byte]int)
    maxLen, left := 0, 0
    for right := 0; right < len(s); right++ {
        if idx, ok := m[s[right]]; ok && idx >= left {
            left = idx + 1
        }
        m[s[right]] = right
        if right-left+1 > maxLen {
            maxLen = right - left + 1
        }
    }
    return maxLen
}`,
      rust: `impl Solution {
    pub fn length_of_longest_substring(s: String) -> i32 {
        use std::collections::HashMap;
        let mut map = HashMap::new();
        let mut max_len = 0;
        let mut left = 0;
        for (right, ch) in s.chars().enumerate() {
            if let Some(&prev) = map.get(&ch) {
                if prev >= left {
                    left = prev + 1;
                }
            }
            map.insert(ch, right);
            max_len = max_len.max(right - left + 1);
        }
        max_len as i32
    }
}`
    },
    testCases: [
      { id: 1, input: '"abcabcbb"', expectedOutput: '3', isHidden: false },
      { id: 2, input: '"bbbbb"', expectedOutput: '1', isHidden: false },
      { id: 3, input: '"pwwkew"', expectedOutput: '3', isHidden: true }
    ]
  },
  {
    id: '4',
    number: 4,
    title: 'Median of Two Sorted Arrays',
    slug: 'median-of-two-sorted-arrays',
    difficulty: 'Hard',
    category: 'Binary Search',
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    acceptanceRate: 38.8,
    totalSubmissions: 642010,
    solvedStatus: 'todo',
    description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return **the median** of the two sorted arrays.

The overall run time complexity should be **O(log (m+n))**.`,
    examples: [
      {
        input: 'nums1 = [1,3], nums2 = [2]',
        output: '2.00000',
        explanation: 'merged array = [1,2,3] and median is 2.'
      },
      {
        input: 'nums1 = [1,2], nums2 = [3,4]',
        output: '2.50000',
        explanation: 'merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.'
      }
    ],
    constraints: [
      'nums1.length == m',
      'nums2.length == n',
      '0 <= m <= 1000',
      '0 <= n <= 1000',
      '1 <= m + n <= 2000'
    ],
    hints: [
      'Binary search on the partition of the smaller array.'
    ],
    starterCode: {
      cpp: `class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        if (nums1.size() > nums2.size()) return findMedianSortedArrays(nums2, nums1);
        int m = nums1.size(), n = nums2.size();
        int low = 0, high = m;
        while (low <= high) {
            int i = (low + high) / 2;
            int j = (m + n + 1) / 2 - i;
            int maxLeft1 = (i == 0) ? INT_MIN : nums1[i-1];
            int minRight1 = (i == m) ? INT_MAX : nums1[i];
            int maxLeft2 = (j == 0) ? INT_MIN : nums2[j-1];
            int minRight2 = (j == n) ? INT_MAX : nums2[j];
            if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
                if ((m + n) % 2 == 0)
                    return (max(maxLeft1, maxLeft2) + min(minRight1, minRight2)) / 2.0;
                else
                    return max(maxLeft1, maxLeft2);
            } else if (maxLeft1 > minRight2) high = i - 1;
            else low = i + 1;
        }
        return 0.0;
    }
};`,
      python: `class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        A, B = nums1, nums2
        if len(A) > len(B): A, B = B, A
        total = len(A) + len(B)
        half = total // 2
        l, r = 0, len(A) - 1
        while True:
            i = (l + r) // 2
            j = half - i - 2
            Aleft = A[i] if i >= 0 else float("-inf")
            Aright = A[i + 1] if (i + 1) < len(A) else float("inf")
            Bleft = B[j] if j >= 0 else float("-inf")
            Bright = B[j + 1] if (j + 1) < len(B) else float("inf")
            if Aleft <= Bright and Bleft <= Aright:
                if total % 2: return min(Aright, Bright)
                return (max(Aleft, Bleft) + min(Aright, Bright)) / 2
            elif Aleft > Bright: r = i - 1
            else: l = i + 1`,
      javascript: `function findMedianSortedArrays(nums1, nums2) {
    if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
    let m = nums1.length, n = nums2.length;
    let low = 0, high = m;
    while (low <= high) {
        let i = Math.floor((low + high) / 2);
        let j = Math.floor((m + n + 1) / 2) - i;
        let maxLeft1 = i === 0 ? -Infinity : nums1[i - 1];
        let minRight1 = i === m ? Infinity : nums1[i];
        let maxLeft2 = j === 0 ? -Infinity : nums2[j - 1];
        let minRight2 = j === n ? Infinity : nums2[j];
        if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
            if ((m + n) % 2 === 0) return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2;
            else return Math.max(maxLeft1, maxLeft2);
        } else if (maxLeft1 > minRight2) high = i - 1;
        else low = i + 1;
    }
    return 0;
}`,
      java: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // Implementation
        return 0.0;
    }
}`,
      go: `func findMedianSortedArrays(nums1 []int, nums2 []int) float64 {
    return 0.0
}`,
      rust: `impl Solution {
    pub fn find_median_sorted_arrays(nums1: Vec<i32>, nums2: Vec<i32>) -> f64 {
        0.0
    }
}`
    },
    testCases: [
      { id: 1, input: '[1,3]\n[2]', expectedOutput: '2.00000', isHidden: false },
      { id: 2, input: '[1,2]\n[3,4]', expectedOutput: '2.50000', isHidden: false }
    ]
  },
  {
    id: '5',
    number: 5,
    title: 'Longest Palindromic Substring',
    slug: 'longest-palindromic-substring',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    tags: ['String', 'Dynamic Programming'],
    acceptanceRate: 33.1,
    totalSubmissions: 980120,
    solvedStatus: 'todo',
    description: `Given a string \`s\`, return the **longest palindromic substring** in \`s\`.`,
    examples: [
      {
        input: 's = "babad"',
        output: '"bab"',
        explanation: '"aba" is also a valid answer.'
      },
      {
        input: 's = "cbbd"',
        output: '"bb"'
      }
    ],
    constraints: [
      '1 <= s.length <= 1000',
      's consists of only digits and English letters.'
    ],
    hints: [
      'Expand around center strategy takes O(N^2) time and O(1) space.'
    ],
    starterCode: {
      cpp: `class Solution {
public:
    string longestPalindrome(string s) {
        int start = 0, maxLen = 0;
        auto expand = [&](int l, int r) {
            while (l >= 0 && r < s.length() && s[l] == s[r]) {
                l--; r++;
            }
            if (r - l - 1 > maxLen) {
                start = l + 1;
                maxLen = r - l - 1;
            }
        };
        for (int i = 0; i < s.length(); i++) {
            expand(i, i);
            expand(i, i + 1);
        }
        return s.substr(start, maxLen);
    }
};`,
      python: `class Solution:
    def longestPalindrome(self, s: str) -> str:
        res = ""
        resLen = 0
        for i in range(len(s)):
            # Odd
            l, r = i, i
            while l >= 0 and r < len(s) and s[l] == s[r]:
                if (r - l + 1) > resLen:
                    res = s[l:r+1]
                    resLen = r - l + 1
                l -= 1; r += 1
            # Even
            l, r = i, i + 1
            while l >= 0 and r < len(s) and s[l] == s[r]:
                if (r - l + 1) > resLen:
                    res = s[l:r+1]
                    resLen = r - l + 1
                l -= 1; r += 1
        return res`,
      javascript: `function longestPalindrome(s) {
    let start = 0, maxLen = 0;
    function expand(l, r) {
        while (l >= 0 && r < s.length && s[l] === s[r]) {
            l--; r++;
        }
        if (r - l - 1 > maxLen) {
            start = l + 1;
            maxLen = r - l - 1;
        }
    }
    for (let i = 0; i < s.length; i++) {
        expand(i, i);
        expand(i, i + 1);
    }
    return s.substring(start, start + maxLen);
}`,
      java: `class Solution {
    public String longestPalindrome(String s) {
        return "";
    }
}`,
      go: `func longestPalindrome(s string) string {
    return ""
}`,
      rust: `impl Solution {
    pub fn longest_palindrome(s: String) -> String {
        String::new()
    }
}`
    },
    testCases: [
      { id: 1, input: '"babad"', expectedOutput: '"bab"', isHidden: false },
      { id: 2, input: '"cbbd"', expectedOutput: '"bb"', isHidden: false }
    ]
  },
  {
    id: '15',
    number: 15,
    title: '3Sum',
    slug: '3sum',
    difficulty: 'Medium',
    category: 'Arrays',
    tags: ['Array', 'Two Pointers', 'Sorting'],
    acceptanceRate: 33.7,
    totalSubmissions: 810450,
    solvedStatus: 'todo',
    description: `Given an integer array nums, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.`,
    examples: [
      {
        input: 'nums = [-1,0,1,2,-1,-4]',
        output: '[[-1,-1,2],[-1,0,1]]',
        explanation: 'Distinct triplets summing to 0.'
      },
      {
        input: 'nums = [0,1,1]',
        output: '[]'
      }
    ],
    constraints: [
      '3 <= nums.length <= 3000',
      '-10^5 <= nums[i] <= 10^5'
    ],
    hints: [
      'Sort the array first, then use a two-pointer technique for each element.'
    ],
    starterCode: {
      cpp: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> res;
        for (int i = 0; i < nums.size(); i++) {
            if (i > 0 && nums[i] == nums[i-1]) continue;
            int l = i + 1, r = nums.size() - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum == 0) {
                    res.push_back({nums[i], nums[l], nums[r]});
                    while (l < r && nums[l] == nums[l+1]) l++;
                    while (l < r && nums[r] == nums[r-1]) r--;
                    l++; r--;
                } else if (sum < 0) l++;
                else r--;
            }
        }
        return res;
    }
};`,
      python: `class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        res = []
        for i in range(len(nums)):
            if i > 0 and nums[i] == nums[i-1]: continue
            l, r = i + 1, len(nums) - 1
            while l < r:
                s = nums[i] + nums[l] + nums[r]
                if s == 0:
                    res.append([nums[i], nums[l], nums[r]])
                    while l < r and nums[l] == nums[l+1]: l += 1
                    while l < r and nums[r] == nums[r-1]: r -= 1
                    l += 1; r -= 1
                elif s < 0: l += 1
                else: r -= 1
        return res`,
      javascript: `function threeSum(nums) {
    nums.sort((a, b) => a - b);
    let res = [];
    for (let i = 0; i < nums.length; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        let l = i + 1, r = nums.length - 1;
        while (l < r) {
            let sum = nums[i] + nums[l] + nums[r];
            if (sum === 0) {
                res.push([nums[i], nums[l], nums[r]]);
                while (l < r && nums[l] === nums[l + 1]) l++;
                while (l < r && nums[r] === nums[r - 1]) r--;
                l++; r--;
            } else if (sum < 0) l++;
            else r--;
        }
    }
    return res;
}`,
      java: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        return new ArrayList<>();
    }
}`,
      go: `func threeSum(nums []int) [][]int {
    return nil
}`,
      rust: `impl Solution {
    pub fn three_sum(nums: Vec<i32>) -> Vec<Vec<i32>> {
        vec![]
    }
}`
    },
    testCases: [
      { id: 1, input: '[-1,0,1,2,-1,-4]', expectedOutput: '[[-1,-1,2],[-1,0,1]]', isHidden: false },
      { id: 2, input: '[0,1,1]', expectedOutput: '[]', isHidden: false }
    ]
  },
  {
    id: '20',
    number: 20,
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    category: 'Stack',
    tags: ['String', 'Stack'],
    acceptanceRate: 40.3,
    totalSubmissions: 1540100,
    solvedStatus: 'todo',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()"',
        output: 'true'
      },
      {
        input: 's = "()[]{}"',
        output: 'true'
      },
      {
        input: 's = "(]"',
        output: 'false'
      }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.'
    ],
    hints: [
      'Use a stack to push open brackets and pop when encountering matching closing brackets.'
    ],
    starterCode: {
      cpp: `class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for (char c : s) {
            if (c == '(' || c == '{' || c == '[') st.push(c);
            else {
                if (st.empty()) return false;
                if (c == ')' && st.top() != '(') return false;
                if (c == '}' && st.top() != '{') return false;
                if (c == ']' && st.top() != '[') return false;
                st.pop();
            }
        }
        return st.empty();
    }
};`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {')': '(', '}': '{', ']': '['}
        for char in s:
            if char in mapping:
                top_element = stack.pop() if stack else '#'
                if mapping[char] != top_element:
                    return False
            else:
                stack.append(char)
        return not stack`,
      javascript: `function isValid(s) {
    const stack = [];
    const map = { ')': '(', '}': '{', ']': '[' };
    for (let char of s) {
        if (char in map) {
            if (stack.pop() !== map[char]) return false;
        } else {
            stack.push(char);
        }
    }
    return stack.length === 0;
}`,
      java: `class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`,
      go: `func isValid(s string) bool {
    stack := []rune{}
    m := map[rune]rune{')': '(', '}': '{', ']': '['}
    for _, char := range s {
        if match, ok := m[char]; ok {
            if len(stack) == 0 || stack[len(stack)-1] != match {
                return false
            }
            stack = stack[:len(stack)-1]
        } else {
            stack = append(stack, char)
        }
    }
    return len(stack) == 0
}`,
      rust: `impl Solution {
    pub fn is_valid(s: String) -> bool {
        let mut stack = Vec::new();
        for c in s.chars() {
            match c {
                '(' => stack.push(')'),
                '{' => stack.push('}'),
                '[' => stack.push(']'),
                _ => if stack.pop() != Some(c) { return false; },
            }
        }
        stack.is_empty()
    }
}`
    },
    testCases: [
      { id: 1, input: '"()"', expectedOutput: 'true', isHidden: false },
      { id: 2, input: '"()[]{}"', expectedOutput: 'true', isHidden: false },
      { id: 3, input: '"(]"', expectedOutput: 'false', isHidden: false }
    ]
  },
  {
    id: '42',
    number: 42,
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    category: 'Arrays',
    tags: ['Array', 'Two Pointers', 'Stack', 'Dynamic Programming'],
    acceptanceRate: 60.1,
    totalSubmissions: 720310,
    solvedStatus: 'todo',
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    examples: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are trapped.'
      },
      {
        input: 'height = [4,2,0,3,2,5]',
        output: '9'
      }
    ],
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5'
    ],
    hints: [
      'Use Two Pointers maintaining leftMax and rightMax to compute trapped water in O(N) time and O(1) space.'
    ],
    starterCode: {
      cpp: `class Solution {
public:
    int trap(vector<int>& height) {
        int l = 0, r = height.size() - 1;
        int leftMax = 0, rightMax = 0, res = 0;
        while (l < r) {
            if (height[l] < height[r]) {
                if (height[l] >= leftMax) leftMax = height[l];
                else res += leftMax - height[l];
                l++;
            } else {
                if (height[r] >= rightMax) rightMax = height[r];
                else res += rightMax - height[r];
                r--;
            }
        }
        return res;
    }
};`,
      python: `class Solution:
    def trap(self, height: List[int]) -> int:
        if not height: return 0
        l, r = 0, len(height) - 1
        leftMax, rightMax = height[l], height[r]
        res = 0
        while l < r:
            if leftMax < rightMax:
                l += 1
                leftMax = max(leftMax, height[l])
                res += leftMax - height[l]
            else:
                r -= 1
                rightMax = max(rightMax, height[r])
                res += rightMax - height[r]
        return res`,
      javascript: `function trap(height) {
    let l = 0, r = height.length - 1;
    let leftMax = 0, rightMax = 0, res = 0;
    while (l < r) {
        if (height[l] < height[r]) {
            if (height[l] >= leftMax) leftMax = height[l];
            else res += leftMax - height[l];
            l++;
        } else {
            if (height[r] >= rightMax) rightMax = height[r];
            else res += rightMax - height[r];
            r--;
        }
    }
    return res;
}`,
      java: `class Solution {
    public int trap(int[] height) {
        return 0;
    }
}`,
      go: `func trap(height []int) int {
    return 0
}`,
      rust: `impl Solution {
    pub fn trap(height: Vec<i32>) -> i32 {
        0
    }
}`
    },
    testCases: [
      { id: 1, input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6', isHidden: false },
      { id: 2, input: '[4,2,0,3,2,5]', expectedOutput: '9', isHidden: false }
    ]
  },
  {
    id: '53',
    number: 53,
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    tags: ['Array', 'Divide and Conquer', 'Dynamic Programming'],
    acceptanceRate: 50.4,
    totalSubmissions: 1680100,
    solvedStatus: 'todo',
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return *its sum*.`,
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum 6.'
      },
      {
        input: 'nums = [1]',
        output: '1'
      },
      {
        input: 'nums = [5,4,-1,7,8]',
        output: '23'
      }
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    hints: [
      'Kadane\'s algorithm keeps track of current max sum ending at index i.'
    ],
    starterCode: {
      cpp: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int maxSum = nums[0], currSum = nums[0];
        for (int i = 1; i < nums.size(); i++) {
            currSum = max(nums[i], currSum + nums[i]);
            maxSum = max(maxSum, currSum);
        }
        return maxSum;
    }
};`,
      python: `class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        max_sum = curr_sum = nums[0]
        for num in nums[1:]:
            curr_sum = max(num, curr_sum + num)
            max_sum = max(max_sum, curr_sum)
        return max_sum`,
      javascript: `function maxSubArray(nums) {
    let maxSum = nums[0], currSum = nums[0];
    for (let i = 1; i < nums.length; i++) {
        currSum = Math.max(nums[i], currSum + nums[i]);
        maxSum = Math.max(maxSum, currSum);
    }
    return maxSum;
}`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        int max = nums[0], curr = nums[0];
        for (int i = 1; i < nums.length; i++) {
            curr = Math.max(nums[i], curr + nums[i]);
            max = Math.max(max, curr);
        }
        return max;
    }
}`,
      go: `func maxSubArray(nums []int) int {
    maxSum, currSum := nums[0], nums[0]
    for i := 1; i < len(nums); i++ {
        if currSum < 0 {
            currSum = nums[i]
        } else {
            currSum += nums[i]
        }
        if currSum > maxSum {
            maxSum = currSum
        }
    }
    return maxSum
}`,
      rust: `impl Solution {
    pub fn max_sub_array(nums: Vec<i32>) -> i32 {
        let mut max_sum = nums[0];
        let mut curr_sum = nums[0];
        for &num in nums.iter().skip(1) {
            curr_sum = num.max(curr_sum + num);
            max_sum = max_sum.max(curr_sum);
        }
        max_sum
    }
}`
    },
    testCases: [
      { id: 1, input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6', isHidden: false },
      { id: 2, input: '[1]', expectedOutput: '1', isHidden: false },
      { id: 3, input: '[5,4,-1,7,8]', expectedOutput: '23', isHidden: false }
    ]
  },
  {
    id: '70',
    number: 70,
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'Easy',
    category: 'Dynamic Programming',
    tags: ['Math', 'Dynamic Programming', 'Memoization'],
    acceptanceRate: 52.3,
    totalSubmissions: 2100400,
    solvedStatus: 'todo',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    examples: [
      {
        input: 'n = 2',
        output: '2',
        explanation: 'There are two ways to climb to the top: 1 step + 1 step, or 2 steps.'
      },
      {
        input: 'n = 3',
        output: '3',
        explanation: 'There are three ways: (1+1+1), (1+2), (2+1).'
      }
    ],
    constraints: [
      '1 <= n <= 45'
    ],
    hints: [
      'To reach n-th step, what were the previous steps you could come from? (n-1) or (n-2).'
    ],
    starterCode: {
      cpp: `class Solution {
public:
    int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int temp = a + b;
            a = b;
            b = temp;
        }
        return b;
    }
};`,
      python: `class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2: return n
        a, b = 1, 2
        for _ in range(3, n + 1):
            a, b = b, a + b
        return b`,
      javascript: `function climbStairs(n) {
    if (n <= 2) return n;
    let a = 1, b = 2;
    for (let i = 3; i <= n; i++) {
        let temp = a + b;
        a = b;
        b = temp;
    }
    return b;
}`,
      java: `class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int temp = a + b;
            a = b;
            b = temp;
        }
        return b;
    }
}`,
      go: `func climbStairs(n int) int {
    if n <= 2 { return n }
    a, b := 1, 2
    for i := 3; i <= n; i++ {
        a, b = b, a+b
    }
    return b
}`,
      rust: `impl Solution {
    pub fn climb_stairs(n: i32) -> i32 {
        if n <= 2 { return n; }
        let (mut a, mut b) = (1, 2);
        for _ in 3..=n {
            let temp = a + b;
            a = b;
            b = temp;
        }
        b
    }
}`
    },
    testCases: [
      { id: 1, input: '2', expectedOutput: '2', isHidden: false },
      { id: 2, input: '3', expectedOutput: '3', isHidden: false }
    ]
  },
  {
    id: '121',
    number: 121,
    title: 'Best Time to Buy and Sell Stock',
    slug: 'best-time-to-buy-and-sell-stock',
    difficulty: 'Easy',
    category: 'Arrays',
    tags: ['Array', 'Dynamic Programming'],
    acceptanceRate: 53.6,
    totalSubmissions: 2400100,
    solvedStatus: 'todo',
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i-th\` day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return *the maximum profit you can achieve from this transaction*. If you cannot achieve any profit, return \`0\`.`,
    examples: [
      {
        input: 'prices = [7,1,5,3,6,4]',
        output: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.'
      },
      {
        input: 'prices = [7,6,4,3,1]',
        output: '0',
        explanation: 'In this case, no transactions are done and max profit = 0.'
      }
    ],
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4'
    ],
    hints: [
      'Keep track of minimum price seen so far and maximum profit achievable.'
    ],
    starterCode: {
      cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minPrice = INT_MAX, maxProf = 0;
        for (int p : prices) {
            minPrice = min(minPrice, p);
            maxProf = max(maxProf, p - minPrice);
        }
        return maxProf;
    }
};`,
      python: `class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        min_price = float('inf')
        max_profit = 0
        for price in prices:
            min_price = min(min_price, price)
            max_profit = max(max_profit, price - min_price)
        return max_profit`,
      javascript: `function maxProfit(prices) {
    let minPrice = Infinity, maxProf = 0;
    for (let p of prices) {
        minPrice = Math.min(minPrice, p);
        maxProf = Math.max(maxProf, p - minPrice);
    }
    return maxProf;
}`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE, maxProf = 0;
        for (int p : prices) {
            minPrice = Math.min(minPrice, p);
            maxProf = Math.max(maxProf, p - minPrice);
        }
        return maxProf;
    }
}`,
      go: `func maxProfit(prices []int) int {
    minPrice, maxProf := 1<<31-1, 0
    for _, p := range prices {
        if p < minPrice { minPrice = p }
        if p - minPrice > maxProf { maxProf = p - minPrice }
    }
    return maxProf
}`,
      rust: `impl Solution {
    pub fn max_profit(prices: Vec<i32>) -> i32 {
        let mut min_price = i32::MAX;
        let mut max_prof = 0;
        for p in prices {
            min_price = min_price.min(p);
            max_prof = max_prof.max(p - min_price);
        }
        max_prof
    }
}`
    },
    testCases: [
      { id: 1, input: '[7,1,5,3,6,4]', expectedOutput: '5', isHidden: false },
      { id: 2, input: '[7,6,4,3,1]', expectedOutput: '0', isHidden: false }
    ]
  },
  {
    id: '200',
    number: 200,
    title: 'Number of Islands',
    slug: 'number-of-islands',
    difficulty: 'Medium',
    category: 'Graphs',
    tags: ['Array', 'Breadth-First Search', 'Depth-First Search', 'Union Find', 'Matrix'],
    acceptanceRate: 57.8,
    totalSubmissions: 1420100,
    solvedStatus: 'todo',
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return *the number of islands*.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    examples: [
      {
        input: 'grid = [\n  ["1","1","1","1","0"],\n  ["1","1","0","1","0"],\n  ["1","1","0","0","0"],\n  ["0","0","0","0","0"]\n]',
        output: '1'
      },
      {
        input: 'grid = [\n  ["1","1","0","0","0"],\n  ["1","1","0","0","0"],\n  ["0","0","1","0","0"],\n  ["0","0","0","1","1"]\n]',
        output: '3'
      }
    ],
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 <= m, n <= 300',
      'grid[i][j] is \'0\' or \'1\'.'
    ],
    hints: [
      'Traverse the grid; whenever you hit a \'1\', trigger a DFS/BFS to sink the connected island.'
    ],
    starterCode: {
      cpp: `class Solution {
public:
    void dfs(vector<vector<char>>& grid, int r, int c) {
        if (r < 0 || c < 0 || r >= grid.size() || c >= grid[0].size() || grid[r][c] == '0') return;
        grid[r][c] = '0';
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }
    int numIslands(vector<vector<char>>& grid) {
        int count = 0;
        for (int r = 0; r < grid.size(); r++) {
            for (int c = 0; c < grid[0].size(); c++) {
                if (grid[r][c] == '1') {
                    count++;
                    dfs(grid, r, c);
                }
            }
        }
        return count;
    }
};`,
      python: `class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        if not grid: return 0
        rows, cols = len(grid), len(grid[0])
        count = 0
        def dfs(r, c):
            if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] == '0':
                return
            grid[r][c] = '0'
            dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)
        
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == '1':
                    count += 1
                    dfs(r, c)
        return count`,
      javascript: `function numIslands(grid) {
    if (!grid.length) return 0;
    let count = 0;
    function dfs(r, c) {
        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] === '0') return;
        grid[r][c] = '0';
        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
    }
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
            if (grid[r][c] === '1') {
                count++;
                dfs(r, c);
            }
        }
    }
    return count;
}`,
      java: `class Solution {
    public int numIslands(char[][] grid) {
        return 0;
    }
}`,
      go: `func numIslands(grid [][]byte) int {
    return 0
}`,
      rust: `impl Solution {
    pub fn num_islands(grid: Vec<Vec<char>>) -> i32 {
        0
    }
}`
    },
    testCases: [
      { id: 1, input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', expectedOutput: '1', isHidden: false }
    ]
  },
  {
    id: '206',
    number: 206,
    title: 'Reverse Linked List',
    slug: 'reverse-linked-list',
    difficulty: 'Easy',
    category: 'Algorithms',
    tags: ['Linked List', 'Recursion'],
    acceptanceRate: 74.2,
    totalSubmissions: 3100200,
    solvedStatus: 'todo',
    description: `Given the \`head\` of a singly linked list, reverse the list, and return *the reversed list*.`,
    examples: [
      {
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]'
      },
      {
        input: 'head = [1,2]',
        output: '[2,1]'
      }
    ],
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 <= Node.val <= 5000'
    ],
    hints: [
      'Iterate through the list while swapping prev and next pointers.'
    ],
    starterCode: {
      cpp: `class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* curr = head;
        while (curr) {
            ListNode* nextTemp = curr->next;
            curr->next = prev;
            prev = curr;
            curr = nextTemp;
        }
        return prev;
    }
};`,
      python: `class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        prev = None
        curr = head
        while curr:
            next_node = curr.next
            curr.next = prev
            prev = curr
            curr = next_node
        return prev`,
      javascript: `function reverseList(head) {
    let prev = null, curr = head;
    while (curr) {
        let nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`,
      java: `class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null, curr = head;
        while (curr != null) {
            ListNode nextTemp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextTemp;
        }
        return prev;
    }
}`,
      go: `func reverseList(head *ListNode) *ListNode {
    var prev *ListNode
    curr := head
    for curr != nil {
        next := curr.Next
        curr.Next = prev
        prev = curr
        curr = next
    }
    return prev
}`,
      rust: `impl Solution {
    pub fn reverse_list(head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
        None
    }
}`
    },
    testCases: [
      { id: 1, input: '[1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]', isHidden: false }
    ]
  },
  {
    id: '300',
    number: 300,
    title: 'Longest Increasing Subsequence',
    slug: 'longest-increasing-subsequence',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    tags: ['Array', 'Binary Search', 'Dynamic Programming'],
    acceptanceRate: 53.8,
    totalSubmissions: 1100200,
    solvedStatus: 'todo',
    description: `Given an integer array \`nums\`, return *the length of the longest **strictly increasing subsequence***.`,
    examples: [
      {
        input: 'nums = [10,9,2,5,3,7,101,18]',
        output: '4',
        explanation: 'The longest increasing subsequence is [2, 3, 7, 101], therefore the length is 4.'
      },
      {
        input: 'nums = [0,1,0,3,2,3]',
        output: '4'
      }
    ],
    constraints: [
      '1 <= nums.length <= 2500',
      '-10^4 <= nums[i] <= 10^4'
    ],
    hints: [
      'DP approach takes O(N^2), Patience sorting with Binary Search takes O(N log N).'
    ],
    starterCode: {
      cpp: `class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        vector<int> tails;
        for (int x : nums) {
            auto it = lower_bound(tails.begin(), tails.end(), x);
            if (it == tails.end()) tails.push_back(x);
            else *it = x;
        }
        return tails.size();
    }
};`,
      python: `class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        tails = []
        for x in nums:
            idx = bisect.bisect_left(tails, x)
            if idx == len(tails):
                tails.append(x)
            else:
                tails[idx] = x
        return len(tails)`,
      javascript: `function lengthOfLIS(nums) {
    let tails = [];
    for (let x of nums) {
        let l = 0, r = tails.length;
        while (l < r) {
            let m = Math.floor((l + r) / 2);
            if (tails[m] < x) l = m + 1;
            else r = m;
        }
        if (l === tails.length) tails.push(x);
        else tails[l] = x;
    }
    return tails.length;
}`,
      java: `class Solution {
    public int lengthOfLIS(int[] nums) {
        return 0;
    }
}`,
      go: `func lengthOfLIS(nums []int) int {
    return 0
}`,
      rust: `impl Solution {
    pub fn length_of_lis(nums: Vec<i32>) -> i32 {
        0
    }
}`
    },
    testCases: [
      { id: 1, input: '[10,9,2,5,3,7,101,18]', expectedOutput: '4', isHidden: false }
    ]
  },
  {
    id: '322',
    number: 322,
    title: 'Coin Change',
    slug: 'coin-change',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    tags: ['Array', 'Dynamic Programming', 'Breadth-First Search'],
    acceptanceRate: 42.6,
    totalSubmissions: 950100,
    solvedStatus: 'todo',
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return *the fewest number of coins that you need to make up that amount*. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.`,
    examples: [
      {
        input: 'coins = [1,2,5], amount = 11',
        output: '3',
        explanation: '11 = 5 + 5 + 1'
      },
      {
        input: 'coins = [2], amount = 3',
        output: '-1'
      }
    ],
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4'
    ],
    hints: [
      'Use DP array dp[i] representing minimum coins needed for amount i.'
    ],
    starterCode: {
      cpp: `class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int c : coins) {
                if (i >= c) dp[i] = min(dp[i], dp[i - c] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
};`,
      python: `class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        dp = [amount + 1] * (amount + 1)
        dp[0] = 0
        for i in range(1, amount + 1):
            for c in coins:
                if i - c >= 0:
                    dp[i] = min(dp[i], dp[i - c] + 1)
        return dp[amount] if dp[amount] <= amount else -1`,
      javascript: `function coinChange(coins, amount) {
    let dp = new Array(amount + 1).fill(amount + 1);
    dp[0] = 0;
    for (let i = 1; i <= amount; i++) {
        for (let c of coins) {
            if (i >= c) dp[i] = Math.min(dp[i], dp[i - c] + 1);
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
      java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        return 0;
    }
}`,
      go: `func coinChange(coins []int, amount int) int {
    return 0
}`,
      rust: `impl Solution {
    pub fn coin_change(coins: Vec<i32>, amount: i32) -> i32 {
        0
    }
}`
    },
    testCases: [
      { id: 1, input: '[1,2,5]\n11', expectedOutput: '3', isHidden: false },
      { id: 2, input: '[2]\n3', expectedOutput: '-1', isHidden: false }
    ]
  }
];
