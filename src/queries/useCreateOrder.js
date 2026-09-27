import { useMutation } from '@tanstack/react-query'
import { createOrder } from '../services/orderApi'

export function useCreateOrder() {
  return useMutation({
    mutationFn: createOrder,
  })
}