import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import {
  getCustomerOrder,
  getCustomerOrders,
} from '../utils/orderStorage'

export function useCustomerOrders() {
  const email = useSelector(
    state => state.auth.user?.email,
  )

  return useQuery({
    queryKey: ['customer-orders', email],
    queryFn: () =>
      getCustomerOrders(email),
    enabled: !!email,
  })
}

export function useCustomerOrder(id) {
  const email = useSelector(
    state => state.auth.user?.email,
  )

  return useQuery({
    queryKey: [
      'customer-order',
      email,
      id,
    ],
    queryFn: () =>
      getCustomerOrder(id, email),
    enabled: !!email && !!id,
  })
}