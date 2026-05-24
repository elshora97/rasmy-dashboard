import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, 'data.json');

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

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Property ID is required' });
  }

  if (req.method === 'GET') {
    const data = loadData();
    const property = data.properties.find(p => p.id === id);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.status(200).json({ bookings: property.bookings });
  } else if (req.method === 'POST') {
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
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
