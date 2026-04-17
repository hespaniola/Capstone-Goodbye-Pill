import { Wind, Moon, Sparkles, HeartHandshake } from 'lucide-react'
import { moodCatalog } from '../../shared/moods'

const moodVisuals = {
  stress: {
    icon: Wind,
    accent: 'from-sky-500/30 to-cyan-500/30',
    glow: 'shadow-[0_0_60px_rgba(56,189,248,0.18)]',
  },
  overthinking: {
    icon: Moon,
    accent: 'from-violet-500/30 to-indigo-500/30',
    glow: 'shadow-[0_0_60px_rgba(139,92,246,0.18)]',
  },
  burnout: {
    icon: Sparkles,
    accent: 'from-amber-500/30 to-orange-500/30',
    glow: 'shadow-[0_0_60px_rgba(251,146,60,0.16)]',
  },
  guilt: {
    icon: HeartHandshake,
    accent: 'from-rose-500/30 to-pink-500/30',
    glow: 'shadow-[0_0_60px_rgba(244,63,94,0.16)]',
  },
}

export const moods = moodCatalog.map((mood) => ({
  ...mood,
  ...moodVisuals[mood.id],
}))

export function getMoodById(moodId) {
  return moods.find((mood) => mood.id === moodId) ?? moods[0]
}
