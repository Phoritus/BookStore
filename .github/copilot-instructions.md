<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Book Café Website Development Instructions

## Project Overview
This is a modern Book Café website built with React.js, TypeScript, and Tailwind CSS. The application features member registration, room booking system, and book lending information with a warm, minimal cream-brown design targeted at Gen Z users.

## Core Technologies
- **Frontend**: React.js with TypeScript
- **Styling**: Tailwind CSS with custom cream-brown color scheme
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Notifications**: React Hot Toast
- **Routing**: React Router DOM

## Design System
- **Primary Colors**: Cream (#F5F2E8), Brown (#8B4513), Gold (#DAA520)
- **Typography**: Inter (body), Playfair Display (headings)
- **Components**: Use predefined CSS classes (btn-primary, btn-secondary, card, input-field)
- **Responsive**: Mobile-first approach

## Key Features
1. **Member Management**: Registration with email, phone, and National ID
2. **Room Booking**: Real-time availability, pricing with discounts
3. **Book Lending**: Information-only system (in-café use only)
4. **Authentication**: JWT-based with localStorage persistence
5. **QR Codes**: Booking confirmations

## Code Standards
- Use TypeScript interfaces from `src/types/index.ts`
- Implement proper error handling with toast notifications
- Follow React best practices with hooks and functional components
- Use Tailwind CSS classes consistently
- Maintain responsive design principles

## API Integration
- All API calls use axios with interceptors
- Base URL configurable via environment variables
- Consistent error handling and response formatting
- Authentication tokens stored in localStorage

## State Management
- Auth state: `useAuthStore` (user, authentication status)
- Booking state: `useBookingStore` (bookings, rooms, availability)
- Persist auth state in localStorage for session management

## Validation
- Use Zod schemas for form validation
- Thai-specific validation for phone numbers and National ID
- Email validation for registration and login

When generating new code:
1. Follow the existing file structure and naming conventions
2. Use the established color scheme and design patterns
3. Implement proper TypeScript typing
4. Include loading states and error handling
5. Maintain accessibility standards
6. Keep the warm, welcoming aesthetic for the café atmosphere
