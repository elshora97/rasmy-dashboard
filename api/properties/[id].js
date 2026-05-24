import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '..', 'data.json');

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

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,DELETE,PUT,PATCH');
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

    res.status(200).json(property);
  } else if (req.method === 'DELETE') {
    const data = loadData();
    const propertyIndex = data.properties.findIndex(p => p.id === id);

    if (propertyIndex === -1) {
      return res.status(404).json({ error: 'Property not found' });
    }

    data.properties.splice(propertyIndex, 1);
    saveData(data);

    res.status(200).json({ message: 'Property deleted successfully' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
