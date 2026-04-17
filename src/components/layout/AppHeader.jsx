export default function AppHeader({ title, subtitle, right }) {
  return (
    <header className="glass rounded-[2rem] px-5 py-4 md:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/40">GoodbyePills.com</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">{title}</h1>
          {subtitle && <p className="mt-2 max-w-2xl text-sm text-white/60">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  )
}
