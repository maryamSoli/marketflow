import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

async function getUsers() {
  const response = await api.get('/users', {
    params: {
      limit: 0,
    },
  })

  return response.data
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })
}
