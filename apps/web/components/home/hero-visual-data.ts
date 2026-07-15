export type HeroVisualItemSize = 'large' | 'medium' | 'small';
export type HeroVisualItemKind = 'technical' | 'profile';

export type HeroVisualItem = {
  id: string;
  fallbackGradient: string;
  image: string;
  kind: HeroVisualItemKind;
  label: string;
  size: HeroVisualItemSize;
};

export const heroVisualItems: HeroVisualItem[] = [
  {
    id: 'software-architecture',
    label: 'Software Architecture',
    image: '/images/hero/software-architect.png',
    fallbackGradient: 'linear-gradient(135deg, #1e293b, #2563eb 48%, #22d3ee)',
    size: 'large',
    kind: 'technical',
  },
  {
    id: 'backend-engineering',
    label: 'Backend Engineering',
    image: '/images/hero/backend-engineering.png',
    fallbackGradient: 'linear-gradient(135deg, #111827, #7c3aed 52%, #60a5fa)',
    size: 'medium',
    kind: 'technical',
  },
  {
    id: 'cloud-devops',
    label: 'Cloud & DevOps',
    image: '/images/hero/cloud-devops.png',
    fallbackGradient: 'linear-gradient(135deg, #020617, #334155 42%, #a78bfa)',
    size: 'large',
    kind: 'technical',
  },
  {
    id: 'ai-for-developers',
    label: 'AI for Developers',
    image: '/images/hero/AI-for-developers.png',
    fallbackGradient: 'linear-gradient(135deg, #0f172a, #0891b2 52%, #22d3ee)',
    size: 'small',
    kind: 'technical',
  },
  {
    id: 'builder',
    label: 'Builder',
    image: '/images/hero/builder-profile.png',
    fallbackGradient: 'linear-gradient(135deg, #020617, #4f46e5 48%, #06b6d4)',
    size: 'medium',
    kind: 'profile',
  },
];
