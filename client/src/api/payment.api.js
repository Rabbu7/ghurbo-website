import api from './axios'

export async function initiatePayment(payload) {
  const res = await api.post('/payments/initiate', payload)
  return res.data
}

export async function confirmPaymentWebhook(payload) {
  const res = await api.post('/payments/webhook', payload)
  return res.data
}

export async function getPaymentStatus(bookingId) {
  const res = await api.get(`/payments/${bookingId}`)
  return res.data
}
