import React, { useEffect, useState } from 'react';
import PropertyForm from '../components/PropertyForm';
import BookingForm from '../components/BookingForm';
import { api } from '../api';

export default function Admin() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    setLoading(true);
    try {
      const data = await api.getProperties();
      setProperties(data.properties);
    } catch (error) {
      console.error('Error loading properties:', error);
    }
    setLoading(false);
  }

  const handlePropertyAdded = () => {
    loadProperties();
  };

  const handleBookingAdded = () => {
    loadProperties();
  };

  const handleDeleteProperty = async (propertyId, propertyName) => {
    if (window.confirm(`Are you sure you want to delete "${propertyName}"? This cannot be undone.`)) {
      try {
        await api.deleteProperty(propertyId);
        loadProperties();
      } catch (error) {
        alert('Failed to delete property: ' + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage properties and bookings</p>
          <a
            href="/"
            className="inline-block mt-4 px-4 py-2 text-blue-600 font-semibold hover:text-blue-700"
          >
            ← Back to Properties
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PropertyForm onPropertyAdded={handlePropertyAdded} />
          <BookingForm properties={properties} onBookingAdded={handleBookingAdded} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Properties Overview</h2>

          {loading && <p className="text-gray-500">Loading...</p>}

          {!loading && properties.length === 0 && (
            <p className="text-gray-500">No properties yet. Add one using the form above.</p>
          )}

          {!loading && properties.length > 0 && (
            <div className="space-y-4">
              {properties.map(property => (
                <div key={property.id} className="border-l-4 border-blue-500 pl-4 py-2 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{property.name}</h3>
                    <p className="text-gray-600">${property.dailyPrice}/night</p>
                    <p className="text-sm text-gray-500">
                      Bookings: {property.bookings.length}
                      {property.bookings.length > 0 && (
                        <span>
                          {' '}
                          ({property.bookings.map(b => `${b.startDate} to ${b.endDate}`).join(', ')})
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteProperty(property.id, property.name)}
                    className="px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
