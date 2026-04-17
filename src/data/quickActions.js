import { HeartPulse, Wind, Sparkles, BookOpenText } from 'lucide-react'

export const quickActions = [
  {
    id: 'mood',
    title: 'Check in',
    icon: HeartPulse,
    text: 'Name how you feel and personalize your reset.',
    path: '/mood',
  },
  {
    id: 'breathing',
    title: 'Breathe',
    icon: Wind,
    text: 'Use a guided breathing rhythm to slow down.',
    path: '/breathing',
  },
  {
    id: 'release',
    title: 'Release',
    icon: Sparkles,
    text: 'Move through a symbolic emotional reset.',
    path: '/release',
  },
  {
    id: 'journal',
    title: 'Reflect',
    icon: BookOpenText,
    text: 'Journal what you are carrying right now.',
    path: '/journal',
  },
]
