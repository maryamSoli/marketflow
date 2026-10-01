import { Link, useParams } from 'react-router'
import {
  useDispatch,
  useSelector,
} from 'react-redux'
import {
  Heart,
  ShoppingCart,
} from 'lucide-react'
import { addToCart } from '../../store/slices/cartSlice'
import {
  addToWishlist,
  removeFromWishlist,
} from '../../store/slices/wishlistSlice'
import { useProduct } from '../../queries/useProduct'
import ReviewSection from '../../components/ReviewSection'

function ProductDetails() {
  const { id } = useParams()
  const dispatch = useDispatch()

  const wishlistItems = useSelector(
    state => state.wishlist.items,
  )

  const {
    data: product,
    isPending,
    isError,
    error,
  } = useProduct(id)

  const isWishlisted = wishlistItems.some(
    item => item.id === product?.id,
  )

  function handleWishlist() {
    if (!product) {
      return
    }

    if (isWishlisted) {
      dispatch(
        removeFromWishlist(product.id),
      )
    } else {
      dispatch(
        addToWishlist(product),
      )
    }
  }

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

          <div className="mt-2 flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold md:text-4xl">
              {product.title}
            </h1>

            <button
              onClick={handleWishlist}
              className="rounded-full border p-3 hover:bg-gray-100"
              aria-label={
                isWishlisted
                  ? 'Remove from wishlist'
                  : 'Add to wishlist'
              }
            >
              <Heart
                size={22}
                fill={
                  isWishlisted
                    ? 'currentColor'
                    : 'none'
                }
              />
            </button>
          </div>

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

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() =>
                dispatch(addToCart(product))
              }
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              <ShoppingCart size={20} />
              Add to cart
            </button>

            <button
              onClick={handleWishlist}
              className="flex items-center justify-center gap-2 rounded-lg border px-6 py-3 font-semibold hover:bg-gray-100"
            >
              <Heart
                size={20}
                fill={
                  isWishlisted
                    ? 'currentColor'
                    : 'none'
                }
              />

              {isWishlisted
                ? 'Remove from wishlist'
                : 'Add to wishlist'}
            </button>
          </div>
        </div>
      </div>

      <ReviewSection
        productId={product.id}
      />
    </div>
  )
}

export default ProductDetails
