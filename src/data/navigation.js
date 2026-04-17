import {
  LayoutDashboard,
  HeartPulse,
  Wind,
  Sparkles,
  BookOpenText,
  Lightbulb,
} from 'lucide-react'

export const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'mood', label: 'Mood Check-In', icon: HeartPulse, path: '/mood' },
  { id: 'breathing', label: 'Breathing', icon: Wind, path: '/breathing' },
  { id: 'release', label: 'Release', icon: Sparkles, path: '/release' },
  { id: 'journal', label: 'Journal', icon: BookOpenText, path: '/journal' },
  { id: 'recommendations', label: 'Recommendations', icon: Lightbulb, path: '/recommendations' },
]
