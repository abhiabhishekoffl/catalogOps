
import {
  LayoutDashboard,
  Package,
  ChartNoAxesCombined,
  Store,
  Settings,
  Box,
} from 'lucide-react'

const navigationItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Products', icon: Package },
  { label: 'Analytics', icon: ChartNoAxesCombined },
]

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="flex h-screen w-64 flex-col bg-slate-950 p-5 text-white">
      <div className="mb-10 flex items-center gap-3">
        <div className="rounded-xl bg-indigo-600 p-2">
          <Box size={24} />
        </div>

        <div>
          <h1 className="text-xl font-bold">CatalogOps</h1>
          <p className="text-xs text-slate-400">Product Management</p>
        </div>
      </div>

      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Workspace
      </p>

      <nav className="flex flex-col gap-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.label

          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.label)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={19} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto border-t border-slate-800 pt-4">
        <button
          onClick={() => onNavigate('Storefront')}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        >
          <Store size={19} />
          Storefront
        </button>

        <button
          onClick={() => onNavigate('Settings')}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        >
          <Settings size={19} />
          Settings
        </button>
      </div>
    </aside>
  )
}
