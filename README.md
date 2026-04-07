
Hospital Management System
🚀 Overview

MediCore is a full-stack Hospital Management System that allows patients, doctors, and admins to manage appointments efficiently.

This project includes:

Secure authentication (JWT)
Role-based access (Admin / Doctor / Patient)
Appointment booking system
Doctor approval system (Accept / Decline)
✨ Features
👤 Patient
              Register & Login
              Book appointments with doctors
              View own appointments
👨‍⚕️ Doctor
              View assigned appointments only
              Accept appointments
              Decline appointments (removes patient request)
              View patient details
🛠️ Admin
              Manage all appointments
              View all users
🔐 Authentication & Security
              JWT-based authentication
              Role-based authorization
              Protected API routes
🧱 Tech Stack
          Frontend
          HTML, CSS, JavaScript
          Responsive UI
          Backend
          Node.js
          Express.js
          Database
          MongoDB (Mongoose)
📁 Project Structure
            project-root/
            │
            ├── models/
            │   ├── User.js
            │   └── Appointment.js
            │
            ├── controllers/
            │   ├── authController.js
            │   ├── appointmentController.js
            │   ├── userController.js
            │
            ├── routes/
            │   ├── auth.js
            │   └── appointment.js
            │
            ├── middleware/
            │   └── auth.js
            │
            ├── frontend/
            │   ├── login.html
            │   ├── doctor-dashboard.html
            │   └── patient-dashboard.html
            │
            └── server.js
⚙️ Installation & Setup
            1️⃣ Clone the repository
            git clone https://github.com/your-username/medicore.git
            cd medicore
            2️⃣ Install dependencies
            npm install
            3️⃣ Setup environment variables
            
            Create .env file:
            
            PORT=5002
            MONGO_URI=your_mongodb_connection
            JWT_SECRET=your_secret_key
            4️⃣ Run the server
            npm start
            📡 API Endpoints
            🔐 Auth
            POST /api/auth/register
            POST /api/auth/login
            📅 Appointments
            GET /api/appointments → Get appointments (role-based)
            POST /api/appointments → Book appointment
            PUT /api/appointments/:id/accept → Accept appointment
            DELETE /api/appointments/:id → Decline (remove)
            🔄 Workflow
            Patient books appointment → status = pending
            Doctor sees request
            Doctor:
            ✅ Accept → status becomes accepted
            ❌ Decline → appointment deleted
            📌 Future Improvements









Real-time notifications (Socket.io)
Doctor availability slots
Payment integration
Advanced analytics dashboard
Mobile app support
