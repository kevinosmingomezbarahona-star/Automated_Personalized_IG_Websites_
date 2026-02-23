import { Dumbbell, Trophy, Heart, Scale, Gavel, Shield, ShoppingBag, Tag, Star } from 'lucide-react';

export type Niche = 'fitness' | 'legal' | 'corporate' | 'ecommerce' | 'fashion';

export interface ThemeConfig {
  name: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  accentLight: string;
  navBg: string;
  cardBg: string;
  borderColor: string;
  buttonBg: string;
  buttonHover: string;
  heroHeadline: string;
  sectionTitle: string;
  services: { title: string; description: string }[];
  aiPrompt: string;
  icons: {
    primary: typeof Dumbbell;
    secondary: typeof Trophy;
    tertiary: typeof Heart;
  };
  portfolioLabel: string;
  fontSerif: string;
  fontSans: string;
}

export const themes: Record<Niche, ThemeConfig> = {
  fitness: {
    name: 'Fitness',
    backgroundColor: '#050505',
    textColor: '#F5F5F5',
    accentColor: '#D4AF37',
    accentLight: '#C5A028',
    navBg: '#050505/95',
    cardBg: '#1a1a1a',
    borderColor: '#D4AF37/20',
    buttonBg: 'from-[#D4AF37] to-[#C5A028]',
    buttonHover: 'hover:shadow-[#D4AF37]/50',
    heroHeadline: 'Elevate Your Potential.',
    sectionTitle: 'Transformations',
    portfolioLabel: 'Recent Excellence',
    services: [
      {
        title: '1:1 Coaching',
        description: 'Personalized training programs designed specifically for your fitness goals.',
      },
      {
        title: 'Diet Plans',
        description: 'Nutrition strategies crafted to maximize results and sustainable wellness.',
      },
      {
        title: 'Competition Prep',
        description: 'Elite preparation for competitions with proven peak performance methods.',
      },
    ],
    aiPrompt: 'Ready to start your fitness journey?',
    icons: { primary: Dumbbell, secondary: Trophy, tertiary: Heart },
    fontSerif: 'font-serif',
    fontSans: 'font-sans',
  },
  legal: {
    name: 'Legal',
    backgroundColor: '#FFFFFF',
    textColor: '#1a1a2e',
    accentColor: '#16213e',
    accentLight: '#0f3460',
    navBg: '#FFFFFF/95',
    cardBg: '#f5f5f5',
    borderColor: '#16213e/20',
    buttonBg: 'from-[#16213e] to-[#0f3460]',
    buttonHover: 'hover:shadow-[#16213e]/50',
    heroHeadline: 'Justice & Integrity.',
    sectionTitle: 'Our Excellence',
    portfolioLabel: 'Notable Cases',
    services: [
      {
        title: 'Legal Consultation',
        description: 'Expert legal advice on matters critical to your business and interests.',
      },
      {
        title: 'Case Review',
        description: 'Comprehensive case analysis with strategic recommendations.',
      },
      {
        title: 'Representation',
        description: 'Full legal representation with unwavering dedication to justice.',
      },
    ],
    aiPrompt: 'Need to schedule a consultation?',
    icons: { primary: Scale, secondary: Gavel, tertiary: Shield },
    fontSerif: 'font-serif',
    fontSans: 'font-sans',
  },
  corporate: {
    name: 'Corporate',
    backgroundColor: '#FFFFFF',
    textColor: '#1a1a2e',
    accentColor: '#16213e',
    accentLight: '#0f3460',
    navBg: '#FFFFFF/95',
    cardBg: '#f5f5f5',
    borderColor: '#16213e/20',
    buttonBg: 'from-[#16213e] to-[#0f3460]',
    buttonHover: 'hover:shadow-[#16213e]/50',
    heroHeadline: 'Drive Excellence.',
    sectionTitle: 'Our Excellence',
    portfolioLabel: 'Case Studies',
    services: [
      {
        title: 'Strategic Consulting',
        description: 'Transform your organization with data-driven strategies.',
      },
      {
        title: 'Leadership Development',
        description: 'Build world-class leaders who drive organizational success.',
      },
      {
        title: 'Operational Excellence',
        description: 'Optimize processes and maximize efficiency across all departments.',
      },
    ],
    aiPrompt: 'Ready to schedule a consultation?',
    icons: { primary: Shield, secondary: Scale, tertiary: Gavel },
    fontSerif: 'font-serif',
    fontSans: 'font-sans',
  },
  ecommerce: {
    name: 'E-Commerce',
    backgroundColor: '#FFFFFF',
    textColor: '#1a1a1a',
    accentColor: '#000000',
    accentLight: '#333333',
    navBg: '#FFFFFF/95',
    cardBg: '#f9f9f9',
    borderColor: '#e0e0e0',
    buttonBg: 'from-[#000000] to-[#333333]',
    buttonHover: 'hover:shadow-[#000000]/50',
    heroHeadline: 'Curated Selection.',
    sectionTitle: 'New Arrivals',
    portfolioLabel: 'Featured Products',
    services: [
      {
        title: 'Free Shipping',
        description: 'Fast, reliable delivery on all orders nationwide.',
      },
      {
        title: 'Premium Quality',
        description: 'Hand-selected items that meet our exacting standards.',
      },
      {
        title: '24/7 Support',
        description: 'Dedicated customer service always here to help.',
      },
    ],
    aiPrompt: 'Looking for a specific product?',
    icons: { primary: ShoppingBag, secondary: Tag, tertiary: Star },
    fontSerif: 'font-serif',
    fontSans: 'font-sans',
  },
  fashion: {
    name: 'Fashion',
    backgroundColor: '#FFFFFF',
    textColor: '#1a1a1a',
    accentColor: '#000000',
    accentLight: '#333333',
    navBg: '#FFFFFF/95',
    cardBg: '#f9f9f9',
    borderColor: '#e0e0e0',
    buttonBg: 'from-[#000000] to-[#333333]',
    buttonHover: 'hover:shadow-[#000000]/50',
    heroHeadline: 'Curated Style.',
    sectionTitle: 'New Collection',
    portfolioLabel: 'Latest Pieces',
    services: [
      {
        title: 'Personal Styling',
        description: 'Bespoke styling consultations tailored to your aesthetic.',
      },
      {
        title: 'Wardrobe Curation',
        description: 'Expert selection of pieces that define your personal brand.',
      },
      {
        title: 'Trend Forecasting',
        description: 'Stay ahead with insider knowledge of emerging fashion trends.',
      },
    ],
    aiPrompt: 'Curious about our latest collection?',
    icons: { primary: ShoppingBag, secondary: Star, tertiary: Tag },
    fontSerif: 'font-serif',
    fontSans: 'font-sans',
  },
};

export function getTheme(niche: Niche): ThemeConfig {
  return themes[niche] || themes.fitness;
}
