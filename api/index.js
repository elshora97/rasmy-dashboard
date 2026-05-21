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

// Load data from file
function loadData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading data:', error);
    return { properties: [] };
  }
}

// Save data to file
function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

// Helper: Generate simple ID
function generateId() {
  return 'prop-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// GET /api/properties - Get all properties
app.get('/api/properties', (req, res) => {
  const data = loadData();
  res.json({ properties: data.properties });
});

// POST /api/properties - Create new property
app.post('/api/properties', (req, res) => {
  const { name, dailyPrice, imageUrl } = req.body;

  // Validation
  if (!name || dailyPrice === undefined || !imageUrl) {
    return res.status(400).json({ error: 'Missing required fields: name, dailyPrice, imageUrl' });
  }

  if (typeof dailyPrice !== 'number' || dailyPrice <= 0) {
    return res.status(400).json({ error: 'dailyPrice must be a positive number' });
  }

  const data = loadData();
  const newProperty = {
    id: generateId(),
    name: name.trim(),
    dailyPrice,
    imageUrl: imageUrl.trim(),
    bookings: []
  };

  data.properties.push(newProperty);
  saveData(data);

  res.status(201).json(newProperty);
});

// GET /api/properties/:id/bookings - Get bookings for a property
app.get('/api/properties/:id/bookings', (req, res) => {
  const { id } = req.params;
  const data = loadData();
  const property = data.properties.find(p => p.id === id);

  if (!property) {
    return res.status(404).json({ error: 'Property not found' });
  }

  res.json({ bookings: property.bookings });
});

// POST /api/properties/:id/bookings - Add booking to a property
app.post('/api/properties/:id/bookings', (req, res) => {
  const { id } = req.params;
  const { startDate, endDate } = req.body;

  // Validation
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

  const newBooking = {
    startDate: startDate.trim(),
    endDate: endDate.trim()
  };

  property.bookings.push(newBooking);
  saveData(data);

  res.status(201).json({ bookings: property.bookings });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
