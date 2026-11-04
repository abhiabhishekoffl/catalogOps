
import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

import { getDashboardSummary } from '../services/api'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6']

export default function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboardSummary()
      .then(setData)
      .catch(() => setError('Unable to load analytics data.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="p-8 text-slate-500">Loading analytics...</p>
  }

  if (error) {
    return <p className="rounded-xl bg-red-50 p-5 text-red-600">{error}</p>
  }

  const categories = data.products_by_category || []

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Product Analytics
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Insights calculated from your actual product database.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Metric title="Total Products" value={data.total_products} />
        <Metric title="Total Categories" value={data.total_categories} />
        <Metric
          title="Average Product Price"
          value={`₹${Number(data.average_price).toLocaleString('en-IN')}`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="mb-2 text-lg font-bold text-slate-900">
            Products by Category
          </h3>
          <p className="mb-5 text-sm text-slate-500">
            Number of products in each category.
          </p>

          <div className="h-72">
            {categories.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categories}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" name="Products" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="pt-20 text-center text-slate-400">
                No category data available.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="mb-2 text-lg font-bold text-slate-900">
            Category Distribution
          </h3>
          <p className="mb-5 text-sm text-slate-500">
            Share of products across categories.
          </p>

          <div className="h-72">
            {categories.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {categories.map((item, index) => (
                      <Cell
                        key={item.category}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="pt-20 text-center text-slate-400">
                No category data available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Metric({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="mt-3 break-words text-2xl font-bold text-slate-900">
        {value}
      </h3>
      <p className="mt-2 text-xs text-slate-400">
        Live database calculation
      </p>
    </div>
  )
}
