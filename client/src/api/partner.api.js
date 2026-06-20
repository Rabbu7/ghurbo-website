import api from './axios'

export async function applyPartner(payload) {
  const res = await api.post('/partners/apply', payload)
  return res.data
}

export async function getPartnerDashboard() {
  const res = await api.get('/partners/dashboard')
  return res.data
}

export async function addOperator(payload) {
  const res = await api.post('/partners/operators', payload)
  return res.data
}

export async function updateOperator(id, payload) {
  const res = await api.put(`/partners/operators/${id}`, payload)
  return res.data
}
