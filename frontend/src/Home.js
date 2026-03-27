import React, { useEffect, useState } from "react";
import "./App.css";

function Home() {
  const [hotels, setHotels] = useState([]);
  const [cars, setCars] = useState([]);
  const [booking, setBooking] = useState({
    name: "",
    item: "",
    date: "",
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/hotels")
      .then(res => res.json())
      .then(data => setHotels(Array.isArray(data) ? data : []));

    fetch("http://localhost:5000/api/cars")
      .then(res => res.json())
      .then(data => setCars(Array.isArray(data) ? data : []));
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(booking),
    });

    alert("Booking Successful ✅");
    setBooking({ name: "", item: "", date: "" });
  };

  return (
    <div className="container">
      <h1>Hotels</h1>

      <div className="grid">
        {hotels.map((h) => (
          <div className="card" key={h._id}>
            <img src={`http://localhost:5000/${h.image}`} alt="" />
            <h3>{h.name}</h3>
            <p>Rs: {h.price}</p>
            <button onClick={() => setBooking({ ...booking, item: h.name })}>
              Book
            </button>
          </div>
        ))}
      </div>

      <h1>Cars</h1>

      <div className="grid">
        {cars.map((c) => (
          <div className="card" key={c._id}>
            <img src={`http://localhost:5000/${c.image}`} alt="" />
            <h3>{c.name}</h3>
            <p>Rs: {c.price}</p>
            <button onClick={() => setBooking({ ...booking, item: c.name })}>
              Book
            </button>
          </div>
        ))}
      </div>

      <h2>Booking Form</h2>

      <form onSubmit={handleBooking}>
        <input
          type="text"
          placeholder="Name"
          value={booking.name}
          onChange={(e) =>
            setBooking({ ...booking, name: e.target.value })
          }
        />

        <input type="text" value={booking.item} readOnly />

        <input
          type="date"
          value={booking.date}
          onChange={(e) =>
            setBooking({ ...booking, date: e.target.value })
          }
        />

        <button>Confirm Booking</button>
      </form>
    </div>
  );
}

export default Home;