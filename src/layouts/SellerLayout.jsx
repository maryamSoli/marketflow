import { Outlet, Link } from 'react-router'
import {
  AppBar,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'
import UserMenu from '../components/navigation/UserMenu'
import NotificationBell from '../components/navigation/NotificationBell'

const drawerWidth = 240

function SellerLayout() {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
      }}
    >
      <AppBar
        position="fixed"
        sx={{ zIndex: 1201 }}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6">
            MarketFlow Seller
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <NotificationBell />
            <UserMenu />
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />

        <List>
          <ListItemButton
            component={Link}
            to="/seller"
          >
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/seller/products"
          >
            <ListItemText primary="Products" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/seller/orders"
          >
            <ListItemText primary="Orders" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/seller/profile"
          >
            <ListItemText primary="Profile" />
          </ListItemButton>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

export default SellerLayout