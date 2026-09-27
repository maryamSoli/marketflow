import api from './api'

export async function createOrder(order) {
  const response = await api.post('/carts/add', {
    userId: 1,
    products: order.products,
  })

  return response.data
}