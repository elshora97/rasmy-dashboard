/*
  REFERENCE FILE - For local development only

  For production deployment on Vercel, the API uses serverless functions:
  - api/properties.js - GET/POST all properties
  - api/properties/[id].js - GET/DELETE individual property
  - api/properties/[id]/bookings.js - GET/POST bookings
  - api/health.js - Health check

  To test locally with Vercel serverless functions, run:
    npm install -g vercel
    vercel dev

  Or use this Express server for quick testing:
*/

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

function loadData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading data:', error);
    return { properties: [] };
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

function generateId() {
  return 'prop-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

app.get('/api/properties', (req, res) => {
  const data = loadData();
  res.json({ properties: data.properties });
});

app.post('/api/properties', (req, res) => {
  const { name, dailyPrice, imageUrl } = req.body;

  if (!name || dailyPrice === undefined) {
    return res.status(400).json({ error: 'Missing required fields: name, dailyPrice' });
  }

  const data = loadData();
  const newProperty = {
    id: generateId(),
    name: name.trim(),
    dailyPrice,
    imageUrl: imageUrl || '',
    bookings: []
  };

  data.properties.push(newProperty);
  saveData(data);

  res.status(201).json(newProperty);
});

app.get('/api/properties/:id/bookings', (req, res) => {
  const { id } = req.params;
  const data = loadData();
  const property = data.properties.find(p => p.id === id);

  if (!property) {
    return res.status(404).json({ error: 'Property not found' });
  }

  res.json({ bookings: property.bookings });
});

app.post('/api/properties/:id/bookings', (req, res) => {
  const { id } = req.params;
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Missing required fields: startDate, endDate' });
  }

  const startTime = new Date(startDate).getTime();
  const endTime = new Date(endDate).getTime();

  if (isNaN(startTime) || isNaN(endTime)) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
  }

  if (endTime < startTime) {
    return res.status(400).json({ error: 'endDate must be greater than or equal to startDate' });
  }

  const data = loadData();
  const property = data.properties.find(p => p.id === id);

  if (!property) {
    return res.status(404).json({ error: 'Property not found' });
  }

  const newBooking = { startDate: startDate.trim(), endDate: endDate.trim() };
  property.bookings.push(newBooking);
  saveData(data);

  res.status(201).json({ bookings: property.bookings });
});

app.delete('/api/properties/:id', (req, res) => {
  const { id } = req.params;
  const data = loadData();
  const propertyIndex = data.properties.findIndex(p => p.id === id);

  if (propertyIndex === -1) {
    return res.status(404).json({ error: 'Property not found' });
  }

  data.properties.splice(propertyIndex, 1);
  saveData(data);

  res.status(200).json({ message: 'Property deleted successfully' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
