import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '../services/productApi'

async function getAdminProducts() {
  return getProducts({
    limit: 0,
    skip: 0,
  })
}

export function useAdminProducts() {
  return useQuery({
    queryKey: ['adminProducts'],
    queryFn: getAdminProducts,
  })
}

export function useAddProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addProduct,

    onSuccess: newProduct => {
      queryClient.setQueryData(
        ['adminProducts'],
        oldData => {
          const oldProducts = Array.isArray(
            oldData,
          )
            ? oldData
            : oldData?.products || []

          const products = [
            ...oldProducts,
            newProduct,
          ]

          return {
            ...(oldData &&
            !Array.isArray(oldData)
              ? oldData
              : {}),
            products,
            total: products.length,
          }
        },
      )

      queryClient.invalidateQueries({
        queryKey: ['adminProducts'],
      })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      product,
    }) =>
      updateProduct(id, product),

    onSuccess: updatedProduct => {
      queryClient.setQueryData(
        ['adminProducts'],
        oldData => {
          const oldProducts = Array.isArray(
            oldData,
          )
            ? oldData
            : oldData?.products || []

          const products =
            oldProducts.map(product =>
              Number(product.id) ===
              Number(updatedProduct.id)
                ? {
                    ...product,
                    ...updatedProduct,
                  }
                : product,
            )

          return {
            ...(oldData &&
            !Array.isArray(oldData)
              ? oldData
              : {}),
            products,
            total: products.length,
          }
        },
      )

      queryClient.setQueryData(
        [
          'product',
          Number(updatedProduct.id),
        ],
        oldProduct => ({
          ...(oldProduct || {}),
          ...updatedProduct,
        }),
      )

      queryClient.invalidateQueries({
        queryKey: ['adminProducts'],
      })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProduct,

    onSuccess: deletedId => {
      queryClient.setQueryData(
        ['adminProducts'],
        oldData => {
          const oldProducts = Array.isArray(
            oldData,
          )
            ? oldData
            : oldData?.products || []

          const products =
            oldProducts.filter(
              product =>
                Number(product.id) !==
                Number(deletedId),
            )

          return {
            ...(oldData &&
            !Array.isArray(oldData)
              ? oldData
              : {}),
            products,
            total: products.length,
          }
        },
      )

      queryClient.removeQueries({
        queryKey: [
          'product',
          Number(deletedId),
        ],
      })

      queryClient.invalidateQueries({
        queryKey: ['adminProducts'],
      })
    },
  })
}