import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'

const ADMIN_PRODUCTS_KEY = ['admin-products']

async function getAllProducts() {
  const response = await api.get('/products', {
    params: {
      limit: 0,
    },
  })

  return response.data
}

async function addProduct(product) {
  const response = await api.post('/products/add', product)

  return response.data
}

async function updateProduct(product) {
  const response = await api.put(`/products/${product.id}`, {
    title: product.title,
    price: product.price,
    stock: product.stock,
    category: product.category,
  })

  return response.data
}

async function deleteProduct(id) {
  const response = await api.delete(`/products/${id}`)

  return response.data
}

export function useAdminProducts() {
  return useQuery({
    queryKey: ADMIN_PRODUCTS_KEY,
    queryFn: getAllProducts,
  })
}

export function useAddProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addProduct,

    onSuccess: newProduct => {
      queryClient.setQueryData(
        ADMIN_PRODUCTS_KEY,
        oldData => ({
          ...oldData,
          products: [
            newProduct,
            ...(oldData?.products || []),
          ],
          total: (oldData?.total || 0) + 1,
        }),
      )
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProduct,

    onSuccess: updatedProduct => {
      queryClient.setQueryData(
        ADMIN_PRODUCTS_KEY,
        oldData => ({
          ...oldData,
          products: (oldData?.products || []).map(product =>
            product.id === updatedProduct.id
              ? {
                  ...product,
                  ...updatedProduct,
                }
              : product,
          ),
        }),
      )
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProduct,

    onSuccess: deletedProduct => {
      queryClient.setQueryData(
        ADMIN_PRODUCTS_KEY,
        oldData => ({
          ...oldData,
          products: (oldData?.products || []).filter(
            product => product.id !== deletedProduct.id,
          ),
          total: Math.max(
            0,
            (oldData?.total || 1) - 1,
          ),
        }),
      )
    },
  })
}