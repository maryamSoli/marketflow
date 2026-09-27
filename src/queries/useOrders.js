import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

async function getOrders() {
  const response = await api.get('/carts', {
    params: {
      limit: 0,
    },
  })

  return response.data
}

function getOrderStatus(id) {
  const statuses = [
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
  ]

  return statuses[id % statuses.length]
}

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
    staleTime: 1000 * 30,
    select: data => ({
      ...data,
      carts: data.carts.map(cart => ({
        ...cart,
        status: getOrderStatus(cart.id),
      })),
    }),
  })
}