import { useQuery } from '@tanstack/react-query'
import { getProduct } from '../services/productApi'

export function useProduct(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  })
}

export function getProductQuery(id) {
  return {
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
  }
}