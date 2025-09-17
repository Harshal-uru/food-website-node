# Food Donation and Redistribution Platform

A full-stack web application that connects restaurants and food donors with NGOs for redistributing excess food to those in need. This platform helps reduce food waste and ensures surplus food reaches communities that need it most.

## 🎯 Project Overview

This application implements a complete food donation ecosystem with the following key features:

- **Food Donation Management**: Restaurants and individuals can create and manage food donations
- **NGO Registration & Verification**: NGOs can register and get verified to claim donations
- **Smart Matching**: Platform connects donors with NGOs based on location and capacity
- **Real-time Status Tracking**: Track donation status from creation to delivery
- **User Authentication**: Secure JWT-based authentication system
- **Responsive Design**: Modern, mobile-friendly interface

## 🏗️ Architecture

- **Backend**: Node.js + Express + MongoDB
- **Frontend**: React.js + Tailwind CSS
- **Database**: MongoDB Atlas
- **Authentication**: JWT tokens
- **API**: RESTful API design

## 🚀 Features

### For Food Donors (Restaurants, Individuals, etc.)
- Create food donations with detailed information
- Specify food items, quantities, expiry dates
- Set pickup location and time windows
- Track donation status
- Manage multiple donations

### For NGOs
- Register organization with verification system
- Browse available food donations
- Claim donations based on capacity
- Track claimed donations
- Update delivery status

### System Features
- Advanced filtering and search
- Real-time status updates
- Responsive dashboard
- Secure user authentication
- Data validation and error handling

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn package manager

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd food-donation-app
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb+srv://admin:admin@cluster0.a4fftse.mongodb.net/food-donation-app
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=5001
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm start
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Food Donations
- `POST /api/food-donations` - Create new donation
- `GET /api/food-donations` - Get all donations (with filters)
- `GET /api/food-donations/:id` - Get donation by ID
- `PUT /api/food-donations/:id` - Update donation
- `DELETE /api/food-donations/:id` - Delete donation
- `POST /api/food-donations/:id/claim` - Claim donation (NGO only)
- `PUT /api/food-donations/:id/status` - Update donation status

### NGOs
- `POST /api/ngos/register` - Register new NGO
- `GET /api/ngos/profile` - Get NGO profile
- `PUT /api/ngos/profile` - Update NGO profile
- `GET /api/ngos/search` - Search NGOs
- `GET /api/ngos/stats` - Get NGO statistics

## 🗄️ Database Models

### User
- Basic user information (name, email, password)
- Profile details (university, address)

### FoodDonation
- Donor information and type
- Food items with quantities and expiry dates
- Pickup location and time windows
- Status tracking (available, claimed, picked up, delivered, expired)
- Special instructions

### NGO
- Organization details and registration
- Contact person information
- Service areas and capacity
- Verification status

## 🎨 Frontend Components

- **Home**: Landing page with application overview
- **FoodDonations**: Main dashboard for viewing and creating donations
- **NGORegistration**: NGO registration form
- **CreateDonationModal**: Modal for creating new donations
- **DonationCard**: Individual donation display card
- **FilterBar**: Search and filter functionality

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation and sanitization
- CORS configuration

## 🚀 Deployment

### Backend Deployment
The backend is configured to run on port 5001 by default. For production:

1. Set environment variables
2. Use PM2 or similar process manager
3. Configure reverse proxy (nginx)
4. Set up SSL certificates

### Frontend Deployment
The React app can be built and deployed to any static hosting service:

```bash
npm run build
```

## 📱 Usage

### For Food Donors
1. Register an account
2. Navigate to "Food Donations"
3. Click "Create Donation"
4. Fill in food details, pickup location, and time
5. Submit and track your donation

### For NGOs
1. Register an account
2. Complete NGO registration form
3. Wait for verification (admin process)
4. Browse available donations
5. Claim donations within your capacity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

## 🔮 Future Enhancements

- Real-time notifications
- Mobile app development
- Advanced analytics dashboard
- Integration with food delivery services
- Automated matching algorithms
- Multi-language support
- SMS/Email notifications

---

**Note**: This application is designed for educational purposes and demonstrates full-stack development with modern web technologies. For production use, additional security measures, testing, and deployment configurations should be implemented.
