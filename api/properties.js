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

// Helper: Generate simple ID
function generateId() {
  return 'prop-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
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

  if (req.method === 'GET') {
    const data = loadData();
    res.status(200).json({ properties: data.properties });
  } else if (req.method === 'POST') {
    const { name, dailyPrice, imageUrl } = req.body;

    if (!name || !dailyPrice) {
      return res.status(400).json({ error: 'Missing required fields: name, dailyPrice' });
    }

    const data = loadData();
    const newProperty = {
      id: generateId(),
      name,
      dailyPrice,
      imageUrl: imageUrl || '',
      bookings: []
    };

    data.properties.push(newProperty);
    saveData(data);

    res.status(201).json(newProperty);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
