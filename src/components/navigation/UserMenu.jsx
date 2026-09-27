import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { LogOut, User } from 'lucide-react'
import { logout } from '../../store/slices/authSlice'

function UserMenu() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector(state => state.auth.user)

  function handleLogout() {
    dispatch(logout())
    navigate('/login')
  }

  if (!user) {
    return (
      <Link
        to="/login"
        className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-100"
      >
        <User size={18} />
        Login
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-sm font-medium">
          {user.email}
        </p>

        <p className="text-xs capitalize text-gray-500">
          {user.role}
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-100"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  )
}

export default UserMenu
