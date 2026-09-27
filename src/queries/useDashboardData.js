import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

async function getDashboardData() {
  const [usersResponse, productsResponse, cartsResponse] =
    await Promise.all([
      api.get('/users', {
        params: {
          limit: 0,
        },
      }),

      api.get('/products', {
        params: {
          limit: 0,
        },
      }),

      api.get('/carts', {
        params: {
          limit: 0,
        },
      }),
    ])

  return {
    users: usersResponse.data,
    products: productsResponse.data,
    carts: cartsResponse.data,
  }
}

export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard-data'],
    queryFn: getDashboardData,
    staleTime: 1000 * 30,
  })
}