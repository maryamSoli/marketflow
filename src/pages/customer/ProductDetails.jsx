import { Link, useParams } from 'react-router'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../store/slices/cartSlice'
import { useProduct } from '../../queries/useProduct'

function ProductDetails() {
  const { id } = useParams()
  const dispatch = useDispatch()

  const {
    data: product,
    isPending,
    isError,
    error,
  } = useProduct(id)

  if (isPending) {
    return (
      <div className="p-4">
        Loading product...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-4">
        <p className="text-red-600">
          {error.message}
        </p>

        <Link
          to="/products"
          className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white"
        >
          Back to products
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link
        to="/products"
        className="mb-6 inline-block text-blue-600 hover:underline"
      >
        ← Back to products
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full rounded-lg bg-white object-cover"
          />
        </div>

        <div>
          <p className="text-sm uppercase tracking-wide text-gray-500">
            {product.category}
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            {product.title}
          </h1>

          <p className="mt-4 text-3xl font-bold">
            ${product.price}
          </p>

          <p className="mt-6 leading-7 text-gray-600">
            {product.description}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-white p-4">
              <p className="text-sm text-gray-500">
                Rating
              </p>
              <p className="mt-1 font-semibold">
                {product.rating}
              </p>
            </div>

            <div className="rounded-lg bg-white p-4">
              <p className="text-sm text-gray-500">
                Stock
              </p>
              <p className="mt-1 font-semibold">
                {product.stock}
              </p>
            </div>

            <div className="rounded-lg bg-white p-4">
              <p className="text-sm text-gray-500">
                Brand
              </p>
              <p className="mt-1 font-semibold">
                {product.brand || 'N/A'}
              </p>
            </div>
          </div>

          <button
            onClick={() => dispatch(addToCart(product))}
            className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails