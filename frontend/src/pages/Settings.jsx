
import { useEffect, useState } from 'react'
import { Server, RefreshCw, ShieldCheck, Info } from 'lucide-react'
import { getBackendHealth, getAppVersion } from '../services/api'

export default function Settings() {
  const [health, setHealth] = useState(null)
  const [version, setVersion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const checkBackend = async () => {
    setLoading(true)
    setError('')

    try {
      const [healthData, versionData] = await Promise.all([
        getBackendHealth(),
        getAppVersion(),
      ])

      setHealth(healthData)
      setVersion(versionData)
    } catch {
      setError('Unable to connect to the backend.')
      setHealth(null)
      setVersion(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkBackend()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="mt-1 text-sm text-slate-500">
          Application information and backend connectivity.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
            <Server size={22} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Backend Connection</h3>
            <p className="text-sm text-slate-500">
              FastAPI server health
            </p>
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <p className="text-sm text-slate-500">Checking connection...</p>
          ) : error ? (
            <p className="text-sm font-medium text-red-600">{error}</p>
          ) : (
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
              <ShieldCheck size={19} />
              Backend is {health?.status || 'unknown'}
            </div>
          )}
        </div>

        <button
          onClick={checkBackend}
          disabled={loading}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh Status
        </button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
            <Info size={22} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Application Information</h3>
            <p className="text-sm text-slate-500">
              Current backend application version
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
            <span className="text-slate-500">Application</span>
            <span className="font-semibold text-slate-900">CatalogOps</span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-slate-500">Version</span>
            <span className="font-semibold text-slate-900">
              {version?.version || 'Unavailable'}
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
