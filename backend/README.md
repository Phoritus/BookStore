# Book Cafe Backend Setup Instructions

## Database Setup Required

### Option 1: Install MySQL locally
1. Download MySQL Community Server from: https://dev.mysql.com/downloads/mysql/
2. Install with default settings
3. Set root password during installation
4. Update `.env` file with your password:
   ```
   DB_PASSWORD=your_mysql_root_password
   ```

### Option 2: Use XAMPP (Easier for development)
1. Download XAMPP: https://www.apachefriends.org/
2. Install XAMPP
3. Start Apache and MySQL services from XAMPP Control Panel
4. Keep `.env` file as is (empty password)

### Option 3: Use Online Database (Cloud)
1. Create free MySQL database at:
   - Railway.app
   - PlanetScale
   - Aiven
2. Update `.env` with connection details

## After Database Setup

1. Initialize database:
   ```bash
   cd c:\ProjectZero\backend
   npm run init-db
   ```

2. Start backend server:
   ```bash
   npm run dev
   ```

3. Backend will run on: http://localhost:5000

## API Endpoints Available

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login

### Rooms
- GET `/api/rooms` - Get all rooms
- GET `/api/rooms/:id` - Get specific room
- GET `/api/rooms/:id/availability` - Check room availability
- GET `/api/rooms/availability/date/:date` - Get date availability

### Bookings (Requires Authentication)
- POST `/api/bookings` - Create booking
- GET `/api/bookings/my-bookings` - Get user bookings
- GET `/api/bookings/:id` - Get specific booking
- PATCH `/api/bookings/:id/cancel` - Cancel booking

### Users (Requires Authentication)
- GET `/api/users/profile` - Get user profile
- GET `/api/users/stats` - Get user statistics

## Next Steps

After database is working:
1. Update frontend API configuration
2. Test authentication flow
3. Test booking system
4. Add payment integration
5. Add email notifications
