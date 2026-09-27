import { Typography } from '@mui/material'

function SellerDashboard() {
  return (
    <div>
      <Typography variant="h4">
        Seller Dashboard
      </Typography>

      <Typography
        variant="body1"
        sx={{ mt: 2 }}
      >
        Manage your products and orders here.
      </Typography>
    </div>
  )
}

export default SellerDashboard