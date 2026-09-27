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
import { useUsers } from '../../queries/useUsers'

function Users() {
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)

  const {
    data,
    isPending,
    isError,
    error,
  } = useUsers()

  const users = data?.users || []

  const filteredUsers = useMemo(() => {
    const text = search.toLowerCase().trim()

    return users.filter(user => {
      const matchesSearch =
        !text ||
        user.firstName.toLowerCase().includes(text) ||
        user.lastName.toLowerCase().includes(text) ||
        user.email.toLowerCase().includes(text) ||
        String(user.id).includes(text)

      const matchesRole =
        !role || user.role === role

      return matchesSearch && matchesRole
    })
  }, [users, search, role])

  function getRoleColor(userRole) {
    if (userRole === 'admin') {
      return 'error'
    }

    if (userRole === 'moderator') {
      return 'warning'
    }

    return 'default'
  }

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
    },
    {
      field: 'firstName',
      headerName: 'First Name',
      width: 130,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      width: 130,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 220,
    },
    {
      field: 'username',
      headerName: 'Username',
      width: 140,
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 120,
      renderCell: params => (
        <Chip
          label={params.value}
          color={getRoleColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 160,
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
            setSelectedUser(params.row)
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
        Loading users...
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
          Users
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Manage registered users
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
          label="Search users"
          value={search}
          onChange={event =>
            setSearch(event.target.value)
          }
          fullWidth
        />

        <TextField
          select
          label="Role"
          value={role}
          onChange={event =>
            setRole(event.target.value)
          }
          fullWidth
        >
          <MenuItem value="">
            All roles
          </MenuItem>

          <MenuItem value="admin">
            Admin
          </MenuItem>

          <MenuItem value="moderator">
            Moderator
          </MenuItem>

          <MenuItem value="user">
            User
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
          rows={filteredUsers}
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
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        fullWidth
        maxWidth="sm"
      >
        {selectedUser && (
          <>
            <DialogTitle>
              User Details

              <IconButton
                onClick={() =>
                  setSelectedUser(null)
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
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Name
                  </Typography>

                  <Typography>
                    {selectedUser.firstName}{' '}
                    {selectedUser.lastName}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Username
                  </Typography>

                  <Typography>
                    {selectedUser.username}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Email
                  </Typography>

                  <Typography>
                    {selectedUser.email}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Phone
                  </Typography>

                  <Typography>
                    {selectedUser.phone}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Role
                  </Typography>

                  <Chip
                    label={selectedUser.role}
                    color={getRoleColor(
                      selectedUser.role,
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
                    Age
                  </Typography>

                  <Typography>
                    {selectedUser.age}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  )
}

export default Users
