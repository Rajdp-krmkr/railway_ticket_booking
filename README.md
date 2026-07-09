# SwiftRail - Modern Railway Reservation System

SwiftRail is a complete Full-Stack Railway Reservation website. It is built using **React (Vite) + Tailwind CSS** on the frontend, and **Node.js (Express)** on the backend, using a clean MVC (Model-View-Controller) architecture.

The project is fully pre-configured to run out of the box using **interactive in-memory mock databases** for both train schedules and bookings. You can immediately search for trains, simulate user and administrator login sessions, reserve ticket seats, review PNR tickets, cancel reservations, and watch the Admin Dashboard statistics change in real-time.

---

## 📁 Project Structure

```text
railway-reservation-system/ (Project Root)
├── backend/
│   ├── config/
│   │   └── db.js            <-- MySQL connection credentials and setup placeholders
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   └── trainController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── trainRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js <-- JWT authentication checking structure
│   ├── app.js               <-- Express configurations
│   ├── server.js            <-- Express listener bootstrapper
│   ├── package.json
│   └── .env                 <-- Active environment variables
│
├── frontend/
│   ├── src/
│   │   ├── assets/          <-- Images and theme elements
│   │   ├── components/      <-- Reusable UI elements (Spinner, Protected route)
│   │   ├── context/         <-- AuthContext for React Session tracking
│   │   ├── layouts/         <-- MainLayout and AdminLayout
│   │   ├── pages/           <-- Home, Search, Book, Success, Admin, About, etc.
│   │   ├── services/        <-- Axios API utilities (auth, trains, bookings)
│   │   ├── App.jsx          <-- Routes configuration
│   │   ├── main.jsx         <-- React DOM entrypoint
│   │   └── index.css        <-- Custom Tailwind styles & fonts
│   ├── package.json
│   ├── vite.config.js       <-- Vite server proxy rules
│   └── tailwind.config.js   <-- Tailwind colors and theme declarations
```

---

## ⚡ Quick Start: Running the Project

### 1. Prerequisite
Ensure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### 2. Launch the Backend
Open a terminal in the project root:
```bash
cd backend
npm install
npm run dev
```
The Express server will start on **`http://localhost:5000`** with live reloading.

### 3. Launch the Frontend
Open a **new** terminal in the project root:
```bash
cd frontend
npm install
npm run dev
```
The Vite development server will start on **`http://localhost:5173`**. Open this URL in your web browser.

---

## 🛡️ Demo Login Credentials

The Login screen features **Quick Demo Buttons** that auto-fill the forms instantly. You can also type them manually:

*   **Passenger Account**:
    *   **Email**: `passenger@railway.com`
    *   **Password**: `passenger123`
*   **Administrator Account**:
    *   **Email**: `admin@railway.com`
    *   **Password**: `admin123`

---

## 🗄️ Database Integration: Connecting your MySQL Server

### Step 1: Add Credentials
Open **`backend/config/db.js`**. You will find comments and configuration placeholders.
Add your MySQL server connection details to your `backend/.env` file:
```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_railway_db
```

### Step 2: Enable the MySQL Driver
1. In the `backend` terminal, install the promise-based MySQL driver:
   ```bash
   npm install mysql2
   ```
2. Open **`backend/config/db.js`** and uncomment the `mysql2/promise` block:
   ```javascript
   const mysql = require('mysql2/promise');

   const dbPool = mysql.createPool({
     host: process.env.DB_HOST || 'localhost',
     user: process.env.DB_USER || 'root',
     password: process.env.DB_PASSWORD || 'yourpassword',
     database: process.env.DB_NAME || 'railway_db',
     waitForConnections: true,
     connectionLimit: 10,
     queueLimit: 0
   });

   module.exports = dbPool;
   ```
3. Remove or comment out the `const mockDb = { ... }` block at the bottom of the file.

---

## 🔄 Replacing Dummy JSON with SQL Queries

All controller responses contain a dedicated `// TODO: Fetch data from RailwayDB` comment block. Here is a guide on how to replace the mock responses with actual SQL queries:

### 1. Authentication (`backend/controllers/authController.js`)
Replace the mock check with a query matching the email:
```javascript
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { email, password } = req.body;
  
  // TODO: Fetch data from RailwayDB
  const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (users.length === 0) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  
  const user = users[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
  res.json({
    success: true,
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
};
```

### 2. Searching Trains (`backend/controllers/trainController.js`)
Filter routes matching search inputs:
```javascript
const db = require('../config/db');

const searchTrains = async (req, res) => {
  const { source, destination } = req.query;
  
  // TODO: Fetch data from RailwayDB
  const [trains] = await db.query(
    'SELECT * FROM trains WHERE LOWER(source) LIKE ? AND LOWER(destination) LIKE ?',
    [`%${source.toLowerCase()}%`, `%${destination.toLowerCase()}%`]
  );
  
  res.json({
    success: true,
    trains
  });
};
```

### 3. Creating Bookings (`backend/controllers/bookingController.js`)
Add reservation queries to insert passenger bookings into your database table:
```javascript
const db = require('../config/db');

const createBooking = async (req, res) => {
  const { trainId, passengerName, passengerAge, passengerGender, passengerPhone, journeyDate } = req.body;
  const userId = req.user.id; // From authMiddleware

  const pnr = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  const seatNumber = `B${Math.floor(Math.random() * 5) + 1}-${Math.floor(Math.random() * 64) + 1}`;

  // TODO: Fetch data from RailwayDB / Insert records
  const [result] = await db.query(
    'INSERT INTO bookings (pnr, user_id, train_id, passenger_name, passenger_age, passenger_gender, passenger_phone, journey_date, seat_number, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [pnr, userId, trainId, passengerName, passengerAge, passengerGender, passengerPhone, journeyDate, seatNumber, 'Confirmed']
  );

  res.json({
    success: true,
    booking: { id: result.insertId, pnr, trainId, passengerName, journeyDate, seatNumber, status: 'Confirmed' }
  });
};
```
