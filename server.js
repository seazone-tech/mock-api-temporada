// server.js
const jsonServer = require('json-server');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Custom route to simulate a booking
app.post('/bookings', (req, res) => {
  console.log('Simulating booking:', req.body);

  // Simulate network latency
  setTimeout(() => {
    // Simulate error chance (20% failure chance)
    if (Math.random() > 0.2) {
      res.status(201).json({ message: 'Booking simulated successfully!', status: 'success' });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred. Please try again.', status: 'error' });
    }
  }, 1000);
});

// Custom route to handle complex filters that json-server doesn't cover
app.get('/properties', (req, res, next) => {
  const { minPrice, maxPrice, guests, bedrooms, available, amenities } = req.query;

  // If no complex filters are used, let json-server handle it
  if (!minPrice && !maxPrice && !guests && !bedrooms && !available && !amenities) {
    return next();
  }

  // Read DB to apply manual filters
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json')));
  let filteredProperties = db.properties.filter(property => {
    let isValid = true;
    if (available === 'true' && !property.isAvailable) isValid = false;
    if (minPrice && property.pricePerNight < parseFloat(minPrice)) isValid = false;
    if (maxPrice && property.pricePerNight > parseFloat(maxPrice)) isValid = false;
    if (guests && property.maxGuests < parseInt(guests, 10)) isValid = false;
    if (bedrooms && property.bedrooms < parseInt(bedrooms, 10)) isValid = false;
    if (amenities) {
      const requiredAmenities = amenities.split(',');
      const hasAllAmenities = requiredAmenities.every(a =>
        property.amenities.includes(a.trim())
      );
      if (!hasAllAmenities) isValid = false;
    }
    return isValid;
  });

  // Apply simple filters for consistency
  const { city, state, type } = req.query;
  filteredProperties = filteredProperties.filter(property => {
      if (city && property.location.city.toLowerCase() !== city.toLowerCase()) return false;
      if (state && property.location.state.toLowerCase() !== state.toLowerCase()) return false;
      if (type && property.type.toLowerCase() !== type.toLowerCase()) return false;
      return true;
  });

  res.json(filteredProperties);
});

// Default JSON Server middlewares (logger, static, cors)
app.use(middlewares);

// JSON Server router (for /properties/:id, etc.)
app.use(router);

app.listen(PORT, () => {
  console.log(`Mock API running at http://localhost:${PORT}`);
});