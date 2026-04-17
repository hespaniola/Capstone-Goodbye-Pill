import { NavLink } from 'react-router-dom'
import { navigation } from '../../data/navigation'

export default function AppSidebar() {
  return (
    <aside className="glass rounded-[2rem]">
      <div className="border-b border-white/10 px-5 py-5">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">GoodbyePills</p>
        <h2 className="mt-2 text-xl font-semibold text-white">Reset Hub</h2>
      </div>

      <nav className="space-y-2 p-4">
        {navigation.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                  isActive
                    ? 'border-white/20 bg-white/15 text-white'
                    : 'border-white/10 bg-black/20 text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
