import {
  Alert,
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from '@mui/material'
import { useDashboardData } from '../../queries/useDashboardData'

function Dashboard() {
  const {
    data,
    isPending,
    isError,
    error,
    isFetching,
  } = useDashboardData()

  if (isPending) {
    return (
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Dashboard
        </Typography>

        <LinearProgress />
      </Box>
    )
  }

  if (isError) {
    return (
      <Alert severity="error">
        {error.message}
      </Alert>
    )
  }

  const users = data.users
  const products = data.products
  const carts = data.carts

  const totalRevenue = carts.carts.reduce(
    (sum, cart) => sum + cart.discountedTotal,
    0,
  )

  const totalItems = carts.carts.reduce(
    (sum, cart) =>
      sum +
      cart.products.reduce(
        (productTotal, product) =>
          productTotal + product.quantity,
        0,
      ),
    0,
  )

  const averageCartValue =
    carts.carts.length > 0
      ? totalRevenue / carts.carts.length
      : 0

  const recentCarts = carts.carts.slice(0, 5)

  const topProducts = {}

  carts.carts.forEach(cart => {
    cart.products.forEach(product => {
      if (!topProducts[product.title]) {
        topProducts[product.title] = {
          title: product.title,
          quantity: 0,
          total: 0,
        }
      }

      topProducts[product.title].quantity +=
        product.quantity

      topProducts[product.title].total +=
        product.discountedTotal
    })
  })

  const topProductsList = Object.values(topProducts)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)

  return (
    <Box>
      {isFetching && (
        <LinearProgress sx={{ mb: 2 }} />
      )}

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">
          Dashboard
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Overview of your MarketFlow store
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card>
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Total Users
              </Typography>

              <Typography
                variant="h4"
                sx={{ mt: 1 }}
              >
                {users.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card>
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Total Products
              </Typography>

              <Typography
                variant="h4"
                sx={{ mt: 1 }}
              >
                {products.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card>
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Total Carts
              </Typography>

              <Typography
                variant="h4"
                sx={{ mt: 1 }}
              >
                {carts.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card>
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Revenue
              </Typography>

              <Typography
                variant="h4"
                sx={{ mt: 1 }}
              >
                ${totalRevenue.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ mb: 2 }}
              >
                Store Summary
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: '1fr 1fr',
                  },
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Items in carts
                  </Typography>

                  <Typography variant="h6">
                    {totalItems}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Average cart value
                  </Typography>

                  <Typography variant="h6">
                    ${averageCartValue.toFixed(2)}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Users per product
                  </Typography>

                  <Typography variant="h6">
                    {products.total
                      ? (
                          users.total /
                          products.total
                        ).toFixed(1)
                      : '0'}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Revenue per cart
                  </Typography>

                  <Typography variant="h6">
                    ${averageCartValue.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ mb: 2 }}
              >
                Top Products
              </Typography>

              {topProductsList.length === 0 ? (
                <Typography color="text.secondary">
                  No product data available.
                </Typography>
              ) : (
                <Box>
                  {topProductsList.map(product => (
                    <Box
                      key={product.title}
                      sx={{
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {product.title}
                      </Typography>

                      <Typography
                        color="text.secondary"
                        sx={{
                          flexShrink: 0,
                        }}
                      >
                        {product.quantity} sold
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ mb: 2 }}
              >
                Recent Carts
              </Typography>

              <TableContainer
                component={Paper}
                variant="outlined"
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        Cart ID
                      </TableCell>

                      <TableCell>
                        User ID
                      </TableCell>

                      <TableCell>
                        Products
                      </TableCell>

                      <TableCell>
                        Total
                      </TableCell>

                      <TableCell>
                        Discounted Total
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {recentCarts.map(cart => (
                      <TableRow key={cart.id}>
                        <TableCell>
                          #{cart.id}
                        </TableCell>

                        <TableCell>
                          #{cart.userId}
                        </TableCell>

                        <TableCell>
                          {cart.totalProducts}
                        </TableCell>

                        <TableCell>
                          ${cart.total.toFixed(2)}
                        </TableCell>

                        <TableCell>
                          $
                          {cart.discountedTotal.toFixed(
                            2,
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard