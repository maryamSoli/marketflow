import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Badge,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import { Bell, Check, Trash2 } from 'lucide-react'
import {
  clearNotifications,
  markAllAsRead,
  markAsRead,
  removeNotification,
} from '../../store/slices/notificationSlice'

function NotificationBell() {
  const dispatch = useDispatch()

  const notifications = useSelector(
    state => state.notifications.items,
  )

  const unreadCount = notifications.filter(
    notification => !notification.read,
  ).length

  const [anchorEl, setAnchorEl] =
    useState(null)

  const menuOpen = Boolean(anchorEl)

  function handleOpen(event) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  function handleMarkRead(id) {
    dispatch(markAsRead(id))
  }

  function handleMarkAllRead() {
    dispatch(markAllAsRead())
  }

  function handleRemove(id) {
    dispatch(removeNotification(id))
  }

  function handleClear() {
    dispatch(clearNotifications())
    handleClose()
  }

  return (
    <>
      <IconButton
        onClick={handleOpen}
        color="inherit"
        aria-label="notifications"
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
        >
          <Bell size={21} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: {
              xs: 320,
              sm: 380,
            },
            maxWidth: 'calc(100vw - 24px)',
            maxHeight: 500,
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography fontWeight={600}>
            Notifications
          </Typography>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-blue-600 hover:underline"
            >
              Mark all as read
            </button>
          )}
        </Box>

        <Divider />

        {notifications.length === 0 ? (
          <Box sx={{ p: 3 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              No notifications.
            </Typography>
          </Box>
        ) : (
          notifications.map(notification => (
            <MenuItem
              key={notification.id}
              sx={{
                display: 'block',
                whiteSpace: 'normal',
                py: 1.5,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 1.5,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    fontWeight={
                      notification.read
                        ? 400
                        : 600
                    }
                  >
                    {notification.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {notification.message}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 1 }}
                  >
                    {new Date(
                      notification.createdAt,
                    ).toLocaleString()}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                  }}
                >
                  {!notification.read && (
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleMarkRead(
                          notification.id,
                        )
                      }
                      title="Mark as read"
                    >
                      <Check size={16} />
                    </IconButton>
                  )}

                  <IconButton
                    size="small"
                    onClick={() =>
                      handleRemove(
                        notification.id,
                      )
                    }
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </Box>
              </Box>
            </MenuItem>
          ))
        )}

        {notifications.length > 0 && (
          <>
            <Divider />

            <Box sx={{ p: 1 }}>
              <button
                onClick={handleClear}
                className="w-full rounded px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Clear all notifications
              </button>
            </Box>
          </>
        )}
      </Menu>
    </>
  )
}

export default NotificationBell