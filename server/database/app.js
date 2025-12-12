// const express = require('express');
// const mongoose = require('mongoose');
// const fs = require('fs');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// const app = express();
// const port = 3030;

// app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// // ✅ JSON files are in ./data
// const reviews_data = JSON.parse(fs.readFileSync("data/reviews.json", "utf8"));
// const dealerships_data = JSON.parse(fs.readFileSync("data/dealerships.json", "utf8"));

// mongoose.connect("mongodb://mongo_db:27017/", { dbName: "dealershipsDB" });

// const Reviews = require('./review');
// const Dealerships = require('./dealership');

// // Seed DB (best-effort, no res here)
// (async () => {
//   try {
//     await Reviews.deleteMany({});
//     await Reviews.insertMany(reviews_data["reviews"]);

//     await Dealerships.deleteMany({});
//     await Dealerships.insertMany(dealerships_data["dealerships"]);

//     console.log("✅ Database seeded");
//   } catch (error) {
//     console.error("❌ Error seeding database", error);
//   }
// })();

// // Express route to home
// app.get('/', async (req, res) => {
//   res.send("Welcome to the Mongoose API");
// });

// // Express route to fetch all reviews
// app.get('/fetchReviews', async (req, res) => {
//   try {
//     const documents = await Reviews.find();
//     res.json(documents);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error fetching documents' });
//   }
// });

// // Express route to fetch reviews by a particular dealer
// app.get('/fetchReviews/dealer/:id', async (req, res) => {
//   try {
//     const documents = await Reviews.find({ dealership: req.params.id });
//     res.json(documents);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error fetching documents' });
//   }
// });

// // ✅ Express route to fetch all dealerships
// app.get('/fetchDealers', async (req, res) => {
//   try {
//     const documents = await Dealerships.find();
//     res.json(documents);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error fetching dealers' });
//   }
// });

// // ✅ Express route to fetch Dealers by a particular state
// app.get('/fetchDealers/:state', async (req, res) => {
//   try {
//     const stateParam = req.params.state;

//     const documents = await Dealerships.find({
//       $or: [
//         { st: stateParam.toUpperCase() },
//         { state: new RegExp(`^${stateParam}$`, 'i') },
//       ],
//     });

//     res.json(documents);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error fetching dealers by state' });
//   }
// });

// // ✅ Express route to fetch dealer by a particular id
// app.get('/fetchDealer/:id', async (req, res) => {
//   try {
//     const id = parseInt(req.params.id);
//     const document = await Dealerships.findOne({ id: id });

//     if (!document) {
//       return res.status(404).json({ error: 'Dealer not found' });
//     }

//     res.json(document);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error fetching dealer by id' });
//   }
// });

// //Express route to insert review
// app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
//   const data = JSON.parse(req.body);
//   const documents = await Reviews.find().sort({ id: -1 });
//   let new_id = documents[0]['id'] + 1;

//   const review = new Reviews({
//     id: new_id,
//     name: data['name'],
//     dealership: data['dealership'],
//     review: data['review'],
//     purchase: data['purchase'],
//     purchase_date: data['purchase_date'],
//     car_make: data['car_make'],
//     car_model: data['car_model'],
//     car_year: data['car_year'],
//   });

//   try {
//     const savedReview = await review.save();
//     res.json(savedReview);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: 'Error inserting review' });
//   }
// });

// // Start the Express server
// app.listen(port, () => {
//   console.log(`🚀 Server is running on http://localhost:${port}`);
// });
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
  res.json(dealerships_data["dealerships"]);
});

// Fetch dealers by state
app.get('/fetchDealers/:state', (req, res) => {
  const state = req.params.state.toUpperCase();
  const dealers = dealerships_data["dealerships"].filter(d =>
    d.st.toUpperCase() === state ||
    d.state.toUpperCase() === state
  );
  res.json(dealers);
});

// Fetch dealer by ID
app.get('/fetchDealer/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const dealer = dealerships_data["dealerships"].find(d => d.id === id);
  res.json(dealer || {});
});

// Fetch all reviews
app.get('/fetchReviews', (req, res) => {
  res.json(reviews_data["reviews"]);
});

// Fetch reviews for a dealer
app.get('/fetchReviews/dealer/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const reviews = reviews_data["reviews"].filter(r => r.dealership === id);
  res.json(reviews);
});

// Insert review (append to JSON)
app.post('/insert_review', (req, res) => {
  const body = req.body;

  let new_id = reviews_data["reviews"].length + 1;

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

  reviews_data["reviews"].push(newReview);

  res.json(newReview);
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Mock server running on http://localhost:${port}`);
});
