const STORAGE_KEY = 'marketflowReviews'

function getAllReviews() {
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

function saveAllReviews(reviews) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(reviews),
  )
}

export function getLocalReviews(productId) {
  const reviews = getAllReviews()

  return reviews[productId] || []
}

export function addLocalReview(
  productId,
  review,
) {
  const reviews = getAllReviews()

  if (!reviews[productId]) {
    reviews[productId] = []
  }

  const newReview = {
    id: `local-${Date.now()}`,
    rating: review.rating,
    comment: review.comment,
    date: new Date().toISOString(),
    reviewerName: review.reviewerName,
    reviewerEmail: review.reviewerEmail,
    local: true,
  }

  reviews[productId].unshift(newReview)

  saveAllReviews(reviews)

  return newReview
}