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

function applyLocalChanges(products) {
  const changes = getChanges()

  const deletedIds = new Set(
    (changes.deleted || []).map(id =>
      Number(id),
    ),
  )

  const updatedProducts = products
    .filter(
      product =>
        !deletedIds.has(
          Number(product.id),
        ),
    )
    .map(product => {
      const updated =
        changes.updated?.[
          Number(product.id)
        ] ||
        changes.updated?.[
          String(product.id)
        ]

      if (!updated) {
        return product
      }

      return {
        ...product,
        ...updated,
      }
    })

  const addedProducts = (
    changes.added || []
  ).filter(
    product =>
      !deletedIds.has(
        Number(product.id),
      ),
  )

  const existingIds = new Set(
    updatedProducts.map(product =>
      Number(product.id),
    ),
  )

  const localAddedProducts =
    addedProducts.filter(
      product =>
        !existingIds.has(
          Number(product.id),
        ),
    )

  return [
    ...updatedProducts,
    ...localAddedProducts,
  ]
}

function isLocallyAddedProduct(id) {
  const numericId = Number(id)
  const changes = getChanges()

  return changes.added.some(
    product =>
      Number(product.id) === numericId,
  )
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

  let products = applyLocalChanges(
    response.data?.products || [],
  )

  if (search) {
    const searchValue =
      search.toLowerCase().trim()

    products = products.filter(
      product =>
        product.title
          ?.toLowerCase()
          .includes(searchValue),
    )
  }

  if (category) {
    products = products.filter(
      product =>
        product.category === category,
    )
  }

  if (sortBy === 'price') {
    products = [...products].sort(
      (a, b) =>
        order === 'desc'
          ? b.price - a.price
          : a.price - b.price,
    )
  }

  if (sortBy === 'title') {
    products = [...products].sort(
      (a, b) =>
        order === 'desc'
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title),
    )
  }

  return {
    ...response.data,
    products,
    total: products.length,
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

  if (
    changes.deleted.some(
      deletedId =>
        Number(deletedId) === numericId,
    )
  ) {
    return null
  }

  const localProduct =
    changes.added.find(
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

  let serverProduct = {}

  if (!isLocallyAddedProduct(numericId)) {
    const response = await api.put(
      `/products/${numericId}`,
      product,
    )

    serverProduct = response.data || {}
  }

  const changes = getChanges()

  const updatedProduct = {
    ...product,
    ...serverProduct,
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

  const alreadyDeleted =
    changes.deleted.some(
      deletedId =>
        Number(deletedId) === numericId,
    )

  if (!alreadyDeleted) {
    changes.deleted.push(numericId)
  }

  saveChanges(changes)

  return numericId
}