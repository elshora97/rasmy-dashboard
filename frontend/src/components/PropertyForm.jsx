import React, { useState } from 'react';
import { api } from '../api';

export default function PropertyForm({ onPropertyAdded }) {
const imageAdress = "https://imgs.search.brave.com/-otu7X_pe7MdGWAf0qR0RxBdzPudWmB4WjgBAJiP5EY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/bmV3YXFhci5uZXQv/MjAyMi8wNC8lRDkl/ODIlRDglQjElRDkl/OEElRDglQTktJUQ4/JUE4JUQ5JThBJUQ4/JUE3JUQ5JTg2JUQ5/JTgzJUQ5JThBLSVE/OCVBNyVEOSU4NCVE/OCVCMyVEOCVBNyVE/OCVBRCVEOSU4NC0l/RDglQTclRDklODQl/RDglQjQlRDklODUl/RDglQTclRDklODQl/RDklOEEtQmlhbmNo/aS1Ob3J0aC1Db2Fz/dC53ZWJw"
  const [formData, setFormData] = useState({
    name: '',
    dailyPrice: '',
    imageUrl: imageAdress
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const price = parseFloat(formData.dailyPrice);
      if (!formData.name || !formData.imageUrl || !price || price <= 0) {
        throw new Error('Please fill in all fields. Price must be positive.');
      }

      await api.addProperty(formData.name, price, formData.imageUrl);
      setFormData({ name: '', dailyPrice: '', imageUrl: imageAdress });
      onPropertyAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add New Property</h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Property Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Studio Apartment - Downtown"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Daily Price ($)</label>
        <input
          type="number"
          name="dailyPrice"
          value={formData.dailyPrice}
          onChange={handleChange}
          placeholder="e.g., 85"
          step="0.01"
          min="0"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Image URL</label>
        <input
          type="url"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div> */}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition disabled:bg-gray-400"
      >
        {loading ? 'Adding...' : 'Add Property'}
      </button>
    </form>
  );
}
