const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();

// 🔥 Middleware
app.use(cors());
app.use(express.json());

// 🔥 IMPORTANT (STEP 4 - IMAGE SERVE)
app.use("/uploads", express.static("uploads"));

// 🔥 MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log(err));

// 🔥 Models
const Admin = mongoose.model("Admin", {
  username: String,
  password: String,
});

const Hotel = mongoose.model("Hotel", {
  name: String,
  price: Number,
  image: String,
});

const Car = mongoose.model("Car", {
  name: String,
  price: Number,
  image: String,
});

const Booking = mongoose.model("Booking", {
  name: String,
  item: String,
  date: String,
});

// 🔥 Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// 🔥 JWT Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: "No token" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    next();
  });
};

// 🔥 Admin Login
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });

  if (!admin) return res.status(400).json({ message: "Admin not found" });

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);

  res.json({ token });
});

// 🔥 Add Hotel
app.post("/api/hotels", verifyToken, upload.single("image"), async (req, res) => {
  const hotel = new Hotel({
    name: req.body.name,
    price: req.body.price,
    image: req.file.path,
  });

  await hotel.save();
  res.json(hotel);
});

// 🔥 Get Hotels
app.get("/api/hotels", async (req, res) => {
  const data = await Hotel.find();
  res.json(data);
});

// 🔥 Add Car
app.post("/api/cars", verifyToken, upload.single("image"), async (req, res) => {
  const car = new Car({
    name: req.body.name,
    price: req.body.price,
    image: req.file.path,
  });

  await car.save();
  res.json(car);
});

// 🔥 Get Cars
app.get("/api/cars", async (req, res) => {
  const data = await Car.find();
  res.json(data);
});

// 🔥 Add Booking
app.post("/api/bookings", async (req, res) => {
  const booking = new Booking(req.body);
  await booking.save();
  res.json(booking);
});

// 🔥 Get Bookings (Protected)
app.get("/api/bookings", verifyToken, async (req, res) => {
  const data = await Booking.find();
  res.json(data);
});

// 🔥 DELETE BOOKING (STEP 3)
app.delete("/api/bookings/:id", verifyToken, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 Start Server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});

app.get("/create-admin", async (req, res) => {
  const hashedPassword = await bcrypt.hash("1234", 10);

  const admin = new Admin({
    username: "admin",
    password: hashedPassword,
  });

  await admin.save();

  res.send("Admin Created");
});