import { Link } from 'react-router'

function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`}>
      <article className="overflow-hidden rounded-lg bg-white shadow transition hover:-translate-y-1 hover:shadow-lg">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-48 w-full object-cover"
        />

        <div className="p-4">
          <h2 className="font-semibold">
            {product.title}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {product.category}
          </p>

          <p className="mt-3 text-lg font-bold">
            ${product.price}
          </p>
        </div>
      </article>
    </Link>
  )
}

export default ProductCard