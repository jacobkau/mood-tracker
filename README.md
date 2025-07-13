
# MoodTracker - README
# MoodTracker - A Personal Mood Tracking Application

![MoodTracker Screenshot](./screenshot.png) <!-- Replace with actual screenshot -->

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

📊 **Comprehensive Mood Tracking**
- Daily mood logging with emoji support
- Optional notes for context
- Mood history calendar view
- Statistics and trends visualization

🔒 **Secure Authentication**
- JWT-based login/registration
- Password encryption
- Protected routes

🎨 **Personalization**
- Customizable profile
- Themed interface (light/dark modes)
- Responsive design for all devices

📈 **Data Insights**
- Weekly/Monthly mood patterns
- Mood frequency analysis
- Export data functionality

## Technologies

### Frontend
- **React** (v18) - UI framework  
- **Vite** - Build tool  
- **Tailwind CSS** - Styling  
- **React Router** (v6) - Navigation  
- **React Icons** - Icon library  
- **Axios** - HTTP client  
- **Chart.js** - Data visualization  

### Backend
- **Node.js** - Runtime environment  
- **Express** - Web framework  
- **MongoDB** - Database  
- **Mongoose** - ODM  
- **JWT** - Authentication  
- **Bcrypt** - Password hashing  
- **CORS** - Cross-origin support  

## Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (v5+)
- Git

### Steps
## Clone the repository:
   ```bash
   git clone https://github.com/yourusername/moodtracker.git
   cd moodtracker

## Installation

### Install Backend Dependencies
```bash
cd server
npm install
```

### Install Frontend Dependencies
```bash
cd ../client
npm install
```

### Set Up Environment Variables  
See [Configuration](#configuration) section below.

---

## Configuration

### Backend (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/moodtracker
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### Frontend (`client/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## Usage

### Start the Backend Server
```bash
cd server
npm run dev
```

### Start the Frontend Development Server
```bash
cd ../client
npm run dev
```

### Access the Application
```url
http://localhost:5173
```

---

## API Endpoints

| Endpoint              | Method | Description              |
|-----------------------|--------|--------------------------|
| `/api/auth/register` | POST   | User registration        |
| `/api/auth/login`    | POST   | User login               |
| `/api/auth/me`       | GET    | Get current user profile |
| `/api/moods`         | GET    | Get all moods for user   |
| `/api/moods`         | POST   | Create new mood entry    |
| `/api/moods/:id`     | DELETE | Delete mood entry        |
| `/api/moods/stats`   | GET    | Get mood statistics      |
| `/api/profile`       | PUT    | Update user profile      |

---

## Deployment

### Backend Deployment (Heroku Example)
1. Create a new Heroku app  
2. Set config vars (environment variables)  
3. Push to Heroku:
   ```bash
   git push heroku main
   ```

### Frontend Deployment (Vercel Example)
1. Connect your GitHub repository  
2. Set environment variables  
3. Deploy!

---

## Contributing

1. Fork the project  
2. Create your feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE` for more information.
