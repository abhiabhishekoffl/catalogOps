
import { useEffect, useState } from 'react'
import { Search, ShoppingBag, Package } from 'lucide-react'
import { getProducts } from '../services/api'

export default function Storefront() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError('Unable to load products. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  const categories = [
    'All',
    ...new Set(products.map((product) => product.category)),
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      category === 'All' || product.category === category

    return matchesSearch && matchesCategory
  })

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(price)

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-slate-900 px-8 py-12 text-white">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-300">
          Welcome to CatalogOps Store
        </p>

        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
          Discover Our Products
        </h2>

        <p className="mt-3 max-w-xl text-sm text-slate-300">
          Explore our product catalog and find what you're looking for.
        </p>

        <div className="mt-7 flex max-w-lg items-center gap-3 rounded-xl bg-white px-4 py-3 text-slate-500">
          <Search size={19} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-transparent text-sm text-slate-900 outline-none"
          />
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Our Products
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {filteredProducts.length} products available
            </p>
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none"
          >
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="py-16 text-center text-slate-500">
            Loading products...
          </p>
        ) : error ? (
          <p className="py-16 text-center text-red-500">{error}</p>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center">
            <Package className="mx-auto text-slate-300" size={40} />
            <p className="mt-3 text-slate-500">No products found.</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-44 items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100">
                  <ShoppingBag size={54} className="text-indigo-300" />
                </div>

                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                    {product.category}
                  </p>

                  <h4 className="mt-2 text-lg font-bold text-slate-900">
                    {product.name}
                  </h4>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-900">
                      {formatPrice(product.price)}
                    </span>

                    <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Available
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
