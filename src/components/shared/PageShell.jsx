export default function PageShell({ title, description, action, children }) {
  return (
    <div className="glass rounded-[2rem] shadow-2xl">
      <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">{title}</h1>
          <p className="mt-2 text-white/65">{description}</p>
        </div>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}
