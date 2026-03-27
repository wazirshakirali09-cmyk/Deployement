import React, { useEffect, useState } from "react";

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/bookings", {
      headers: { Authorization: token },
    })
      .then(res => res.json())
      .then(data => setBookings(Array.isArray(data) ? data : []));
  }, [token]);

  const deleteBooking = async (id) => {
    await fetch(`http://localhost:5000/api/bookings/${id}`, {
      method: "DELETE",
      headers: { Authorization: token },
    });

    setBookings(bookings.filter(b => b._id !== id));
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>

      <button onClick={logout}>Logout</button>

      <h2>Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Item</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.name}</td>
                <td>{b.item}</td>
                <td>{b.date}</td>
                <td>
                  <button onClick={() => deleteBooking(b._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;