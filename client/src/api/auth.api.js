import api from './axios'

export async function login(credentials) {
  const res = await api.post('/auth/login', credentials)
  return res.data
}

export async function register(payload) {
  const res = await api.post('/auth/register', payload)
  return res.data
}

export async function updateProfile(payload) {
  const res = await api.patch('/auth/profile', payload)
  return res.data
}
