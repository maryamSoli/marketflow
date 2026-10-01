import { useMutation } from '@tanstack/react-query'
import { createOrder } from '../services/orderApi'
import { saveCustomerOrder } from '../utils/orderStorage'

export function useCreateOrder() {
  return useMutation({
    mutationFn: async order => {
      const response = await createOrder(order)

      const savedOrder = saveCustomerOrder({
        apiOrderId: response.id,
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        address: order.address,
        city: order.city,
        postalCode: order.postalCode,
        products: order.products,
        total: order.total,
      })

      return savedOrder
    },
  })
}