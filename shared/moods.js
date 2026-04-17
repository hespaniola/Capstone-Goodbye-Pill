export const moodCatalog = [
  {
    id: 'stress',
    title: 'Stress',
    desc: 'Release pressure and slow your nervous system.',
    prompt: 'What is putting the most pressure on you right now?',
    recommendation: 'Try a 60-second breathing reset followed by one small priority.',
    release: 'Exhale Pill',
  },
  {
    id: 'overthinking',
    title: 'Overthinking',
    desc: 'Interrupt looping thoughts and regain clarity.',
    prompt: 'What thought keeps repeating in your mind?',
    recommendation: 'Write the thought once, then replace it with a calmer sentence.',
    release: 'Quiet Mind Pill',
  },
  {
    id: 'burnout',
    title: 'Burnout',
    desc: 'Reduce overload and protect your energy.',
    prompt: 'What has been draining your energy the most?',
    recommendation: 'Pause, hydrate, and choose only one next task.',
    release: 'Reset Pill',
  },
  {
    id: 'guilt',
    title: 'Guilt',
    desc: 'Reflect honestly while making room for compassion.',
    prompt: 'What are you still holding against yourself?',
    recommendation: 'Name the lesson, then practice one sentence of self-forgiveness.',
    release: 'Release Pill',
  },
]

export const defaultMoodId = moodCatalog[0].id

export function getMoodById(moodId) {
  return moodCatalog.find((mood) => mood.id === moodId) ?? moodCatalog[0]
}

