# Credit Score Assessment Platform

A modern, responsive frontend for a self-assessment credit scoring platform built with React and Vite.

## Features

### 🏠 Landing Page
- Modern hero section with animated credit score preview
- Feature showcase highlighting platform benefits
- How it works section with step-by-step process
- Call-to-action sections
- Responsive navigation and footer

### 🔐 Login Page
- Dual-mode authentication (Sign In / Sign Up)
- Social login options (Google, Facebook)
- Remember me functionality
- Password recovery option
- Beautiful gradient background with trust indicators
- Fully responsive design

### 📊 Credit Score Dashboard
- **Animated circular credit score graphic** (main feature)
  - Smooth counting animation
  - Color-coded based on score range
  - Interactive visual feedback
- Score breakdown by range (Poor to Excellent)
- Key metrics cards:
  - Payment History
  - Credit Utilization
  - Credit Age
- Score factors with positive/neutral indicators
- Personalized recommendations
- Recent activity timeline
- Responsive grid layout

## Tech Stack

- **React 18.2** - UI framework
- **React Router 6.20** - Client-side routing
- **Vite 5.0** - Build tool and dev server
- **CSS3** - Custom styling with CSS variables
- **SVG** - Custom graphics and animations

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
frontend2/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx              # App entry point
│   ├── App.jsx               # Main app component with routing
│   ├── index.css             # Global styles
│   ├── pages/
│   │   ├── LandingPage.jsx   # Landing/home page
│   │   ├── LoginPage.jsx     # Authentication page
│   │   └── CreditScorePage.jsx  # Dashboard with score circle
│   └── styles/
│       ├── LandingPage.css
│       ├── LoginPage.css
│       └── CreditScorePage.css
└── README.md
```

## Pages Overview

### Landing Page (`/`)
- Hero section with gradient background
- Credit score preview circle
- Features grid (6 key features)
- How it works (3-step process)
- CTA section
- Footer with links

### Login Page (`/login`)
- Toggle between Sign In and Sign Up
- Form validation
- Social authentication buttons
- Responsive split layout
- Demo: Enter any credentials to access dashboard

### Credit Score Dashboard (`/dashboard`)
- **Main Feature**: Large animated circular score graphic (724 score example)
- Score animates from 0 to target value on load
- Color-coded progress ring with gradient
- Score breakdown showing all ranges
- Three info cards with key metrics
- Score factors list
- Personalized recommendations
- Recent activity feed
- Logout functionality

## Color Scheme

- **Primary**: Indigo (#4f46e5) to Purple (#7c3aed) gradient
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Info**: Blue (#3b82f6)
- **Background**: Light gray (#f9fafb)
- **Text**: Dark gray (#111827)

## Key Features

### Credit Score Circle Animation
- Animated counting effect on load
- SVG-based circular progress indicator
- Gradient stroke with glow effect
- Score range from 300-850
- Color-coded by score quality
- Responsive and smooth animations

### Responsive Design
- Mobile-first approach
- Breakpoints at 640px, 768px, 968px, 1200px
- Fluid typography and spacing
- Touch-friendly UI elements

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
