import React, { useEffect, useState } from 'react';
import { api } from '../api';

export default function Calendar({ propertyId, propertyName }) {
  const [bookings, setBookings] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBookings();
  }, [propertyId]);

  async function loadBookings() {
    setLoading(true);
    try {
      const data = await api.getBookings(propertyId);
      setBookings(data.bookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
    setLoading(false);
  }

  function isDateBooked(date) {
    return bookings.some(booking => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      return date >= bookingStart && date <= bookingEnd;
    });
  }

  function getDaysInMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  function getFirstDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  }

  function previousMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  }

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{propertyName}</h2>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={previousMonth}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded font-semibold"
        >
          ← Previous
        </button>
        <h3 className="text-xl font-semibold">{monthName}</h3>
        <button
          onClick={nextMonth}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded font-semibold"
        >
          Next →
        </button>
      </div>

      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {!loading && (
        <>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-bold text-gray-600">
                {day}
              </div>
            ))}

            {days.map((date, idx) => {
              const isBooked = date && isDateBooked(date);
              return (
                <div
                  key={idx}
                  className={`p-3 text-center font-semibold rounded cursor-default ${
                    date
                      ? isBooked
                        ? 'bg-red-400 text-white'
                        : 'bg-green-400 text-white'
                      : 'bg-transparent'
                  }`}
                >
                  {date?.getDate()}
                </div>
              );
            })}
          </div>

          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-400 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-400 rounded"></div>
              <span>Booked</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
