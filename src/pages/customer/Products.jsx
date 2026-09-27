import { useState } from 'react'
import ProductCard from '../../components/ProductCard'
import { useProducts } from '../../queries/useProducts'
import { useCategories } from '../../queries/useCategories'

function Products() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [order, setOrder] = useState('asc')

  const {
    data,
    isPending,
    isError,
    error,
    isFetching,
  } = useProducts(
    page,
    search,
    category,
    sortBy,
    order,
  )

  const {
    data: categories,
    isPending: categoriesLoading,
  } = useCategories()

  function handleSearch(event) {
    setSearch(event.target.value)
    setCategory('')
    setPage(0)
  }

  function handleCategory(event) {
    setCategory(event.target.value)
    setSearch('')
    setPage(0)
  }

  function handleSort(event) {
    const value = event.target.value

    setPage(0)

    if (value === '') {
      setSortBy('')
      setOrder('asc')
    }

    if (value === 'price-low') {
      setSortBy('price')
      setOrder('asc')
    }

    if (value === 'price-high') {
      setSortBy('price')
      setOrder('desc')
    }

    if (value === 'name') {
      setSortBy('title')
      setOrder('asc')
    }

    if (value === 'rating') {
      setSortBy('rating')
      setOrder('desc')
    }
  }

  if (isPending || categoriesLoading) {
    return (
      <div className="p-4">
        Loading products...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-4 text-red-600">
        {error.message}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Products
        </h1>

        <p className="mt-1 text-gray-500">
          Find the products you need.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        <input
          value={search}
          onChange={handleSearch}
          placeholder="Search products..."
          className="rounded border px-4 py-2 outline-none focus:border-blue-500"
        />

        <select
          value={category}
          onChange={handleCategory}
          className="rounded border px-4 py-2 outline-none"
        >
          <option value="">All categories</option>

          {categories.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          onChange={handleSort}
          className="rounded border px-4 py-2 outline-none"
        >
          <option value="">Sort by</option>
          <option value="price-low">
            Price: Low to High
          </option>
          <option value="price-high">
            Price: High to Low
          </option>
          <option value="name">
            Name
          </option>
          <option value="rating">
            Rating
          </option>
        </select>
      </div>

      {isFetching && (
        <p className="mb-4 text-sm text-gray-500">
          Updating products...
        </p>
      )}

      {data.products.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="rounded border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        <span>
          Page {page + 1}
        </span>

        <button
          disabled={(page + 1) * 12 >= data.total}
          onClick={() => setPage(page + 1)}
          className="rounded border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Products