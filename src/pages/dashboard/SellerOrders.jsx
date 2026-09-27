import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { X } from 'lucide-react'
import { useSellerOrders } from '../../queries/useSellerOrders'

function SellerOrders() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)

  const {
    data,
    isPending,
    isError,
    error,
  } = useSellerOrders()

  const orders = data?.carts || []

  const filteredOrders = useMemo(() => {
    const text = search.toLowerCase().trim()

    return orders.filter(order => {
      const matchesSearch =
        !text ||
        String(order.id).includes(text) ||
        String(order.userId).includes(text)

      const matchesStatus =
        !status || order.status === status

      return matchesSearch && matchesStatus
    })
  }, [orders, search, status])

  function getStatusColor(orderStatus) {
    if (orderStatus === 'Delivered') {
      return 'success'
    }

    if (orderStatus === 'Shipped') {
      return 'info'
    }

    if (orderStatus === 'Processing') {
      return 'warning'
    }

    return 'default'
  }

  const columns = [
    {
      field: 'id',
      headerName: 'Order ID',
      width: 100,
      renderCell: params => `#${params.value}`,
    },
    {
      field: 'userId',
      headerName: 'Customer',
      width: 110,
      renderCell: params =>
        `User #${params.value}`,
    },
    {
      field: 'sellerQuantity',
      headerName: 'Items',
      width: 90,
    },
    {
      field: 'sellerTotal',
      headerName: 'Seller Total',
      width: 130,
      valueFormatter: value =>
        `$${Number(value).toFixed(2)}`,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: params => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Action',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: params => (
        <button
          onClick={() =>
            setSelectedOrder(params.row)
          }
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View
        </button>
      ),
    },
  ]

  if (isPending) {
    return (
      <Typography>
        Loading orders...
      </Typography>
    )
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
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">
          My Orders
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Orders containing your products
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '2fr 1fr',
          },
          gap: 2,
          mb: 2,
        }}
      >
        <TextField
          label="Search orders"
          value={search}
          onChange={event =>
            setSearch(event.target.value)
          }
          fullWidth
        />

        <TextField
          select
          label="Status"
          value={status}
          onChange={event =>
            setStatus(event.target.value)
          }
          fullWidth
        >
          <MenuItem value="">
            All statuses
          </MenuItem>

          <MenuItem value="Pending">
            Pending
          </MenuItem>

          <MenuItem value="Processing">
            Processing
          </MenuItem>

          <MenuItem value="Shipped">
            Shipped
          </MenuItem>

          <MenuItem value="Delivered">
            Delivered
          </MenuItem>
        </TextField>
      </Box>

      <Box
        sx={{
          width: '100%',
          height: 600,
        }}
      >
        <DataGrid
          rows={filteredOrders}
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
        open={!!selectedOrder}
        onClose={() =>
          setSelectedOrder(null)
        }
        fullWidth
        maxWidth="md"
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              Order #{selectedOrder.id}

              <IconButton
                onClick={() =>
                  setSelectedOrder(null)
                }
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                }}
              >
                <X size={20} />
              </IconButton>
            </DialogTitle>

            <DialogContent>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: '1fr 1fr',
                  },
                  gap: 2,
                  mb: 4,
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Customer
                  </Typography>

                  <Typography>
                    User #{selectedOrder.userId}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Status
                  </Typography>

                  <Chip
                    label={selectedOrder.status}
                    color={getStatusColor(
                      selectedOrder.status,
                    )}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    My items
                  </Typography>

                  <Typography>
                    {selectedOrder.sellerQuantity}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    My total
                  </Typography>

                  <Typography fontWeight="bold">
                    $
                    {selectedOrder.sellerTotal.toFixed(
                      2,
                    )}
                  </Typography>
                </Box>
              </Box>

              <Typography
                variant="h6"
                sx={{ mb: 2 }}
              >
                My Products in This Order
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                {selectedOrder.products.map(product => (
                  <Box
                    key={product.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      pb: 2,
                    }}
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: 'cover',
                        borderRadius: 8,
                      }}
                    />

                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight="medium">
                        {product.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Quantity: {product.quantity}
                      </Typography>
                    </Box>

                    <Typography>
                      $
                      {product.discountedTotal.toFixed(
                        2,
                      )}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  )
}

export default SellerOrders
