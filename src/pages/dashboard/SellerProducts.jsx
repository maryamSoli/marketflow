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
  useAddSellerProduct,
  useDeleteSellerProduct,
  useSellerProducts,
  useUpdateSellerProduct,
} from '../../queries/useSellerProducts'
import { useCategories } from '../../queries/useCategories'
import ProductForm from '../../components/ProductForm'

function SellerProducts() {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')

  const {
    data: products = [],
    isLoading,
    isError,
  } = useSellerProducts()

  const { data: categories = [] } = useCategories()

  const addProduct = useAddSellerProduct()
  const updateProduct = useUpdateSellerProduct()
  const deleteProduct = useDeleteSellerProduct()

  const filteredProducts = useMemo(() => {
    const value = search.toLowerCase().trim()

    if (!value) {
      return products
    }

    return products.filter(product =>
      product.title.toLowerCase().includes(value),
    )
  }, [products, search])

  function openAddDialog() {
    setEditingProduct(null)
    setOpen(true)
  }

  function openEditDialog(product) {
    setEditingProduct(product)
    setOpen(true)
  }

  function closeDialog() {
    if (
      addProduct.isPending ||
      updateProduct.isPending
    ) {
      return
    }

    setOpen(false)
    setEditingProduct(null)
  }

  function showMessage(text, type = 'success') {
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
            closeDialog()
            showMessage('Product updated successfully.')
          },
          onError: () => {
            showMessage(
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
        closeDialog()
        showMessage('Product added successfully.')
      },
      onError: () => {
        showMessage(
          'Failed to add product.',
          'error',
        )
      },
    })
  }

  function handleDelete(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product?',
    )

    if (!confirmed) {
      return
    }

    deleteProduct.mutate(id, {
      onSuccess: () => {
        showMessage('Product deleted successfully.')
      },
      onError: () => {
        showMessage(
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
      width: 160,
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
        Number(value).toFixed(1),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 190,
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
              handleDelete(params.row.id)
            }
            disabled={deleteProduct.isPending}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ]

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            My Products
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Manage your products and inventory
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

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load your products.
        </Alert>
      )}

      <Box
        sx={{
          height: 600,
          width: '100%',
          backgroundColor: 'background.paper',
          borderRadius: 2,
        }}
      >
        <DataGrid
          rows={filteredProducts}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[5, 10, 25]}
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
        open={open}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingProduct
            ? 'Edit Product'
            : 'Add Product'}
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
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

export default SellerProducts