# URL Shortener

A modern, client-side URL shortener built with React, TypeScript, and Material UI.

## Features

- Shorten up to 5 URLs concurrently per session
- Custom validity periods for each URL (1-1440 minutes)
- Optional custom shortcodes
- Real-time analytics tracking:
  - Click counts
  - Click timestamps
  - Referrer information
  - Geolocation data
- Responsive design for both desktop and mobile
- Client-side routing and storage
- Comprehensive error handling
- Accessibility features

## Technical Stack

- React 18
- TypeScript
- Material UI
- React Router
- Client-side storage (localStorage)
- IP Geolocation API (ipapi.co)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd url-shortener
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```
5. Open 

https://youtube.com/shorts/p1OJVO6z3o0?si=BSs3wI3CiEI6yUQF
in your browser

## Usage

1. Enter a URL in the input field
2. (Optional) Set a custom validity period (default: 30 minutes)
3. (Optional) Set a custom shortcode
4. Click "Shorten URL"
5. Copy and share the shortened URL
6. View analytics in the Statistics page

## Features in Detail

### URL Shortening
- Input validation for URLs
- Custom validity periods (1-1440 minutes)
- Optional custom shortcodes (4-10 alphanumeric characters)
- Automatic expiry handling

### Analytics
- Click tracking
- Geolocation data
- Referrer tracking
- Timestamp logging

### User Interface
- Clean, modern Material UI design
- Responsive layout
- Accessibility features
- Error handling and feedback

## Development

Here is a screenshot:
![dcec3f35-8e1b-44a0-aab0-0fbe7dd9c224](https://github.com/user-attachments/assets/53a668a5-f87b-462c-ad88-c4d4e59f7bd0)
![cd954d2d-c827-4d52-98ee-e8e4b5abf247](https://github.com/user-attachments/assets/a74dc580-b105-4e29-9cb6-0f25fcb5f523)
![ee43a7d3-c67e-4459-9b0e-98fffe8232c5](https://github.com/user-attachments/assets/79857f37-d97b-4b11-b2d9-b8c38fdbe7c3)
![e3962c22-45d0-4d92-8641-c6841f20c1fa](https://github.com/user-attachments/assets/f3d4c621-5480-469c-8630-fb9a16d18608)



### Project Structure

```
src/
├── components/      # React components
├── context/        # React context providers
├── services/       # External service integrations
├── types/          # TypeScript type definitions
├── middleware/     # Custom middleware (logging)
└── App.tsx         # Main application component
```

### Key Components

- `UrlShortenerForm`: Main URL input form
- `UrlStatistics`: Analytics display
- `UrlRedirect`: Handles URL redirection
- `UrlContext`: Global state management
- `LoggingMiddleware`: Custom logging solution

## License

This project is open source and available under the MIT License.
