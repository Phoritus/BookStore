# Book Café Website

A modern, user-friendly website for a Book Café with integrated member management, room booking system, and book lending information. Built with React.js, TypeScript, and a warm cream-brown design theme optimized for Gen Z users.


## 📦 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd book-store-cafe
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` with your configuration:
```
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Book Café
VITE_APP_VERSION=1.0.0
```

### 4. Start development server
```bash
npm run dev
```

> If you see `'vite' is not recognized as an internal or external command`, install Vite first:
> ```bash
> npm install vite --save-dev
> ```

### 5. Open your browser
Go to `http://localhost:5173`
### Development Tools
- **ESLint** for code linting
- **TypeScript** for type safety
- **PostCSS** for CSS processing
- **Autoprefixer** for CSS vendor prefixes

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd book-store-cafe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```
   VITE_API_URL=http://localhost:3001/api
   VITE_APP_NAME=Book Café
   VITE_APP_VERSION=1.0.0
   ```


4. **Start development server**
  ```bash
  npm run dev
  ```
   
  > หากพบข้อความว่า `'vite' is not recognized as an internal or external command` ให้ติดตั้ง Vite ก่อนด้วยคำสั่ง:
  > ```bash
  > npm install vite --save-dev
  > ```

5. **เปิดเว็บเบราว์เซอร์**
  ไปที่ `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx      # Main navigation
│   └── ProtectedRoute.tsx
├── pages/              # Page components
│   ├── HomePage.tsx    # Landing page
│   ├── LoginPage.tsx   # User authentication
│   ├── RegisterPage.tsx
│   ├── BookingPage.tsx # Room booking interface
│   ├── DashboardPage.tsx # User dashboard
│   ├── RoomAvailabilityPage.tsx
│   └── BookLendingPage.tsx
├── store/              # State management
│   ├── authStore.ts    # Authentication state
│   └── bookingStore.ts # Booking and room state
├── types/              # TypeScript definitions
│   └── index.ts
├── utils/              # Utility functions
│   ├── api.ts         # API client configuration
│   └── helpers.ts     # Helper functions
└── hooks/             # Custom React hooks
```

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--cream: #F5F2E8;
--brown: #8B4513;
--gold: #DAA520;
--dark-brown: #3C2415;

/* Extended Palette */
/* Cream: 50-900 shades */
/* Brown: 50-900 shades */
/* Gold: 50-900 shades */
```

### Component Classes
```css
.btn-primary      /* Primary action buttons */
.btn-secondary    /* Secondary buttons */
.btn-outline      /* Outlined buttons */
.card            /* Card containers */
.input-field     /* Form inputs */
.page-container  /* Page layouts */
.section-title   /* Section headings */
```

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Type checking
npm run type-check   # Check TypeScript types
```

## 📱 Features by Page

### Homepage (`/`)
- Hero section with café introduction
- Quick action buttons for key features
- Feature highlights and zone information
- Call-to-action sections

### Registration (`/register`)
- Email, phone, and National ID validation
- Thai phone number and ID format support
- Password strength requirements
- Member benefits overview

### Login (`/login`)
- Dual authentication (email + phone)
- Secure session management
- Remember user preferences

### Room Booking (`/booking`) - Protected
- Interactive room selection
- Calendar date picker
- Time slot selection
- Real-time pricing calculation
- Discount application (15% for 5+ hours)
- Booking confirmation

### Dashboard (`/dashboard`) - Protected
- User profile information
- Upcoming bookings with QR codes
- Booking history
- Quick statistics

### Room Availability (`/room-availability`)
- Real-time room status
- 7-day availability calendar
- Time slot visualization
- Room information and pricing

### Book Lending (`/book-lending`)
- Complete lending system explanation
- Card system overview
- Step-by-step process guide
- Rules and guidelines
- Collection highlights

## 🔧 Configuration

### Environment Variables
- `VITE_API_URL`: Backend API endpoint
- `VITE_APP_NAME`: Application name
- `VITE_APP_VERSION`: Current version

### Tailwind Configuration
Custom color scheme and components are defined in `tailwind.config.js`

### API Integration
- Axios client with interceptors
- Automatic token management
- Error handling and retry logic
- Response formatting

## 🎯 Key Features Implementation

### Member Registration
- Thai National ID validation (13-digit with checksum)
- Phone number formatting and validation
- Email uniqueness checking
- Secure password hashing

### Room Booking System
- Real-time availability checking
- Conflict prevention
- Automatic pricing with discounts
- QR code generation
- Email notifications

### Authentication
- JWT token management
- Session persistence
- Route protection
- Auto-refresh handling

### State Management
- Zustand stores for auth and booking data
- localStorage integration
- Optimistic updates
- Error state handling

## 🌟 Future Enhancements

- [ ] Payment gateway integration
- [ ] SMS notifications
- [ ] Admin panel
- [ ] Analytics dashboard
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Advanced booking rules
- [ ] Loyalty program

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

---

Built with ❤️ for the Book Café community
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
