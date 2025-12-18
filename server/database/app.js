const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3030;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Load JSON data
const reviews_data = JSON.parse(fs.readFileSync("data/reviews.json", "utf8"));
const dealerships_data = JSON.parse(fs.readFileSync("data/dealerships.json", "utf8"));

// Home
app.get('/', (req, res) => {
  res.send("Welcome to the Mock Dealership API");
});

// Fetch all dealerships
app.get('/fetchDealers', (req, res) => {
  res.json(dealerships_data.dealerships);
});

// Fetch dealers by state
app.get('/fetchDealers/:state', (req, res) => {
  const state = req.params.state.toUpperCase();
  const dealers = dealerships_data.dealerships.filter(d =>
    d.st.toUpperCase() === state ||
    d.state.toUpperCase() === state
  );
  res.json(dealers);
});

// Fetch dealer by ID
app.get('/fetchDealer/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const dealer = dealerships_data.dealerships.find(d => d.id === id);
  res.json(dealer || {});
});

// Fetch all reviews
app.get('/fetchReviews', (req, res) => {
  res.json(reviews_data.reviews);
});

// Fetch reviews for a dealer
app.get('/fetchReviews/dealer/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const reviews = reviews_data.reviews.filter(r => r.dealership === id);
  res.json(reviews);
});

// Insert review (append to JSON)
app.post('/insert_review', (req, res) => {
  const body = req.body;

  let new_id = reviews_data.reviews.length + 1;

  const newReview = {
    id: new_id,
    name: body.name,
    dealership: body.dealership,
    review: body.review,
    purchase: body.purchase,
    purchase_date: body.purchase_date,
    car_make: body.car_make,
    car_model: body.car_model,
    car_year: body.car_year
  };

  reviews_data.reviews.push(newReview);

  res.json(newReview);
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Mock server running on http://localhost:${port}`);
});
