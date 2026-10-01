import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
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
import ProductForm from '../../components/ProductForm'

function AdminProducts() {
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] =
    useState(null)

  const [message, setMessage] = useState('')
  const [messageType, setMessageType] =
    useState('success')

  const {
    data,
    isPending,
    isError,
    error,
  } = useAdminProducts()

  const {
    data: categories = [],
    isPending: categoriesLoading,
  } = useCategories()

  const addProduct = useAddProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()

  const products = Array.isArray(data)
    ? data
    : data?.products || []

  const filteredProducts = useMemo(() => {
    const text = search.toLowerCase().trim()

    if (!text) {
      return products
    }

    return products.filter(product =>
      product.title
        ?.toLowerCase()
        .includes(text) ||
      product.category
        ?.toLowerCase()
        .includes(text),
    )
  }, [products, search])

  function openAddDialog() {
    setEditingProduct(null)
    setDialogOpen(true)
  }

  function openEditDialog(product) {
    setEditingProduct(product)
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
    setEditingProduct(null)
  }

  function showMessage(
    text,
    type = 'success',
  ) {
    setMessage(text)
    setMessageType(type)
  }

  function handleSubmit(productData) {
    if (editingProduct) {
      updateProduct.mutate(
        {
          id: editingProduct.id,
          product: productData,
        },
        {
          onSuccess: () => {
            showMessage(
              'Product updated successfully.',
            )
            closeDialog()
          },

          onError: mutationError => {
            showMessage(
              mutationError.message ||
                'Failed to update product.',
              'error',
            )
          },
        },
      )

      return
    }

    addProduct.mutate(productData, {
      onSuccess: () => {
        showMessage(
          'Product added successfully.',
        )
        closeDialog()
      },

      onError: mutationError => {
        showMessage(
          mutationError.message ||
            'Failed to add product.',
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
        showMessage(
          'Product deleted successfully.',
        )
      },

      onError: mutationError => {
        showMessage(
          mutationError.message ||
            'Failed to delete product.',
          'error',
        )
      },
    })
  }

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
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
      valueFormatter: value =>
        value == null
          ? '0.0'
          : Number(value).toFixed(1),
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
            alignItems: 'center',
            height: '100%',
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
            disabled={deleteProduct.isPending}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ]

  if (isPending || categoriesLoading) {
    return (
      <Typography>
        Loading products...
      </Typography>
    )
  }

  if (isError) {
    return (
      <Alert severity="error">
        {error?.message ||
          'Failed to load products.'}
      </Alert>
    )
  }

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: {
            xs: 'stretch',
            sm: 'center',
          },
          flexDirection: {
            xs: 'column',
            sm: 'row',
          },
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
                page: 0,
                pageSize: 10,
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
        <DialogTitle>
          {editingProduct
            ? 'Edit Product'
            : 'Add Product'}
        </DialogTitle>

        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <ProductForm
              product={editingProduct}
              categories={categories}
              onSubmit={handleSubmit}
              onCancel={closeDialog}
              loading={
                addProduct.isPending ||
                updateProduct.isPending
              }
            />
          </Box>
        </DialogContent>
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