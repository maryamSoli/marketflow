import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  useAdminProducts,
  useAddProduct,
  useUpdateProduct,
  useDeleteProduct,
} from './useAdminProducts'
import {
  ensureProductOwners,
  setProductOwner,
  removeProductOwner,
} from '../utils/sellerOwnership'

export function useSellerProducts() {
  const sellerId = useSelector(
    state => state.auth.user?.id,
  )

  const query = useAdminProducts()

  const sellerProducts = useMemo(() => {
    if (!query.data || !sellerId) {
      return []
    }

    const allProducts = query.data.products || []

    const owners = ensureProductOwners(
      allProducts.map(product => product.id),
      sellerId,
    )

    return allProducts.filter(
      product => owners[product.id] === sellerId,
    )
  }, [query.data, sellerId])

  return {
    ...query,
    data: query.data
      ? {
          ...query.data,
          products: sellerProducts,
          total: sellerProducts.length,
        }
      : undefined,
  }
}

export function useAddSellerProduct() {
  const sellerId = useSelector(
    state => state.auth.user?.id,
  )

  const mutation = useAddProduct()

  function mutate(product, options = {}) {
    mutation.mutate(product, {
      ...options,

      onSuccess: newProduct => {
        if (sellerId) {
          setProductOwner(
            newProduct.id,
            sellerId,
          )
        }

        if (options.onSuccess) {
          options.onSuccess(newProduct)
        }
      },
    })
  }

  return {
    ...mutation,
    mutate,
  }
}

export function useUpdateSellerProduct() {
  return useUpdateProduct()
}

export function useDeleteSellerProduct() {
  const mutation = useDeleteProduct()

  function mutate(productId, options = {}) {
    mutation.mutate(productId, {
      ...options,

      onSuccess: deletedProduct => {
        removeProductOwner(
          deletedProduct.id,
        )

        if (options.onSuccess) {
          options.onSuccess(deletedProduct)
        }
      },
    })
  }

  return {
    ...mutation,
    mutate,
  }
}