import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '../services/productApi'
import {
  ensureProductOwners,
  removeProductOwner,
  setProductOwner,
} from '../utils/sellerOwnership'

export function useSellerProducts() {
  const user = useSelector(
    state => state.auth.user,
  )

  return useQuery({
    queryKey: [
      'sellerProducts',
      user?.id,
    ],

    queryFn: async () => {
      if (!user?.id) {
        return []
      }

      const data = await getProducts({
        limit: 0,
        skip: 0,
      })

      const products = data?.products || []

      const owners = ensureProductOwners(
        products.map(
          product => product.id,
        ),
        user.id,
      )

      return products.filter(
        product =>
          owners[product.id] ===
          user.id,
      )
    },

    enabled: !!user?.id,
  })
}

export function useAddSellerProduct() {
  const queryClient = useQueryClient()

  const user = useSelector(
    state => state.auth.user,
  )

  return useMutation({
    mutationFn: addProduct,

    onSuccess: newProduct => {
      if (user?.id) {
        setProductOwner(
          newProduct.id,
          user.id,
        )
      }

      queryClient.setQueryData(
        [
          'sellerProducts',
          user?.id,
        ],
        oldProducts => [
          ...(oldProducts || []),
          newProduct,
        ],
      )

      queryClient.invalidateQueries({
        queryKey: [
          'sellerProducts',
          user?.id,
        ],
      })
    },
  })
}

export function useUpdateSellerProduct() {
  const queryClient = useQueryClient()

  const user = useSelector(
    state => state.auth.user,
  )

  return useMutation({
    mutationFn: ({
      id,
      product,
    }) =>
      updateProduct(id, product),

    onSuccess: updatedProduct => {
      queryClient.setQueryData(
        [
          'sellerProducts',
          user?.id,
        ],
        oldProducts =>
          (oldProducts || []).map(
            product =>
              Number(product.id) ===
              Number(updatedProduct.id)
                ? {
                    ...product,
                    ...updatedProduct,
                  }
                : product,
          ),
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
        queryKey: [
          'sellerProducts',
          user?.id,
        ],
      })
    },
  })
}

export function useDeleteSellerProduct() {
  const queryClient = useQueryClient()

  const user = useSelector(
    state => state.auth.user,
  )

  return useMutation({
    mutationFn: deleteProduct,

    onSuccess: deletedId => {
      removeProductOwner(deletedId)

      queryClient.setQueryData(
        [
          'sellerProducts',
          user?.id,
        ],
        oldProducts =>
          (oldProducts || []).filter(
            product =>
              Number(product.id) !==
              Number(deletedId),
          ),
      )

      queryClient.removeQueries({
        queryKey: [
          'product',
          Number(deletedId),
        ],
      })

      queryClient.invalidateQueries({
        queryKey: [
          'sellerProducts',
          user?.id,
        ],
      })
    },
  })
}