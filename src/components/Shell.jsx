import { useAuth } from '../context/AuthContext'

function initials(name = '') {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function Shell({ children, title }) {
  const { profile, role, logout } = useAuth()

  return (
    <div className="min-h-screen flex bg-canvas">
      <aside className="w-64 bg-sidebar text-white flex flex-col shrink-0">
        <div className="px-6 py-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet flex items-center justify-center font-display font-bold text-sm">
            E
          </div>
          <span className="font-display font-semibold">EMS</span>
        </div>

        <nav className="flex-1 px-3 mt-4 space-y-1">
          <div className="px-3 py-2 rounded-lg bg-sidebar-hover text-sm font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber" />
            {role === 'admin' ? 'Employees' : 'My Profile'}
          </div>
        </nav>

        <div className="px-4 py-4 border-t border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-violet/30 border border-violet/50 flex items-center justify-center text-xs font-semibold">
            {initials(profile?.full_name || 'U')}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{profile?.full_name || 'User'}</p>
            <p className="text-xs text-white/40 capitalize">{role}</p>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="text-white/50 hover:text-rose transition text-xs font-medium"
          >
            Exit
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="h-16 border-b border-line bg-surface flex items-center px-8">
          <h1 className="font-display text-lg font-semibold">{title}</h1>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
