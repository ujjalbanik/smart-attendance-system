# 🎓 Smart Attendance System (Face Recognition Based)

A full-stack Smart Attendance System built with:

- 🔹 Django + Django REST Framework (Backend)
- 🔹 React + Vite (Frontend Kiosk)
- 🔹 Face Recognition using face-api.js
- 🔹 Device-based attendance marking
- 🔹 JWT Authentication (Admin Access)

---

## 🚀 Features

### 👤 Student Registration
- Register student with:
  - Name
  - Roll Number
  - Course
  - Batch
  - Face Embedding (128-d vector)

### 🎥 Face Recognition Kiosk
- Uses laptop camera
- Detects and matches face
- Marks:
  - ✅ Check-IN
  - ✅ Check-OUT
- One attendance per day
- Voice confirmation

### 🔐 Security
- JWT Authentication for Admin
- Device-based attendance authentication
- Face distance threshold matching
- Prevents duplicate attendance

### 📊 Admin Capabilities
- View all students
- View all attendance
- Track IN / OUT logs

---

## 🏗️ Project Structure

smart_attendance_system/
│
├── accounts/
├── attendance/
├── devices/
├── core/
├── kiosk-frontend/ (React + Face Recognition)
└── manage.py


---

## ⚙️ Installation (Backend)

```bash
git clone https://github.com/YOUR_USERNAME/smart-attendance-system.git
cd smart-attendance-system

python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

Backend runs at:
http://127.0.0.1:8000

cd kiosk-frontend
npm install
npm run dev

Frontend runs at:
http://localhost:5173


Face Recognition Logic

Uses 128-dimensional face embeddings

Calculates Euclidean distance

Threshold: 0.6

Matches student with lowest distance

📌 Future Improvements

Cloud Deployment (Render / AWS)

Production database (PostgreSQL)

Proper Device Registration System

Admin Dashboard UI

Attendance Analytics Graphs

Docker Support

🏆 Author

Ujjal Banik
MCA Student | Backend Developer
Focused on Secure API Development & Real-World Systems

License
This project is for educational and demonstration purposes.

