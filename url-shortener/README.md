# URL Shortener - Production-Ready Link Management

A comprehensive, client-side URL shortener built with React, TypeScript, and Material UI. Features advanced analytics, custom shortcodes, expiry management, and professional UI/UX.

## 🚀 Features

### Core Functionality
- **Concurrent URL Management**: Shorten up to 5 URLs simultaneously per session
- **Custom Expiry**: Set validity periods from 1 minute to 1 week (default: 30 minutes)
- **Custom Shortcodes**: Optional alphanumeric shortcodes (3-20 characters)
- **Unique Links**: Guaranteed uniqueness across all shortened URLs
- **Client-Side Processing**: Complete functionality without backend dependencies

### Analytics & Tracking
- **Click Analytics**: Real-time click counting and detailed tracking
- **Geo-Location**: Automatic location detection for each click
- **Referrer Tracking**: Source tracking for traffic analysis
- **Timestamp Logging**: Detailed creation and click timestamps
- **Session Persistence**: Data preserved across browser sessions

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Material UI**: Modern, professional interface with consistent design
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Real-Time Validation**: Instant feedback for all user inputs
- **Copy-to-Clipboard**: One-click copying of shortened URLs

### Technical Excellence
- **TypeScript**: Full type safety and enhanced developer experience
- **Custom Logging**: Production-grade logging middleware (no console.log usage)
- **Error Handling**: Comprehensive error management with user-friendly messages
- **State Management**: Efficient React Context API implementation
- **Client-Side Routing**: React Router for seamless navigation

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Quick Start

1. **Download the project** using the "Download Code" button above
2. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`
3. **Start development server**:
   \`\`\`bash
   npm run dev
   \`\`\`
4. **Open your browser** and navigate to `http://localhost:3000`

### Build for Production
\`\`\`bash
npm run build
npm start
\`\`\`

## 📱 Usage Guide

### Creating Shortened URLs
1. Navigate to the main page (`/`)
2. Enter your long URL in the input field
3. Optionally set:
   - **Validity Period**: How long the link remains active (1-10080 minutes)
   - **Custom Shortcode**: Your preferred shortcode (3-20 alphanumeric characters)
4. Click "Shorten URL" to create your link
5. Copy the generated short URL using the copy button

### Managing Your URLs
- **View Active URLs**: See all your shortened URLs in the right panel
- **Copy Links**: One-click copying to clipboard
- **Test Redirects**: Open shortened URLs in new tabs
- **Delete URLs**: Remove URLs you no longer need
- **Monitor Expiry**: Visual indicators show time remaining

### Analytics & Statistics
1. Navigate to the Statistics page (`/statistics`)
2. View comprehensive analytics for all your URLs:
   - **Creation and expiry timestamps**
   - **Total click counts**
   - **Detailed click information** (expandable rows)
   - **Geographic data** for each click
   - **Referrer information**

### URL Redirection
- Access any shortened URL: `http://localhost:3000/[shortcode]`
- Automatic validation and expiry checking
- Click tracking with analytics
- Seamless redirect to original URL

## 🏗️ Architecture

### Project Structure
\`\`\`
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main application entry
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── pages/            # Page components
│   │   ├── UrlShortenerPage.tsx
│   │   └── StatisticsPage.tsx
│   ├── Layout.tsx        # Application layout
│   ├── UrlForm.tsx       # URL creation form
│   ├── UrlList.tsx       # Active URLs display
│   └── RedirectHandler.tsx # Redirect processing
├── contexts/             # React Context providers
│   ├── LoggingContext.tsx # Custom logging system
│   └── UrlContext.tsx    # URL state management
└── Configuration files
\`\`\`

### Key Technologies
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Full type safety and enhanced development experience
- **Material UI 5**: Professional component library with theming
- **React Router 6**: Client-side routing and navigation
- **Next.js 14**: React framework with App Router
- **date-fns**: Date manipulation and formatting
- **Local Storage**: Client-side data persistence

## 🔧 Technical Details

### State Management
- **React Context API**: Global state management for URLs and logging
- **Local Storage**: Persistent data storage across sessions
- **Real-time Updates**: Automatic expiry checking and status updates

### Validation System
- **URL Validation**: Native URL constructor for format checking
- **Shortcode Validation**: Alphanumeric pattern matching with length limits
- **Uniqueness Checking**: Collision detection for custom shortcodes
- **Input Sanitization**: XSS prevention and data cleaning

### Analytics Engine
- **Geo-location API**: Integration with ipapi.co for location data
- **Click Tracking**: Comprehensive click event logging
- **Referrer Analysis**: Source tracking for traffic insights
- **Data Visualization**: Expandable tables with detailed information

### Logging System
- **Custom Middleware**: Production-grade logging without console.log
- **Log Levels**: INFO, WARN, ERROR, DEBUG categorization
- **Persistent Logging**: Local storage with automatic cleanup
- **Structured Data**: JSON-formatted log entries with timestamps

## 🎯 Browser Compatibility

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 📊 Performance Features

- **Code Splitting**: Automatic bundle optimization
- **Lazy Loading**: Component-level lazy loading
- **Memoization**: React.memo and useMemo optimizations
- **Local Storage**: Efficient client-side caching

## 🔒 Security Considerations

- **Input Validation**: Comprehensive client-side validation
- **XSS Prevention**: Input sanitization and safe rendering
- **URL Validation**: Malicious URL detection
- **Rate Limiting**: 5 concurrent URL limit per session

## 🤝 Contributing

This is a production-ready application designed for educational and professional use. The codebase follows industry best practices and is suitable for extension and customization.

## 📄 License

This project is provided as-is for educational and professional development purposes.
