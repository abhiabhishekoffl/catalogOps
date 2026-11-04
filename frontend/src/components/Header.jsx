
import { Search, Bell, ChevronDown } from 'lucide-react'

export default function Header({ title }) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          {title}
        </h2>
        <p className="text-sm text-slate-500">
          Welcome back! Here's what's happening with your catalog.
        </p>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 sm:flex">
          <Search size={18} className="text-slate-400" />
          <input
            type="search"
            placeholder="Search anything..."
            className="w-40 bg-transparent text-sm outline-none"
          />
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100"
        >
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <button
          type="button"
          className="flex items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
            A
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-slate-800">
              Admin
            </p>
            <p className="text-xs text-slate-500">
              Administrator
            </p>
          </div>

          <ChevronDown size={16} className="text-slate-400" />
        </button>
      </div>
    </header>
  )
}
