import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import api from '../services/api'
import {
  addLocalReview,
  getLocalReviews,
} from '../utils/reviewStorage'

async function getProductReviews(productId) {
  const response = await api.get(
    `/products/${productId}`,
  )

  const apiReviews = response.data.reviews || []
  const localReviews = getLocalReviews(
    productId,
  )

  return [
    ...localReviews,
    ...apiReviews,
  ]
}

export function useProductReviews(productId) {
  return useQuery({
    queryKey: [
      'product-reviews',
      productId,
    ],
    queryFn: () =>
      getProductReviews(productId),
    enabled: !!productId,
  })
}

export function useAddReview(productId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: review =>
      addLocalReview(productId, review),

    onSuccess: newReview => {
      queryClient.setQueryData(
        [
          'product-reviews',
          productId,
        ],
        oldReviews => [
          newReview,
          ...(oldReviews || []),
        ],
      )
    },
  })
}