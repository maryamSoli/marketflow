
import api from './api'

const STORAGE_KEY = 'marketflowProductChanges'

function getDefaultChanges() {
  return {
    added: [],
    updated: {},
    deleted: [],
  }
}

function getChanges() {
  const saved = localStorage.getItem(
    STORAGE_KEY,
  )

  if (!saved) {
    return getDefaultChanges()
  }

  try {
    const changes = JSON.parse(saved)

    return {
      added: Array.isArray(changes.added)
        ? changes.added
        : [],
      updated:
        changes.updated &&
        typeof changes.updated === 'object'
          ? changes.updated
          : {},
      deleted: Array.isArray(changes.deleted)
        ? changes.deleted
        : [],
    }
  } catch {
    return getDefaultChanges()
  }
}

function saveChanges(changes) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(changes),
  )
}

function getLocalAddedProducts() {
  const changes = getChanges()

  return changes.added || []
}

function getDeletedIds() {
  const changes = getChanges()

  return new Set(
    (changes.deleted || []).map(id =>
      Number(id),
    ),
  )
}

function getUpdatedProduct(id) {
  const changes = getChanges()

  return (
    changes.updated?.[id] ||
    changes.updated?.[String(id)]
  )
}

function isLocallyAddedProduct(id) {
  const numericId = Number(id)
  const changes = getChanges()

  return changes.added.some(
    product =>
      Number(product.id) === numericId,
  )
}

function matchesProductFilters(
  product,
  search,
  category,
) {
  if (search) {
    const searchValue =
      search.toLowerCase().trim()

    if (
      !product.title
        ?.toLowerCase()
        .includes(searchValue)
    ) {
      return false
    }
  }

  if (
    category &&
    product.category !== category
  ) {
    return false
  }

  return true
}

function sortProducts(
  products,
  sortBy,
  order,
) {
  if (!sortBy) {
    return products
  }

  const sorted = [...products]

  if (sortBy === 'price') {
    sorted.sort((a, b) =>
      order === 'desc'
        ? Number(b.price) -
          Number(a.price)
        : Number(a.price) -
          Number(b.price),
    )
  }

  if (sortBy === 'title') {
    sorted.sort((a, b) =>
      order === 'desc'
        ? b.title.localeCompare(a.title)
        : a.title.localeCompare(b.title),
    )
  }

  if (sortBy === 'rating') {
    sorted.sort((a, b) =>
      order === 'desc'
        ? Number(b.rating || 0) -
          Number(a.rating || 0)
        : Number(a.rating || 0) -
          Number(b.rating || 0),
    )
  }

  return sorted
}

export async function getProducts({
  limit = 12,
  skip = 0,
  search = '',
  category = '',
  sortBy = '',
  order = 'asc',
} = {}) {
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

  const response = await api.get(url, {
    params,
  })

  const changes = getChanges()
  const deletedIds = getDeletedIds()

  let products = (
    response.data?.products || []
  ).filter(
    product =>
      !deletedIds.has(
        Number(product.id),
      ),
  )

  products = products.map(product => {
    const updated = getUpdatedProduct(
      product.id,
    )

    if (!updated) {
      return product
    }

    return {
      ...product,
      ...updated,
    }
  })

  const localAddedProducts =
    getLocalAddedProducts().filter(
      product =>
        !deletedIds.has(
          Number(product.id),
        ) &&
        matchesProductFilters(
          product,
          search,
          category,
        ),
    )

  if (skip === 0) {
    products = [
      ...products,
      ...localAddedProducts,
    ]
  }

  products = sortProducts(
    products,
    sortBy,
    order,
  )

  const baseTotal = Number(
    response.data?.total || 0,
  )

  const total =
    baseTotal + localAddedProducts.length

  return {
    ...response.data,
    products,
    total,
  }
}

export async function getCategories() {
  const response = await api.get(
    '/products/category-list',
  )

  return response.data
}

export async function getProduct(id) {
  const numericId = Number(id)
  const changes = getChanges()

  const isDeleted =
    (changes.deleted || []).some(
      deletedId =>
        Number(deletedId) === numericId,
    )

  if (isDeleted) {
    return null
  }

  const localProduct =
    (changes.added || []).find(
      product =>
        Number(product.id) === numericId,
    )

  if (localProduct) {
    return localProduct
  }

  const response = await api.get(
    `/products/${numericId}`,
  )

  const updated =
    changes.updated?.[numericId] ||
    changes.updated?.[String(numericId)]

  if (updated) {
    return {
      ...response.data,
      ...updated,
    }
  }

  return response.data
}

export async function addProduct(product) {
  const response = await api.post(
    '/products/add',
    product,
  )

  const changes = getChanges()

  const newProduct = {
    ...response.data,
    ...product,
    id: Date.now(),
    rating: 0,
  }

  changes.added.push(newProduct)

  saveChanges(changes)

  return newProduct
}

export async function updateProduct(
  id,
  product,
) {
  const numericId = Number(id)

  if (!isLocallyAddedProduct(numericId)) {
    await api.put(
      `/products/${numericId}`,
      product,
    )
  }

  const changes = getChanges()

  const updatedProduct = {
    ...product,
    id: numericId,
  }

  const addedIndex =
    changes.added.findIndex(
      item =>
        Number(item.id) === numericId,
    )

  if (addedIndex !== -1) {
    changes.added[addedIndex] = {
      ...changes.added[addedIndex],
      ...updatedProduct,
    }
  } else {
    changes.updated[numericId] =
      updatedProduct
  }

  saveChanges(changes)

  return updatedProduct
}

export async function deleteProduct(id) {
  const numericId = Number(id)

  if (!isLocallyAddedProduct(numericId)) {
    await api.delete(
      `/products/${numericId}`,
    )
  }

  const changes = getChanges()

  changes.added =
    changes.added.filter(
      product =>
        Number(product.id) !== numericId,
    )

  delete changes.updated[numericId]
  delete changes.updated[String(numericId)]

  if (
    !changes.deleted.some(
      deletedId =>
        Number(deletedId) === numericId,
    )
  ) {
    changes.deleted.push(numericId)
  }

  saveChanges(changes)

  return numericId
}
