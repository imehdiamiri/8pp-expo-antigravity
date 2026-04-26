export enum CardCategory {
  Act = 'act',
  Talk = 'talk',
  Challenges = 'challenges',
  Penalty = 'penalty',
  Couple = 'couple',
}

export const CardCategoryInfo = {
  [CardCategory.Act]: {
    id: CardCategory.Act,
    title: 'Act',
    subtitle: 'Perform it out loud',
    icon: 'theatermasks.fill',
    accentColor: '#A855F7', // Purple
  },
  [CardCategory.Talk]: {
    id: CardCategory.Talk,
    title: 'Talk',
    subtitle: 'Speak, answer, discuss',
    icon: 'bubble.left.and.bubble.right.fill',
    accentColor: '#3B82F6', // Blue
  },
  [CardCategory.Challenges]: {
    id: CardCategory.Challenges,
    title: 'Challenges',
    subtitle: 'Short rules with a twist',
    icon: 'bolt.fill',
    accentColor: '#F97316', // Orange
  },
  [CardCategory.Penalty]: {
    id: CardCategory.Penalty,
    title: 'Penalty',
    subtitle: 'A playful consequence',
    icon: 'exclamationmark.triangle.fill',
    accentColor: '#EF4444', // Red
  },
  [CardCategory.Couple]: {
    id: CardCategory.Couple,
    title: 'Couple',
    subtitle: 'Just for two',
    icon: 'heart.fill',
    accentColor: '#EC4899', // Pink
  },
};

export const CardCategoriesList = Object.values(CardCategoryInfo);
