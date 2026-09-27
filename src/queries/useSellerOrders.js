import { useMemo } from 'react'
import { useSellerProducts } from './useSellerProducts'
import { useOrders } from './useOrders'

export function useSellerOrders() {
  const ordersQuery = useOrders()
  const productsQuery = useSellerProducts()

  const sellerProductIds = useMemo(() => {
    return new Set(
      (productsQuery.data?.products || []).map(
        product => product.id,
      ),
    )
  }, [productsQuery.data])

  const sellerOrders = useMemo(() => {
    const carts = ordersQuery.data?.carts || []

    return carts
      .map(cart => {
        const sellerProducts = cart.products.filter(
          product => sellerProductIds.has(product.id),
        )

        const sellerTotal = sellerProducts.reduce(
          (sum, product) =>
            sum + product.discountedTotal,
          0,
        )

        const sellerQuantity = sellerProducts.reduce(
          (sum, product) =>
            sum + product.quantity,
          0,
        )

        return {
          ...cart,
          products: sellerProducts,
          sellerTotal,
          sellerQuantity,
        }
      })
      .filter(cart => cart.products.length > 0)
  }, [ordersQuery.data, sellerProductIds])

  return {
    ...ordersQuery,

    isPending:
      ordersQuery.isPending ||
      productsQuery.isPending,

    isError:
      ordersQuery.isError ||
      productsQuery.isError,

    error:
      ordersQuery.error ||
      productsQuery.error,

    data: ordersQuery.data
      ? {
          ...ordersQuery.data,
          carts: sellerOrders,
          total: sellerOrders.length,
        }
      : undefined,
  }
}
