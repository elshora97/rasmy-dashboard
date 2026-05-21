import React, { useState } from 'react';
import Calendar from './Calendar';

export default function PropertyCard({ property }) {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <img
        src={property.imageUrl}
        alt={property.name}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
        }}
      />
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{property.name}</h3>
        <p className="text-xl font-semibold text-blue-600 mb-4">
          ${property.dailyPrice} <span className="text-sm text-gray-600">/night</span>
        </p>
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
        >
          {showCalendar ? 'Hide Availability' : 'View Availability'}
        </button>
      </div>

      {showCalendar && (
        <div className="border-t p-4">
          <Calendar propertyId={property.id} propertyName={property.name} />
        </div>
      )}
    </div>
  );
}
