import api from './api'

export async function getProducts({
  limit = 12,
  skip = 0,
  search = '',
  category = '',
  sortBy = '',
  order = 'asc',
}) {
  let url = '/products'

  if (category) {
    url = `/products/category/${category}`
  } else if (search) {
    url = '/products/search'
  }

  const params = {
    limit,
    skip,
  }

  if (search && !category) {
    params.q = search
  }

  if (sortBy) {
    params.sortBy = sortBy
    params.order = order
  }

  const response = await api.get(url, { params })

  return response.data
}

export async function getCategories() {
  const response = await api.get('/products/category-list')

  return response.data
}

export async function getProduct(id) {
  const response = await api.get(`/products/${id}`)

  return response.data
}