const API_BASE = '/api';

export const api = {
  // Properties
  async getProperties() {
    const response = await fetch(`${API_BASE}/properties`);
    if (!response.ok) throw new Error('Failed to fetch properties');
    return response.json();
  },

  async addProperty(name, dailyPrice, imageUrl) {
    const response = await fetch(`${API_BASE}/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, dailyPrice, imageUrl })
    });
    if (!response.ok) throw new Error('Failed to add property');
    return response.json();
  },

  // Bookings
  async getBookings(propertyId) {
    const response = await fetch(`${API_BASE}/properties/${propertyId}/bookings`);
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return response.json();
  },

  async addBooking(propertyId, startDate, endDate) {
    const response = await fetch(`${API_BASE}/properties/${propertyId}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate, endDate })
    });
    if (!response.ok) throw new Error('Failed to add booking');
    return response.json();
  }
};
