export type BookingRequest = {
  fullName: string
  phone: string
  email: string
  checkIn: string
  checkOut: string
  room: string
  wishes: string
  consent: boolean
}

export async function sendBookingRequest(request: BookingRequest): Promise<void> {
  const endpoint = import.meta.env.VITE_BOOKING_ENDPOINT

  if (!endpoint) {
    return
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error('Не удалось отправить заявку. Попробуйте ещё раз позже.')
  }
}
