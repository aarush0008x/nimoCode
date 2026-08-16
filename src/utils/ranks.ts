export interface RankDivision {
  name: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Grandmaster';
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  minRating: number;
}

export const getRankDivision = (rating: number): RankDivision => {
  if (rating >= 2000) {
    return {
      name: 'Grandmaster',
      tier: 'Grandmaster',
      icon: '🔥',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      minRating: 2000
    };
  }
  if (rating >= 1800) {
    return {
      name: 'Diamond',
      tier: 'Diamond',
      icon: '👑',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      minRating: 1800
    };
  }
  if (rating >= 1600) {
    return {
      name: 'Platinum II',
      tier: 'Platinum',
      icon: '💎',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
      minRating: 1600
    };
  }
  if (rating >= 1400) {
    return {
      name: 'Gold I',
      tier: 'Gold',
      icon: '🥇',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      minRating: 1400
    };
  }
  if (rating >= 1200) {
    return {
      name: 'Silver II',
      tier: 'Silver',
      icon: '🥈',
      color: 'text-slate-400',
      bgColor: 'bg-slate-500/10',
      borderColor: 'border-slate-500/30',
      minRating: 1200
    };
  }
  return {
    name: 'Bronze I',
    tier: 'Bronze',
    icon: '🥉',
    color: 'text-amber-700',
    bgColor: 'bg-amber-900/10',
    borderColor: 'border-amber-900/30',
    minRating: 0
  };
};
