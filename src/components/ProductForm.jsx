import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  MenuItem,
  TextField,
} from '@mui/material'
import { productSchema } from '../validation/schemas'

function ProductForm({
  product,
  categories,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: product?.title || '',
      price: product?.price?.toString() || '',
      stock: product?.stock?.toString() || '',
      category: product?.category || '',
    },
  })

  function submitForm(data) {
    onSubmit({
      title: data.title,
      price: Number(data.price),
      stock: Number(data.stock),
      category: data.category,
    })
  }

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      noValidate
      className="space-y-5"
    >
      <TextField
        label="Product name"
        fullWidth
        {...register('title')}
        error={!!errors.title}
        helperText={errors.title?.message}
      />

      <TextField
        label="Price"
        type="number"
        fullWidth
        {...register('price')}
        error={!!errors.price}
        helperText={errors.price?.message}
        slotProps={{
          htmlInput: {
            min: 0,
          },
        }}
      />

      <TextField
        label="Stock"
        type="number"
        fullWidth
        {...register('stock')}
        error={!!errors.stock}
        helperText={errors.stock?.message}
        slotProps={{
          htmlInput: {
            min: 0,
            step: 1,
          },
        }}
      />

      <TextField
        select
        label="Category"
        fullWidth
        defaultValue={product?.category || ''}
        {...register('category')}
        error={!!errors.category}
        helperText={errors.category?.message}
      >
        <MenuItem value="">
          Select a category
        </MenuItem>

        {categories?.map(category => (
          <MenuItem
            key={category}
            value={category}
          >
            {category}
          </MenuItem>
        ))}
      </TextField>

      <div className="flex justify-end gap-3">
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading
            ? 'Saving...'
            : product
              ? 'Update product'
              : 'Add product'}
        </Button>
      </div>
    </form>
  )
}

export default ProductForm