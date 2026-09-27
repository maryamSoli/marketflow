import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import {
  useAddProduct,
  useAdminProducts,
  useDeleteProduct,
  useUpdateProduct,
} from '../../queries/useAdminProducts'
import { useCategories } from '../../queries/useCategories'

function AdminProducts() {
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const [form, setForm] = useState({
    title: '',
    price: '',
    stock: '',
    category: '',
  })

  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')

  const {
    data,
    isPending,
    isError,
    error,
  } = useAdminProducts()

  const {
    data: categories = [],
  } = useCategories()

  const addProduct = useAddProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()

  const products = data?.products || []

  const filteredProducts = useMemo(() => {
    const text = search.toLowerCase().trim()

    if (!text) {
      return products
    }

    return products.filter(product =>
      product.title.toLowerCase().includes(text) ||
      product.category.toLowerCase().includes(text),
    )
  }, [products, search])

  function openAddDialog() {
    setEditingProduct(null)

    setForm({
      title: '',
      price: '',
      stock: '',
      category: '',
    })

    setDialogOpen(true)
  }

  function openEditDialog(product) {
    setEditingProduct(product)

    setForm({
      title: product.title,
      price: product.price,
      stock: product.stock,
      category: product.category,
    })

    setDialogOpen(true)
  }

  function closeDialog() {
    if (
      addProduct.isPending ||
      updateProduct.isPending
    ) {
      return
    }

    setDialogOpen(false)
  }

  function handleChange(event) {
    const { name, value } = event.target

    setForm(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  function showMessage(text, type = 'success') {
    setMessage(text)
    setMessageType(type)
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (
      !form.title.trim() ||
      !form.price ||
      !form.stock ||
      !form.category
    ) {
      showMessage(
        'Please fill in all fields.',
        'error',
      )

      return
    }

    const productData = {
      title: form.title.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category,
    }

    if (editingProduct) {
      updateProduct.mutate(
        {
          id: editingProduct.id,
          ...productData,
        },
        {
          onSuccess: () => {
            showMessage('Product updated successfully.')
            setDialogOpen(false)
          },

          onError: mutationError => {
            showMessage(
              mutationError.message,
              'error',
            )
          },
        },
      )

      return
    }

    addProduct.mutate(productData, {
      onSuccess: () => {
        showMessage('Product added successfully.')
        setDialogOpen(false)
      },

      onError: mutationError => {
        showMessage(
          mutationError.message,
          'error',
        )
      },
    })
  }

  function handleDelete(product) {
    const confirmed = window.confirm(
      `Delete "${product.title}"?`,
    )

    if (!confirmed) {
      return
    }

    deleteProduct.mutate(product.id, {
      onSuccess: () => {
        showMessage('Product deleted successfully.')
      },

      onError: mutationError => {
        showMessage(
          mutationError.message,
          'error',
        )
      },
    })
  }

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
    },
    {
      field: 'title',
      headerName: 'Product',
      flex: 1,
      minWidth: 220,
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 170,
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 110,
      valueFormatter: value =>
        `$${Number(value).toFixed(2)}`,
    },
    {
      field: 'stock',
      headerName: 'Stock',
      width: 100,
    },
    {
      field: 'rating',
      headerName: 'Rating',
      width: 100,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      filterable: false,
      renderCell: params => (
        <Box
          sx={{
            display: 'flex',
            gap: 1,
          }}
        >
          <Button
            size="small"
            variant="outlined"
            onClick={() =>
              openEditDialog(params.row)
            }
          >
            Edit
          </Button>

          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={() =>
              handleDelete(params.row)
            }
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ]

  if (isPending) {
    return <Typography>Loading products...</Typography>
  }

  if (isError) {
    return (
      <Alert severity="error">
        {error.message}
      </Alert>
    )
  }

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          flexDirection: {
            xs: 'column',
            sm: 'row',
          },
          alignItems: {
            xs: 'stretch',
            sm: 'center',
          },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4">
            Products
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Manage your products
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={openAddDialog}
        >
          Add Product
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Search products"
        value={search}
        onChange={event =>
          setSearch(event.target.value)
        }
        sx={{ mb: 2 }}
      />

      <Box
        sx={{
          width: '100%',
          height: 600,
        }}
      >
        <DataGrid
          rows={filteredProducts}
          columns={columns}
          pageSizeOptions={[10, 20, 50]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
                page: 0,
              },
            },
          }}
          disableRowSelectionOnClick
        />
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingProduct
              ? 'Edit Product'
              : 'Add Product'}
          </DialogTitle>

          <DialogContent>
            <TextField
              fullWidth
              label="Product name"
              name="title"
              value={form.title}
              onChange={handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              margin="normal"
              inputProps={{
                min: 0,
                step: 0.01,
              }}
            />

            <TextField
              fullWidth
              label="Stock"
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              margin="normal"
              inputProps={{
                min: 0,
              }}
            />

            <TextField
              fullWidth
              select
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              margin="normal"
            >
              {categories.map(category => (
                <MenuItem
                  key={category}
                  value={category}
                >
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={closeDialog}
              disabled={
                addProduct.isPending ||
                updateProduct.isPending
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={
                addProduct.isPending ||
                updateProduct.isPending
              }
            >
              {addProduct.isPending ||
              updateProduct.isPending
                ? 'Saving...'
                : editingProduct
                  ? 'Update'
                  : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={!!message}
        autoHideDuration={3000}
        onClose={() => setMessage('')}
      >
        <Alert
          severity={messageType}
          onClose={() => setMessage('')}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default AdminProducts