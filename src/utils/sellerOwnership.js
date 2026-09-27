const STORAGE_KEY = 'sellerProductOwners'

function getOwners() {
  const saved = localStorage.getItem(STORAGE_KEY)

  if (!saved) {
    return {}
  }

  try {
    return JSON.parse(saved)
  } catch {
    return {}
  }
}

function saveOwners(owners) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(owners),
  )
}

export function ensureProductOwners(
  productIds,
  sellerId,
) {
  const owners = getOwners()
  let changed = false

  productIds.forEach(id => {
    if (!owners[id]) {
      owners[id] = sellerId
      changed = true
    }
  })

  if (changed) {
    saveOwners(owners)
  }

  return owners
}

export function setProductOwner(
  productId,
  sellerId,
) {
  const owners = getOwners()

  owners[productId] = sellerId

  saveOwners(owners)
}

export function removeProductOwner(productId) {
  const owners = getOwners()

  delete owners[productId]

  saveOwners(owners)
}