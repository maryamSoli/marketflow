import { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Alert,
  Box,
  Button,
  Rating,
  TextField,
  Typography,
} from '@mui/material'
import {
  useAddReview,
  useProductReviews,
} from '../queries/useProductReviews'

function ReviewSection({ productId }) {
  const user = useSelector(
    state => state.auth.user,
  )

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [errorMessage, setErrorMessage] =
    useState('')

  const {
    data: reviews = [],
    isPending,
    isError,
  } = useProductReviews(productId)

  const addReview = useAddReview(productId)

  function handleSubmit(event) {
    event.preventDefault()

    if (!user) {
      setErrorMessage(
        'Please log in to write a review.',
      )
      return
    }

    if (rating === 0) {
      setErrorMessage(
        'Please select a rating.',
      )
      return
    }

    if (!comment.trim()) {
      setErrorMessage(
        'Please write a review.',
      )
      return
    }

    setErrorMessage('')

    addReview.mutate(
      {
        rating,
        comment: comment.trim(),
        reviewerName:
          user.email.split('@')[0],
        reviewerEmail: user.email,
      },
      {
        onSuccess: () => {
          setRating(0)
          setComment('')
        },
        onError: mutationError => {
          setErrorMessage(
            mutationError.message,
          )
        },
      },
    )
  }

  return (
    <section className="mt-12">
      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: 600 }}
      >
        Customer Reviews
      </Typography>

      {user ? (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mb: 5,
            p: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2 }}
          >
            Write a review
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Rating
              value={rating}
              onChange={(_, value) =>
                setRating(value || 0)
              }
            />
          </Box>

          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Your review"
            value={comment}
            onChange={event =>
              setComment(event.target.value)
            }
          />

          {errorMessage && (
            <Alert
              severity="error"
              sx={{ mt: 2 }}
            >
              {errorMessage}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
            disabled={addReview.isPending}
          >
            {addReview.isPending
              ? 'Submitting...'
              : 'Submit Review'}
          </Button>
        </Box>
      ) : (
        <Alert sx={{ mb: 4 }} severity="info">
          Log in to write a review.
        </Alert>
      )}

      {isPending && (
        <Typography color="text.secondary">
          Loading reviews...
        </Typography>
      )}

      {isError && (
        <Alert severity="error">
          Failed to load reviews.
        </Alert>
      )}

      {!isPending &&
        !isError &&
        reviews.length === 0 && (
          <Box className="rounded-lg bg-white p-6">
            <Typography color="text.secondary">
              No reviews yet.
            </Typography>
          </Box>
        )}

      {!isPending &&
        !isError &&
        reviews.length > 0 && (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <Box
                key={`${review.id ?? 'review'}-${review.reviewerEmail ?? 'user'}-${review.date ?? 'date'}-${index}`}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: {
                      xs: 'column',
                      sm: 'row',
                    },
                    justifyContent:
                      'space-between',
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <Typography fontWeight={600}>
                    {review.reviewerName}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {new Date(
                      review.date,
                    ).toLocaleDateString()}
                  </Typography>
                </Box>

                <Rating
                  value={review.rating}
                  readOnly
                  size="small"
                />

                <Typography
                  sx={{ mt: 1.5 }}
                  color="text.secondary"
                >
                  {review.comment}
                </Typography>
              </Box>
            ))}
          </div>
        )}
    </section>
  )
}

export default ReviewSection