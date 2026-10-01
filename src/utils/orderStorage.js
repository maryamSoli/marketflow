const STORAGE_KEY = 'marketflowOrders'

function getAllOrders() {
  const saved = localStorage.getItem(STORAGE_KEY)

  if (!saved) {
    return []
  }

  try {
    return JSON.parse(saved)
  } catch {
    return []
  }
}

function saveAllOrders(orders) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(orders),
  )
}

export function saveCustomerOrder(order) {
  const orders = getAllOrders()

  const newOrder = {
    ...order,
    id: `MF-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'Processing',
  }

  orders.unshift(newOrder)

  saveAllOrders(orders)

  return newOrder
}

export function getCustomerOrders(email) {
  if (!email) {
    return []
  }

  const orders = getAllOrders()

  return orders.filter(
    order =>
      order.customerEmail?.toLowerCase() ===
      email.toLowerCase(),
  )
}

export function getCustomerOrder(id, email) {
  const orders = getCustomerOrders(email)

  return orders.find(order => order.id === id)
}