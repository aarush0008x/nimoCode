export interface CompanyTrack {
  id: string;
  name: string;
  badgeColor: string;
  logoIcon: string;
  description: string;
  totalProblems: number;
  problemIds: string[];
  focusTopics: string[];
}

export const FAANG_COMPANY_TRACKS: CompanyTrack[] = [
  {
    id: 'google',
    name: 'Google Top 50',
    badgeColor: '#4285F4',
    logoIcon: '🔴',
    description: 'Focuses heavily on Dynamic Programming, Graph Theory (Dijkstra, BFS/DFS), Tries, and Complex Recursion.',
    totalProblems: 50,
    problemIds: ['1', '3', '4', '5', '10', '15', '23', '31', '42', '56', '72', '84', '124', '140', '200', '212', '239', '295', '297', '300', '312', '329', '399', '407', '410', '493', '684', '743', '773', '818', '843', '887', '987', '995', '1091', '1192', '1293', '1499', '1591', '1631', '1786', '1851', '1928', '2000', '2045', '2092', '2115', '2127', '2188', '2246'],
    focusTopics: ['Dynamic Programming', 'Graph Algorithms', 'Trie / Prefix Trees', 'Segment Trees']
  },
  {
    id: 'meta',
    name: 'Meta / Facebook Top 50',
    badgeColor: '#0668E1',
    logoIcon: '🔵',
    description: 'Emphasizes Binary Trees, Binary Search on Answer, Sliding Window, Two Pointers, and Graph BFS.',
    totalProblems: 50,
    problemIds: ['1', '2', '3', '15', '23', '33', '34', '56', '76', '124', '133', '138', '146', '199', '200', '215', '227', '236', '238', '273', '282', '297', '301', '314', '317', '340', '408', '415', '426', '528', '543', '560', '680', '708', '721', '827', '921', '938', '973', '986', '987', '1047', '1091', '1249', '1428', '1570', '1650', '1762', '2060', '2178'],
    focusTopics: ['Binary Trees', 'Sliding Window', 'Binary Search', 'Two Pointers']
  },
  {
    id: 'amazon',
    name: 'Amazon Top 50',
    badgeColor: '#FF9900',
    logoIcon: '🟠',
    description: 'High emphasis on Strings, Hash Maps, Priority Queues / Heaps, Monotonic Stacks, and Tree Traversal.',
    totalProblems: 50,
    problemIds: ['1', '3', '5', '11', '15', '20', '21', '23', '42', '49', '56', '98', '102', '121', '127', '138', '146', '200', '210', '215', '236', '239', '253', '295', '297', '347', '380', '460', '543', '572', '692', '733', '767', '819', '863', '907', '937', '973', '994', '1010', '1152', '1167', '1268', '1335', '1465', '1492', '1628', '1710', '2104', '2214'],
    focusTopics: ['Heaps & Priority Queues', 'Monotonic Stack', 'Hash Maps', 'LRU Cache Design']
  },
  {
    id: 'microsoft',
    name: 'Microsoft Top 50',
    badgeColor: '#00A4EF',
    logoIcon: '🟩',
    description: 'Focuses on Linked Lists, Matrix Manipulations, String Parsing, Bitwise Operations, and Core Logic.',
    totalProblems: 50,
    problemIds: ['1', '2', '5', '8', '15', '20', '21', '25', '48', '54', '73', '88', '101', '103', '121', '138', '146', '151', '160', '189', '200', '206', '236', '238', '268', '285', '297', '348', '387', '412', '445', '450', '543', '658', '695', '706', '796', '844', '994', '1047', '1160', '1249', '1405', '1448', '1465', '1518', '1647', '1822', '1944', '2011'],
    focusTopics: ['Linked Lists', 'Matrix Rotations', 'Bit Manipulation', 'Math & Logic']
  }
];
