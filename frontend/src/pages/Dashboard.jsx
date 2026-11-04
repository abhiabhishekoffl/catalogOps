
import { useEffect, useState } from 'react'

import {
  Package,
  Layers,
  IndianRupee,
  TrendingUp,
  RefreshCw,
} from 'lucide-react'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import { getDashboardSummary } from '../services/api'

const currency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value || 0)

const statistics = (data) => [
  {
    title: 'Total Products',
    value: data.total_products,
    icon: Package,
    color: 'bg-indigo-100 text-indigo-600',
  },
  {
    title: 'Categories',
    value: data.total_categories,
    icon: Layers,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'Total Catalog Value',
    value: currency(data.total_catalog_value),
    icon: IndianRupee,
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    title: 'Average Product Price',
    value: currency(data.average_price),
    icon: TrendingUp,
    color: 'bg-orange-100 text-orange-600',
  },
]

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDashboard = async () => {
    try {
      setLoading(true)
      setError('')

      const result = await getDashboardSummary()
      setData(result)
    } catch (err) {
      setError(err.message || 'Unable to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-72 items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto animate-spin text-indigo-600" size={28} />
          <p className="mt-3 text-sm text-slate-500">
            Loading dashboard data...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="font-semibold text-red-700">
          Dashboard could not be loaded
        </p>
        <p className="mt-1 text-sm text-red-600">{error}</p>

        <button
          onClick={loadDashboard}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  const cards = statistics(data)
  const recentProducts = data.recent_products || []
  const categoryData = data.products_by_category || []

  return (
    <div className="space-y-8">

      {/* Dashboard heading */}
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Dashboard Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Live insights from your product database.
          </p>
        </div>

        <button
          onClick={loadDashboard}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </section>

      {/* Live statistics */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={21} />
                </div>
              </div>

              <h3 className="mt-5 break-words text-2xl font-bold text-slate-900">
                {stat.value}
              </h3>

              <p className="mt-2 text-xs text-slate-400">
                Based on current database records
              </p>
            </div>
          )
        })}
      </section>

      {/* Category chart and recent products */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Products by category */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <h3 className="text-lg font-bold text-slate-900">
            Products by Category
          </h3>

          <p className="mb-6 text-sm text-slate-500">
            Actual product distribution across categories.
          </p>

          <div className="h-72 w-full">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    dataKey="category"
                    stroke="#94a3b8"
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    allowDecimals={false}
                    stroke="#94a3b8"
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="count"
                    name="Products"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No category data available.
              </div>
            )}
          </div>
        </div>

        {/* Recent products */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">
            Recent Products
          </h3>

          <p className="mb-6 text-sm text-slate-500">
            Latest products by database ID.
          </p>

          {recentProducts.length > 0 ? (
            <div className="space-y-5">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Package size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {product.name}
                    </p>

                    <p className="text-xs text-slate-500">
                      {product.category}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {currency(product.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              No products have been added yet.
            </p>
          )}
        </div>
      </section>

      <p className="text-center text-xs text-slate-400">
        CatalogOps Admin Dashboard · Live Database Analytics
      </p>
    </div>
  )
}
