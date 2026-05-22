import React, { useEffect, useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import { api } from '../api';

export default function Home() {
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Rasmy Rentals</h1>
          <p className="text-gray-600">Find and book your perfect rental property</p>
        </div>

        {loading && <p className="text-center text-gray-500 text-xl">Loading properties...</p>}

        {!loading && properties.length === 0 && (
          <p className="text-center text-gray-500">No properties available yet.</p>
        )}

        {!loading && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <a
            href="/admin"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
          >
            Admin Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
