import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../services/productApi'

export function useProducts(
  page,
  search,
  category,
  sortBy,
  order,
) {
  const limit = 12
  const skip = page * limit

  return useQuery({
    queryKey: [
      'products',
      page,
      search,
      category,
      sortBy,
      order,
    ],
    queryFn: () =>
      getProducts({
        limit,
        skip,
        search,
        category,
        sortBy,
        order,
      }),
    placeholderData: previousData => previousData,
  })
}