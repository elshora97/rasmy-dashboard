# Rasmy Rental - Property Rental Availability Platform

A full-stack web application for managing property rentals and availability calendars.

## Features

- **Property Listing**: Browse available properties with images and pricing
- **Booking Calendar**: Interactive calendar to view and manage bookings
- **Admin Panel**: Add new properties and block dates
- **Real-time Updates**: Changes appear immediately across the platform
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

### Frontend
- **React 18**: Modern JavaScript library for building UIs
- **React Router**: Client-side routing for navigation
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach

### Backend
- **Node.js / Express.js**: Server runtime and framework
- **Vercel Serverless Functions**: API endpoints deployed as serverless functions
- **JSON Data Storage**: File-based data persistence
- **CORS**: Secure cross-origin requests

### Deployment
- **Vercel**: Hosting platform for both frontend and serverless API
- **GitHub**: Source code repository and CI/CD integration

## Project Structure

```
rasmy-rental/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── pages/           # Home and Admin pages
│   │   ├── components/      # Reusable React components
│   │   ├── App.jsx          # Main app component
│   │   ├── index.jsx        # React DOM entry point
│   │   └── api.js           # API client
│   ├── public/              # Static assets
│   ├── index.html           # HTML entry point
│   ├── vite.config.js       # Vite configuration
│   └── package.json         # Frontend dependencies
│
├── api/                     # Serverless API functions
│   ├── properties.js        # Properties endpoints
│   ├── bookings.js          # Bookings endpoints
│   ├── health.js            # Health check endpoint
│   ├── data.json            # JSON data storage
│   └── index.js             # Original Express server (reference)
│
├── .gitignore               # Git ignore rules
├── DEPLOYMENT.md            # Deployment instructions
├── vercel.json              # Vercel configuration
└── package.json             # Root package configuration
```

## Getting Started

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/rasmy-rental.git
   cd rasmy-rental
   ```

2. Install dependencies:
   ```bash
   npm install
   npm install --prefix frontend
   npm install --prefix api
   ```

3. Start the development servers:
   
   **Terminal 1 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   
   **Terminal 2 - Backend:**
   ```bash
   cd api
   npm run dev
   ```

4. Open browser to http://localhost:5173

### API Endpoints

- `GET /api/health` - Health check
- `GET /api/properties` - List all properties
- `POST /api/properties` - Create new property
- `GET /api/properties/:id/bookings` - Get bookings for property
- `POST /api/properties/:id/bookings` - Add booking/blocked dates

### API Request/Response Examples

**Get Properties:**
```bash
GET /api/properties

Response:
{
  "properties": [
    {
      "id": "prop-1234567890-abc123def",
      "name": "Beach House",
      "dailyPrice": 150,
      "imageUrl": "https://example.com/beach.jpg",
      "bookings": [
        {
          "startDate": "2024-06-01",
          "endDate": "2024-06-05"
        }
      ]
    }
  ]
}
```

**Create Property:**
```bash
POST /api/properties
Content-Type: application/json

{
  "name": "Mountain Cabin",
  "dailyPrice": 120,
  "imageUrl": "https://example.com/cabin.jpg"
}
```

**Add Booking/Block Date:**
```bash
POST /api/properties/prop-1234567890-abc123def/bookings
Content-Type: application/json

{
  "startDate": "2024-06-10",
  "endDate": "2024-06-15"
}
```

## Deployment

### Deploy to Vercel

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed step-by-step instructions.

**Quick Summary:**
1. Create GitHub repository
2. Push code: `git push -u origin main`
3. Go to https://vercel.com and import the repository
4. Configure build settings (already set in vercel.json)
5. Deploy!

Your app will be live at `https://rasmy-rental.vercel.app`

## Usage

### Home Page
- Browse all available properties
- Click on a property to view its booking calendar
- See blocked dates and available dates

### Admin Page (Navigate to `/admin`)
1. **Add Property**: Fill in property details and submit
2. **Block Dates**: Select a property and date range to block availability
3. **View Changes**: Go back to home page to see updates

## Data Persistence

Data is stored in `api/data.json` and persists across:
- Local development sessions
- Vercel deployments
- Browser refreshes

⚠️ **Note**: Current implementation uses file-based storage. For production apps with multiple users, consider:
- Vercel KV (Redis)
- Database services (MongoDB, PostgreSQL)
- Cloud storage services

## Browser Compatibility

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Troubleshooting

### Properties not loading
- Check browser console (F12) for errors
- Verify API is running on port 3000
- Check `/api/health` endpoint returns `{"status":"ok"}`

### Calendar not working
- Ensure dates are in YYYY-MM-DD format
- Check that bookings are being sent to correct endpoint
- Verify property ID in URL matches

### Admin changes not appearing
- Refresh browser (Ctrl+F5 for hard refresh)
- Check Network tab in dev tools for failed requests
- Verify POST requests return 201 status

## Testing

See [TESTING_REPORT.md](./TESTING_REPORT.md) for comprehensive test results.

## Future Enhancements

- [ ] User authentication and accounts
- [ ] Payment processing
- [ ] Email notifications for bookings
- [ ] Advanced availability rules
- [ ] Guest reviews and ratings
- [ ] Search and filtering
- [ ] Multi-language support
- [ ] Mobile app

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for common issues
2. Review [TESTING_REPORT.md](./TESTING_REPORT.md) for test scenarios
3. Check Vercel dashboard logs if deployment fails

## Development

### Build Frontend
```bash
cd frontend
npm run build
```

Output goes to `frontend/build/`

### Run Tests
```bash
# No automated tests yet - see TESTING_REPORT.md for manual testing procedures
```

### Code Style

- JavaScript ES6+
- React functional components with hooks
- Tailwind CSS for styling
- Component-based architecture

## Deployment Status

✅ Ready for production deployment to Vercel
- All features implemented and tested
- Serverless functions configured
- Build optimization complete
- Static hosting enabled
- API routes configured

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.
